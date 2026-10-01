import type { SiteContent } from "@/types/content";

export function buildStructuredData(content: SiteContent, siteUrl: string) {
  const url = `${siteUrl}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: content.meta.title,
        url,
        description: content.meta.description,
        inLanguage: "ru",
      },
      {
        "@type": "Person",
        name: "Павел Шарагулов",
        url,
        jobTitle: "Преподаватель английского языка",
        sameAs: [content.meta.telegramUrl],
      },
      {
        "@type": "Service",
        name: "Подготовка к ЕГЭ по английскому",
        serviceType: "Онлайн-подготовка к ЕГЭ по английскому языку",
        url,
        areaServed: "RU",
        provider: {
          "@type": "Person",
          name: "Павел Шарагулов",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
