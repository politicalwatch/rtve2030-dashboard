export default defineNuxtPlugin({
  setup() {
    const api = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase,
      // interceptors TBD https://github.com/unjs/ofetch
      onRequest({ request, options }) {
        const authStore = useAuthStore();
        const token = authStore.session?.access_token;

        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      },
    });

    return {
      provide: {
        api,
      },
    };
  },
});
