import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isInit: false,
  setSession: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem(
      "session",
      JSON.stringify({ user, accessToken, refreshToken })
    );

    set({ user, accessToken, refreshToken });
  },

  logout: () => {
    localStorage.removeItem("session");
    set({ user: null, accessToken: null, refreshToken: null });
  },

  initSession: () => {
    const raw = localStorage.getItem("session");
    if (!raw) return set({ isInit: true });

    try {
      const session = JSON.parse(raw);
      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isInit: true,
      });
    } catch {
      localStorage.removeItem("session");
      set({ isInit: true });
    }
  },

  checkAuth: () => {
    const raw = localStorage.getItem("session");
    if (!raw) return false;

    try {
      const session = JSON.parse(raw);
      return !!session.user;
    } catch {
      return false;
    }
  },
}));
