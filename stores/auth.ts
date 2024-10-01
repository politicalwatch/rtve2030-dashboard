import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user: Ref<AuthUser | null> = ref(null);
  const session: Ref<AuthSession | null> = ref(null);
  const error: Ref<string | null> = ref(null);

  const isLoggedIn = computed(() => user.value !== null);
  const isAdmin = computed(
    () => user.value !== null && user.value.role === "admin"
  );

  const restoreSession = async () => {
    const { $api } = useNuxtApp();
    const apiRepo = dashboardApiRepo($api);

    if (session.value) {
      console.log("Session already exists");
      return;
    }
    console.log("Restoring session");

    const sessionData = JSON.parse(
      localStorage.getItem("rtve2030-dashboard-auth") as string
    );

    if (!sessionData) {
      console.log("No session found");
    } else {
      session.value = sessionData;

      if (!session.value) {
        console.log("Problem with session data");
        return;
      }

      // Check if session is still valid
      const now = new Date().toISOString();

      console.log("Session expires at:", session.value?.expires_at);
      console.log("Refresh expires at:", session.value?.refresh_expires_at);

      // If session is expired, refresh it
      if (now > session.value.expires_at) {
        console.log("Session expired, refreshing");
        try {
          const refreshData = await apiRepo.refreshAuthToken(
            session.value.refresh_token
          );
          if (!refreshData) {
            error.value = "Error while refreshing session.";
            logout();
            return;
          } else {
            // Update session
            session.value = { ...session.value, ...refreshData };

            // Save session in localStorage
            localStorage.setItem(
              "rtve2030-dashboard-auth",
              JSON.stringify(session.value)
            );
          }
        } catch (e) {
          console.log(e);
          logout();
        }
      }

      const userData = await apiRepo.getCurrentUser();
      if (!userData) {
        error.value = "Error retrieving user data.";
        logout();
        return;
      } else {
        user.value = userData;
      }
    }
  };

  const login = async (username: string, password: string) => {
    const { $api } = useNuxtApp();
    const apiRepo = dashboardApiRepo($api);

    error.value = null;
    try {
      const sessionData = await apiRepo.getAuthToken(username, password);
      if (!sessionData) {
        error.value = "Error while logging in.";
      } else {
        session.value = sessionData;

        const userData = await apiRepo.getCurrentUser();
        if (!userData) {
          error.value = "Error retrieving user data.";
          session.value = null;
          return;
        } else {
          user.value = userData;
        }

        // Save session in localStorage
        localStorage.setItem(
          "rtve2030-dashboard-auth",
          JSON.stringify(sessionData)
        );
      }
    } catch (e: any) {
      error.value = e.response?.data?.detail ?? e.message;
    }
  };
  const logout = async () => {
    // Remove session from localStorage
    localStorage.removeItem("rtve2030-dashboard-auth");

    // Remove session from store
    user.value = null;
    session.value = null;

    // Remove auth header for axios and redirect
    location.assign("/");
  };

  return {
    user,
    session,
    error,
    isLoggedIn,
    isAdmin,
    restoreSession,
    login,
    logout,
  };
});
