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

function applyDocumentMeta(content: SiteContent) {
  document.title = content.meta.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", content.meta.description);
    return;
  }
  const meta = document.createElement("meta");
  meta.name = "description";
  meta.content = content.meta.description;
  document.head.appendChild(meta);
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
