// Use recommended recipe: https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetch
export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const { session } = storeToRefs(authStore);

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,
    // interceptors TBD https://github.com/unjs/ofetch
    onRequest({ request, options, error }) {
      if (session.value) {
        const headers = (options.headers as HeadersInit) || [];
        if (Array.isArray(headers)) {
          headers.push([
            "Authorization",
            `Bearer ${session.value.access_token}`,
          ]);
        } else if (headers instanceof Headers) {
          headers.set("Authorization", `Bearer ${session.value.access_token}`);
        } else {
          headers.Authorization = `Bearer ${session.value.access_token}`;
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/login"));
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
