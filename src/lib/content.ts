import siteDefaultJson from "@/content/site.default.json";
import { siteContentSchema, type PricingPlanContent, type SiteContent } from "@/types/content";

export const defaultSiteContent: SiteContent = siteContentSchema.parse(siteDefaultJson);

const COLLECTIONS = {
  meta: "content_meta",
  hero: "content_hero",
  plans: "content_pricing_plans",
  faq: "content_faq",
  lead: "content_lead_form",
} as const;

function pocketBaseBaseUrl(): string {
  return import.meta.env.VITE_POCKETBASE_URL?.trim().replace(/\/$/, "") ?? "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Editor fields come back as HTML. The page renders plain text. */
function plainText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text.length > 0 ? text : null;
}

function textOr(record: Record<string, unknown>, key: string, fallback: string): string {
  return plainText(record[key]) ?? fallback;
}

function optionalText(record: Record<string, unknown>, key: string): string | undefined {
  return plainText(record[key]) ?? undefined;
}

function featureLines(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const line = plainText(item);
      return line ? [line] : [];
    });
  }
  const text = plainText(value);
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function planType(value: unknown): "individual" | "group" | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "individual" || raw === "group") return raw;
  return null;
}

function sortOrder(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

async function fetchRecords(
  baseUrl: string,
  collection: string,
  query: string,
): Promise<unknown[] | null> {
  const response = await fetch(
    `${baseUrl}/api/collections/${collection}/records?${query}`,
    {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) return null;
  const body: unknown = await response.json();
  if (!isRecord(body) || !Array.isArray(body.items)) return null;
  return body.items;
}

function firstRecord(items: unknown[] | null): Record<string, unknown> | null {
  const record = items?.[0];
  return isRecord(record) ? record : null;
}

function readMeta(record: Record<string, unknown> | null): SiteContent["meta"] | null {
  if (!record) return null;
  const fallback = defaultSiteContent.meta;
  return {
    title: textOr(record, "title", fallback.title),
    description: textOr(record, "description", fallback.description),
    telegramUrl: textOr(record, "telegramUrl", fallback.telegramUrl),
    workingHours: textOr(record, "workingHours", fallback.workingHours),
  };
}

function readHero(record: Record<string, unknown> | null): SiteContent["hero"] | null {
  if (!record) return null;
  const fallback = defaultSiteContent.hero;
  return {
    title: textOr(record, "title", fallback.title),
    introBefore: textOr(record, "introBefore", fallback.introBefore),
    introHighlight: plainText(record.introHighlight) ?? "",
    introAfter: plainText(record.introAfter) ?? "",
    ctaLabel: textOr(record, "ctaLabel", fallback.ctaLabel),
    photoAlt: textOr(record, "photoAlt", fallback.photoAlt),
  };
}

function readPlans(items: unknown[] | null): {
  individual: PricingPlanContent[];
  group: PricingPlanContent[];
} | null {
  if (!items || items.length === 0) return null;

  const descriptions = new Map<string, string>();
  for (const plan of [
    ...defaultSiteContent.pricing.plansIndividual,
    ...defaultSiteContent.pricing.plansGroup,
  ]) {
    descriptions.set(plan.id, plan.description);
  }

  type RankedPlan = PricingPlanContent & { sort: number };
  const individual: RankedPlan[] = [];
  const group: RankedPlan[] = [];

  items.forEach((item, index) => {
    if (!isRecord(item)) return;
    const id = plainText(item.planId);
    const name = plainText(item.name);
    const type = planType(item.type);
    const features = featureLines(item.features);
    if (!id || !name || !type || features.length === 0) return;

    const plan: PricingPlanContent = {
      id,
      name,
      description: plainText(item.description) ?? descriptions.get(id) ?? "",
      price: plainText(item.price) ?? "",
      priceNote: plainText(item.priceNote) ?? "",
      ctaLabel: plainText(item.ctaLabel) ?? "",
      features,
    };
    const priceUnit = optionalText(item, "priceUnit");
    const originalPrice = optionalText(item, "originalPrice");
    const featuredLabel = optionalText(item, "featuredLabel");
    if (priceUnit) plan.priceUnit = priceUnit;
    if (originalPrice) plan.originalPrice = originalPrice;
    if (featuredLabel) plan.featuredLabel = featuredLabel;
    if (item.isFeatured === true) plan.ctaPrimary = true;

    const bucket = type === "group" ? group : individual;
    bucket.push({ ...plan, sort: sortOrder(item.sortOrder, index) });
  });

  const bySort = (left: RankedPlan, right: RankedPlan) => left.sort - right.sort;
  const strip = ({ sort, ...plan }: RankedPlan): PricingPlanContent => {
    void sort;
    return plan;
  };

  return {
    individual: individual.sort(bySort).map(strip),
    group: group.sort(bySort).map(strip),
  };
}

function readFaq(items: unknown[] | null): SiteContent["faq"]["items"] | null {
  if (!items || items.length === 0) return null;
  const rows = items.flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const question = plainText(item.question);
    const answer = plainText(item.answer);
    if (!question || !answer) return [];
    return [{ question, answer, sort: sortOrder(item.sortOrder, index) }];
  });
  if (rows.length === 0) return null;
  return rows
    .sort((left, right) => left.sort - right.sort)
    .map(({ question, answer }) => ({ question, answer }));
}

function readLead(record: Record<string, unknown> | null): Partial<SiteContent["leadForm"]> | null {
  if (!record) return null;
  const patch: Partial<SiteContent["leadForm"]> = {};
  const keys = [
    "badge",
    "title",
    "subtitle",
    "contactLabel",
    "contactPlaceholder",
    "submitLabel",
    "directNote",
    "replyNote",
  ] as const;
  for (const key of keys) {
    const value = plainText(record[key]);
    if (value) patch[key] = value;
  }
  return patch;
}

function assemble(parts: {
  meta: SiteContent["meta"] | null;
  hero: SiteContent["hero"] | null;
  plans: ReturnType<typeof readPlans>;
  faq: SiteContent["faq"]["items"] | null;
  lead: Partial<SiteContent["leadForm"]> | null;
}): SiteContent | null {
  const individual = parts.plans?.individual ?? [];
  const group = parts.plans?.group ?? [];
  const next: SiteContent = {
    ...defaultSiteContent,
    meta: parts.meta ?? defaultSiteContent.meta,
    hero: parts.hero ?? defaultSiteContent.hero,
    pricing: {
      ...defaultSiteContent.pricing,
      plansIndividual:
        individual.length > 0 ? individual : defaultSiteContent.pricing.plansIndividual,
      plansGroup: group.length > 0 ? group : defaultSiteContent.pricing.plansGroup,
    },
    faq: {
      ...defaultSiteContent.faq,
      items: parts.faq ?? defaultSiteContent.faq.items,
    },
    leadForm: {
      ...defaultSiteContent.leadForm,
      ...parts.lead,
    },
  };
  const parsed = siteContentSchema.safeParse(next);
  return parsed.success ? parsed.data : null;
}

/**
 * Собирает контент из плоских коллекций PocketBase.
 * Поля, которых нет в админке (кейсы, шапка тарифов, подписи формы),
 * остаются из site.default.json. При ошибке сети или схемы — весь локальный документ.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  const baseUrl = pocketBaseBaseUrl();
  if (!baseUrl) return defaultSiteContent;

  try {
    const [metaItems, heroItems, planItems, faqItems, leadItems] = await Promise.all([
      fetchRecords(baseUrl, COLLECTIONS.meta, "perPage=1&skipTotal=1"),
      fetchRecords(baseUrl, COLLECTIONS.hero, "perPage=1&skipTotal=1"),
      fetchRecords(baseUrl, COLLECTIONS.plans, "perPage=200&skipTotal=1&sort=sortOrder"),
      fetchRecords(baseUrl, COLLECTIONS.faq, "perPage=200&skipTotal=1&sort=sortOrder"),
      fetchRecords(baseUrl, COLLECTIONS.lead, "perPage=1&skipTotal=1"),
    ]);

    const missing: string[] = [];
    if (!metaItems) missing.push(COLLECTIONS.meta);
    if (!heroItems) missing.push(COLLECTIONS.hero);
    if (!planItems) missing.push(COLLECTIONS.plans);
    if (!faqItems) missing.push(COLLECTIONS.faq);
    if (!leadItems) missing.push(COLLECTIONS.lead);

    if (missing.length === 5) {
      console.warn(
        "[content] Коллекции PocketBase недоступны. Показан локальный контент.",
      );
      return defaultSiteContent;
    }
    if (missing.length > 0) {
      console.warn(
        `[content] Не прочитаны коллекции: ${missing.join(", ")}. Для них оставлен локальный контент.`,
      );
    }

    const content = assemble({
      meta: readMeta(firstRecord(metaItems)),
      hero: readHero(firstRecord(heroItems)),
      plans: readPlans(planItems),
      faq: readFaq(faqItems),
      lead: readLead(firstRecord(leadItems)),
    });
    if (!content) {
      console.warn("[content] Сборка контента не прошла схему. Показан локальный контент.");
      return defaultSiteContent;
    }
    return content;
  } catch (error) {
    console.warn("[content] Не удалось загрузить контент из PocketBase.", error);
    return defaultSiteContent;
  }
}
