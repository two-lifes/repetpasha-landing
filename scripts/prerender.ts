import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { build, loadEnv, type Plugin } from "vite";

type FaqItem = { question: string; answer: string };

type SiteDefaults = {
  meta: { title: string; description: string; telegramUrl: string };
  faq: { items: FaqItem[] };
};

function escapeAttr(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function readDefaults(root: string): SiteDefaults {
  const file = path.resolve(root, "src/content/site.default.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as SiteDefaults;
}

function siteUrlFrom(root: string, mode: string): string {
  const env = loadEnv(mode, root, "");
  return (env.VITE_SITE_URL?.trim() || "https://repetpasha.ru").replace(/\/$/, "");
}

function structuredData(content: SiteDefaults, siteUrl: string) {
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
        provider: { "@type": "Person", name: "Павел Шарагулов" },
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function prerenderPlugin(): Plugin {
  let root = "";
  let outDir = "";
  let mode = "production";

  return {
    name: "prerender-app",
    configResolved(config) {
      root = config.root;
      mode = config.mode;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      const content = readDefaults(root);
      const siteUrl = siteUrlFrom(root, mode);
      const title = escapeAttr(content.meta.title);
      const description = escapeAttr(content.meta.description);
      const jsonLd = JSON.stringify(structuredData(content, siteUrl)).replaceAll("<", "\\u003c");

      return html
        .replaceAll("<!--seo-title-->", title)
        .replaceAll("<!--seo-description-->", description)
        .replaceAll("<!--seo-url-->", `${siteUrl}/`)
        .replaceAll("<!--seo-image-->", `${siteUrl}/og.jpg`)
        .replace(
          '<script id="seo-jsonld" type="application/ld+json"></script>',
          `<script id="seo-jsonld" type="application/ld+json">${jsonLd}</script>`,
        );
    },
    async closeBundle() {
      const serverOutDir = path.resolve(root, "dist/server");
      await build({
        root,
        configFile: false,
        plugins: [react(), tailwindcss()],
        resolve: { alias: { "@": path.resolve(root, "src") } },
        build: {
          ssr: path.resolve(root, "src/entry-server.tsx"),
          outDir: serverOutDir,
          emptyOutDir: true,
        },
        logLevel: "warn",
      });

      const { render } = (await import(pathToFileURL(path.join(serverOutDir, "entry-server.js")).href)) as {
        render: () => { html: string };
      };
      const indexPath = path.join(outDir, "index.html");
      const page = fs.readFileSync(indexPath, "utf8");
      const { html: appHtml } = render();
      if (!page.includes('<div id="root"></div>')) {
        throw new Error("Prerender: #root placeholder is missing from dist/index.html");
      }
      fs.writeFileSync(indexPath, page.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`));
      fs.rmSync(serverOutDir, { recursive: true, force: true });
    },
  };
}
