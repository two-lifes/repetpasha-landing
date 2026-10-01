import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteContent, fetchSiteContent } from "@/lib/content";
import type { SiteContent } from "@/types/content";

const ContentContext = createContext<SiteContent>(defaultSiteContent);

function setMeta(attribute: "name" | "property", key: string, value: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", value);
}

function applyDocumentMeta(content: SiteContent) {
  document.title = content.meta.title;
  setMeta("name", "description", content.meta.description);
  setMeta("property", "og:title", content.meta.title);
  setMeta("property", "og:description", content.meta.description);
  setMeta("name", "twitter:title", content.meta.title);
  setMeta("name", "twitter:description", content.meta.description);
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    let cancelled = false;
    void fetchSiteContent().then((next) => {
      if (!cancelled) {
        setContent(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    applyDocumentMeta(content);
  }, [content]);

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}
