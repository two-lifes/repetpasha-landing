import { z } from "zod";

const mockupTypeSchema = z.enum([
  "essay_38",
  "email_37",
  "speaking_4",
  "speaking_3",
  "grammar_19_24",
  "word_formation_25_29",
  "lexicon_30_36",
  "listening_1_9",
  "reading_10_18",
]);

const pricingPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.string(),
  priceUnit: z.string().optional(),
  originalPrice: z.string().optional(),
  priceNote: z.string(),
  featuredLabel: z.string().optional(),
  ctaLabel: z.string(),
  ctaPrimary: z.boolean().optional(),
  features: z.array(z.string()).min(1),
});

const standardSchema = z.object({
  key: z.enum(["audit", "hours", "chat"]),
  title: z.string(),
  body: z.string(),
});

export const siteContentSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    telegramUrl: z.string(),
    workingHours: z.string(),
  }),
  hero: z.object({
    title: z.string(),
    introBefore: z.string(),
    introHighlight: z.string(),
    introAfter: z.string(),
    ctaLabel: z.string(),
    photoAlt: z.string(),
  }),
  cases: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    wheelLabel: z.string(),
    wheelAction: z.string(),
  }),
  wheelModules: z
    .array(
      z.object({
        title: z.string(),
        comment: z.string(),
        mockupType: mockupTypeSchema,
        link: z.string(),
      }),
    )
    .min(1),
  pricing: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    tabIndividual: z.string(),
    tabGroups: z.string(),
    plansIndividual: z.array(pricingPlanSchema).min(1),
    plansGroup: z.array(pricingPlanSchema).min(1),
    standards: z.array(standardSchema).min(1),
    footerText: z.string(),
    footerCta: z.string(),
  }),
  faq: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .min(1),
    footerText: z.string(),
    footerCta: z.string(),
  }),
  leadForm: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    valuePoints: z.array(z.string()).min(1),
    directNote: z.string(),
    successTitle: z.string(),
    successWithEndpoint: z.string(),
    successWithoutEndpoint: z.string(),
    nameLabel: z.string(),
    nameHint: z.string(),
    namePlaceholder: z.string(),
    contactLabel: z.string(),
    contactPlaceholder: z.string(),
    contactError: z.string(),
    gradeLegend: z.string(),
    grades: z
      .array(
        z.object({
          value: z.enum(["10", "11", "graduate"]),
          label: z.string(),
        }),
      )
      .min(1),
    gradeError: z.string(),
    submitError: z.string(),
    submitLabel: z.string(),
    pendingLabel: z.string(),
    replyNote: z.string(),
    messageHeader: z.string(),
  }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type PricingPlanContent = z.infer<typeof pricingPlanSchema>;
export type WheelModuleContent = SiteContent["wheelModules"][number];
