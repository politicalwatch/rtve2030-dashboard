export default defineNuxtPlugin({
  setup() {
    const api = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase, 
      // interceptors TBD https://github.com/unjs/ofetch
    });
    return {
      provide: {
        api,
      },
    };
  },
});
