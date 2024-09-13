export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  authStore.restoreSession();
  if (!authStore.session) {
    return navigateTo("/login");
  }
});
