// https://nuxt.com/docs/api/configuration/nuxt-config
import dsv from "@rollup/plugin-dsv";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/google-fonts"
  ],
  css: ["@/assets/css/global.css", "@/assets/fonts/iosevka.css"],
  
  ssr: false,
  imports: {
    dirs: ["types/*.ts"],
  },
  googleFonts: {
    families: {
      "Roboto+Slab": [400, 600],
    }
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