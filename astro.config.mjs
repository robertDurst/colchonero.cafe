// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://colchonero.cafe",
  trailingSlash: "never",
  build: { format: "directory" },
});
