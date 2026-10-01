import { renderToString } from "react-dom/server";
import App from "@/App";
import { ContentProvider } from "@/context/ContentContext";
import { defaultSiteContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site-config";
import { buildStructuredData } from "@/seo/structured-data";

export function render() {
  const html = renderToString(
    <ContentProvider>
      <App />
    </ContentProvider>,
  );

  return {
    html,
    jsonLd: buildStructuredData(defaultSiteContent, SITE_URL),
    title: defaultSiteContent.meta.title,
    description: defaultSiteContent.meta.description,
    siteUrl: SITE_URL,
  };
}
