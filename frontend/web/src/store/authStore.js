import { create } from "zustand";

let expiryTimer = null;

const clearExpiryTimer = () => {
  if (expiryTimer) {
    window.clearTimeout(expiryTimer);
    expiryTimer = null;
  }
};

const getTokenExpiryMs = (token) => {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(window.atob(paddedPayload));
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const expiresAt = getTokenExpiryMs(token);
  return Boolean(expiresAt && expiresAt <= Date.now());
};

const scheduleTokenExpiry = (token, expireSession) => {
  clearExpiryTimer();

  const expiresAt = getTokenExpiryMs(token);
  if (!expiresAt) return;

  const msUntilExpiry = expiresAt - Date.now();
  if (msUntilExpiry <= 0) {
    expireSession();
    return;
  }

  expiryTimer = window.setTimeout(expireSession, msUntilExpiry);
};

const emptySession = (sessionExpired = false) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionExpired,
});

const getInitialSession = () => {
  try {
    const raw = localStorage.getItem("session");
    if (!raw) return emptySession(false);

    const session = JSON.parse(raw);
    if (isTokenExpired(session.accessToken)) {
      localStorage.removeItem("session");
      return emptySession(true);
    }

    return {
      user: session.user ?? null,
      accessToken: session.accessToken ?? null,
      refreshToken: session.refreshToken ?? null,
      sessionExpired: false,
    };
  } catch {
    localStorage.removeItem("session");
    return emptySession(false);
  }
};

const initialSession = getInitialSession();

export const useAuthStore = create((set, get) => ({
  user: initialSession.user,
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  sessionExpired: initialSession.sessionExpired,
  isInit: true,

  setSession: ({ user, accessToken, refreshToken }) => {
    const current = get();

    const nextSession = {
      user: user ?? current.user,
      accessToken: accessToken ?? current.accessToken,
      refreshToken: refreshToken ?? current.refreshToken,
    };

    localStorage.setItem("session", JSON.stringify(nextSession));
    scheduleTokenExpiry(nextSession.accessToken, get().expireSession);
    set({ ...nextSession, sessionExpired: false });
  },

  updateUser: (user) => {
    const { accessToken, refreshToken } = get();
    const nextSession = { user, accessToken, refreshToken };

    localStorage.setItem("session", JSON.stringify(nextSession));
    set({ user });
  },

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
      scheduleTokenExpiry(newAccessToken, get().expireSession);
      set({ ...nextSession, sessionExpired: false });

      return newAccessToken;
    } catch (error) {
      get().expireSession();
      throw error;
    }
  },

  expireSession: () => {
    clearExpiryTimer();
    localStorage.removeItem("session");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionExpired: true,
    });
  },

  logout: async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Continue with local cleanup.
    }

    clearExpiryTimer();
    localStorage.removeItem("session");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionExpired: false,
    });
  },

  initSession: () => {
    const raw = localStorage.getItem("session");
    if (!raw) return set({ isInit: true });

    try {
      const session = JSON.parse(raw);
      if (isTokenExpired(session.accessToken)) {
        get().expireSession();
        return set({ isInit: true });
      }

      scheduleTokenExpiry(session.accessToken, get().expireSession);
      set({
        user: session.user ?? null,
        accessToken: session.accessToken ?? null,
        refreshToken: session.refreshToken ?? null,
        sessionExpired: false,
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
      return Boolean(session.user && session.accessToken && !isTokenExpired(session.accessToken));
    } catch {
      return false;
    }
  },
}));

if (initialSession.accessToken) {
  scheduleTokenExpiry(initialSession.accessToken, () => {
    useAuthStore.getState().expireSession();
  });
}
