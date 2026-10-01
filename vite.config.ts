import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { prerenderPlugin } from "./scripts/prerender.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderPlugin()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
