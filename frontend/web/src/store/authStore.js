import { create } from "zustand";

// 🔹 Synchronously read session from localStorage on module load
const getInitialSession = () => {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return { user: null, accessToken: null, refreshToken: null };
    const session = JSON.parse(raw);
    return {
      user: session.user ?? null,
      accessToken: session.accessToken ?? null,
      refreshToken: session.refreshToken ?? null,
    };
  } catch {
    localStorage.removeItem("session");
    return { user: null, accessToken: null, refreshToken: null };
  }
};

const initialSession = getInitialSession();

export const useAuthStore = create((set, get) => ({
  user: initialSession.user,
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  isInit: true,

  /**
   * =====================
   * SET FULL SESSION
   * =====================
   */
  setSession: ({ user, accessToken, refreshToken }) => {
    const current = get();

    const nextSession = {
      user: user ?? current.user,
      accessToken: accessToken ?? current.accessToken,
      refreshToken: refreshToken ?? current.refreshToken,
    };

    localStorage.setItem("session", JSON.stringify(nextSession));

    set(nextSession);
  },

  /**
   * =====================
   * UPDATE USER ONLY
   * =====================
   * Used after govt verification
   */
  updateUser: (user) => {
    const { accessToken, refreshToken } = get();

    const nextSession = { user, accessToken, refreshToken };

    localStorage.setItem("session", JSON.stringify(nextSession));
    set({ user });
  },

  /**
   * =====================
   * REFRESH ACCESS TOKEN
   * =====================
   */
  refreshAccessToken: async (refreshToken) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const { accessToken: newAccessToken, user } = await response.json();

      const nextSession = { user, accessToken: newAccessToken, refreshToken };

      localStorage.setItem("session", JSON.stringify(nextSession));
      set(nextSession);

      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      get().logout();
      throw error;
    }
  },

  /**
   * =====================
   * LOGOUT
   * =====================
   */
  logout: async () => {
    // Call backend logout to clear cookies
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout API call failed:", e);
    }

    // Clear localStorage and state
    localStorage.removeItem("session");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  /**
   * =====================
   * INIT SESSION
   * =====================
   */
  initSession: () => {
    const raw = localStorage.getItem("session");
    if (!raw) return set({ isInit: true });

    try {
      const session = JSON.parse(raw);
      set({
        user: session.user ?? null,
        accessToken: session.accessToken ?? null,
        refreshToken: session.refreshToken ?? null,
        isInit: true,
      });
    } catch {
      localStorage.removeItem("session");
      set({ isInit: true });
    }
  },

  /**
   * =====================
   * CHECK AUTH
   * =====================
   */
  checkAuth: () => {
    const raw = localStorage.getItem("session");
    if (!raw) return false;

    try {
      const session = JSON.parse(raw);
      return Boolean(session.user && session.accessToken);
    } catch {
      return false;
    }
  },
}));
