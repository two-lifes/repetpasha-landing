import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { ContentProvider } from "@/context/ContentContext";
import "./index.css";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("Root element #root not found");
}

const tree = (
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>
);

if (root.childElementCount > 0) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
