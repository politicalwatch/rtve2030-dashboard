import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      user: null,
      session: null,
      error: null,
    };
  },
  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.user !== null && state.user.role === "admin",
  },
  actions: {
    async restoreSession() {
      const { $api } = useNuxtApp();
      const apiRepo = dashboardApiRepo($api);

      if (this.session) {
        console.log("Session already exists");
        return;
      }
      console.log("Restoring session");

      const sessionData = JSON.parse(
        localStorage.getItem("rtve2030-dashboard-auth")
      );

      if (!sessionData) {
        console.log("No session found");
      } else {
        this.session = sessionData;

        // Check if session is still valid
        const now = new Date().toISOString();

        console.log("Session expires at:", this.session.expires_at);
        console.log("Refresh expires at:", this.session.refresh_expires_at);

        // If session is expired, refresh it
        if (now > this.session.expires_at) {
          console.log("Session expired, refreshing");
          try {
            const refreshData = await apiRepo.refreshAuthToken(
              this.session.refresh_token
            );
            if (!refreshData) {
              this.error = "Error while refreshing session.";
              this.logout();
              return;
            } else {
              // Update session
              this.session = { ...this.session, ...refreshData };

              // Save session in localStorage
              localStorage.setItem(
                "rtve2030-dashboard-auth",
                JSON.stringify(this.session)
              );
            }
          } catch (e) {
            console.log(e);
            this.logout();
          }
        }

        const userData = await apiRepo.getCurrentUser();
        if (!userData) {
          this.error = "Error retrieving user data.";
          this.logout();
          return;
        } else {
          this.user = userData;
        }
      }
    },
    async login(username: string, password: string) {
      const { $api } = useNuxtApp();
      const apiRepo = dashboardApiRepo($api);

      this.error = null;
      try {
        const sessionData = await apiRepo.getAuthToken(username, password);
        if (!sessionData) {
          this.error = "Error while logging in.";
        } else {
          this.session = sessionData;

          const userData = await apiRepo.getCurrentUser();
          if (!userData) {
            this.error = "Error retrieving user data.";
            this.session = null;
            return;
          } else {
            this.user = userData;
          }

          // Save session in localStorage
          localStorage.setItem(
            "rtve2030-dashboard-auth",
            JSON.stringify(sessionData)
          );
        }
      } catch (e) {
        this.error = e.response?.data?.detail ?? e.message;
      }
    },
    async logout() {
      // Remove session from localStorage
      localStorage.removeItem("rtve2030-dashboard-auth");

      // Remove session from store
      this.user = null;
      this.session = null;

      // Remove auth header for axios and redirect
      location.assign("/");
    },
  },
});
