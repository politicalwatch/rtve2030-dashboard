// https://nuxt.com/docs/api/configuration/nuxt-config
import dsv from "@rollup/plugin-dsv";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@nuxt/icon"],
  imports: {
    dirs: ["types/*.ts"],
  },

  tailwindcss: {
    exposeConfig: {
      level: 4,
      alias: "#twcss", // if you want to change alias
    },
  },
  runtimeConfig: {
    public: {
      
    },
  },
  vite: {
    plugins: [dsv()],
  },
});