import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/lbean-preview/",
  define: {
    "window.__LET_BEAN_BASE_PATH__": JSON.stringify("/lbean-preview"),
  },
  plugins: [react()],
  build: {
    outDir: "github-pages-dist",
    emptyOutDir: true,
  },
});
