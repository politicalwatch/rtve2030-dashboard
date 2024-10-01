export default defineNuxtPlugin({
  setup() {
    const api = $fetch.create({
      baseURL: useRuntimeConfig().public.apiBase,
      // interceptors TBD https://github.com/unjs/ofetch
      onRequest({ request, options }) {
        const authStore = useAuthStore();
        const session = authStore.session;
        const headers = (options.headers as HeadersInit) || [];

        if (session) {
          if (Array.isArray(headers)) {
            headers.push(["Authorization", `Bearer ${session.access_token}`]);
          } else if (headers instanceof Headers) {
            headers.set("Authorization", `Bearer ${session.access_token}`);
          } else {
            headers.Authorization = `Bearer ${session.access_token}`;
          }
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
