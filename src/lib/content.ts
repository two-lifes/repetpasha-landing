import siteDefaultJson from "@/content/site.default.json";
import { siteContentSchema, type SiteContent } from "@/types/content";

export const defaultSiteContent: SiteContent = siteContentSchema.parse(siteDefaultJson);

const POCKETBASE_SECTION = "main";

function pocketBaseBaseUrl(): string {
  return import.meta.env.VITE_POCKETBASE_URL?.trim().replace(/\/$/, "") ?? "";
}

function parseRecordData(data: unknown): SiteContent | null {
  const payload: unknown =
    typeof data === "string"
      ? (() => {
          try {
            return JSON.parse(data) as unknown;
          } catch {
            return null;
          }
        })()
      : data;

  if (payload === null) {
    return null;
  }

  const parsed = siteContentSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

/**
 * Загружает документ `section = main` из PocketBase.
 * При пустом URL, ошибке сети или невалидной схеме возвращает fallback.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  const baseUrl = pocketBaseBaseUrl();
  if (!baseUrl) {
    return defaultSiteContent;
  }

  const filter = encodeURIComponent(`section="${POCKETBASE_SECTION}"`);
  const url = `${baseUrl}/api/collections/site_content/records?filter=${filter}&perPage=1`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn(
        `[content] PocketBase ответил ${response.status}. Показан локальный контент.`,
      );
      return defaultSiteContent;
    }

    const body: unknown = await response.json();
    const items =
      body !== null &&
      typeof body === "object" &&
      "items" in body &&
      Array.isArray(body.items)
        ? body.items
        : [];

    const record = items[0];
    const data =
      record !== null && typeof record === "object" && "data" in record
        ? record.data
        : undefined;

    const content = parseRecordData(data);
    if (!content) {
      console.warn(
        "[content] Ответ PocketBase не прошёл схему siteContent. Показан локальный контент.",
      );
      return defaultSiteContent;
    }

    return content;
  } catch (error) {
    console.warn("[content] Не удалось загрузить контент из PocketBase.", error);
    return defaultSiteContent;
  }
}
