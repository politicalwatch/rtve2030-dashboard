// https://nuxt.com/docs/api/configuration/nuxt-config
import dsv from "@rollup/plugin-dsv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const appDir = dirname(fileURLToPath(import.meta.url));
const projDir = resolve(appDir, ".");

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],
  css: ["@/assets/css/global.css", "@/assets/fonts/iosevka.css"],
  alias: {
    "@types": resolve(projDir, "types"),
  },
  ssr: false,
  imports: {
    dirs: ["types/*.ts"],
  },
  googleFonts: {
    families: {
      "Roboto+Slab": [400, 600],
    },
  },

  tailwindcss: {
    exposeConfig: {
      level: 4,
      alias: "#twcss", // if you want to change alias
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "https://api-rtve2030.rtve.es", // overwritten by NUXT_PUBLIC_API_BASE if LOADED FROM .env
    },
  },
  vite: {
    plugins: [dsv()],
  },
});
