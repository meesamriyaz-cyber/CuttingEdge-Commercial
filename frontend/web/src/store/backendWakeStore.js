import { create } from "zustand";

let settleTimer = null;

const resetSettleTimer = () => {
  if (settleTimer) {
    window.clearTimeout(settleTimer);
    settleTimer = null;
  }
};

export const useBackendWakeStore = create((set, get) => ({
  activeSlowRequests: 0,
  startedAt: null,
  status: "idle",
  visible: false,

  beginWake: () => {
    resetSettleTimer();

    set((state) => ({
      activeSlowRequests: state.activeSlowRequests + 1,
      startedAt: state.startedAt || Date.now(),
      status: "warming",
      visible: true,
    }));
  },

  endWake: () => {
    const nextCount = Math.max(get().activeSlowRequests - 1, 0);

    set({
      activeSlowRequests: nextCount,
      status: nextCount > 0 ? "warming" : "ready",
      visible: true,
    });

    if (nextCount === 0) {
      resetSettleTimer();
      settleTimer = window.setTimeout(() => {
        set({
          activeSlowRequests: 0,
          startedAt: null,
          status: "idle",
          visible: false,
        });
      }, 1200);
    }
  },

  markIssue: () => {
    resetSettleTimer();

    set({
      activeSlowRequests: 0,
      startedAt: Date.now(),
      status: "issue",
      visible: true,
    });
  },

  dismiss: () => {
    resetSettleTimer();

    set({
      activeSlowRequests: 0,
      startedAt: null,
      status: "idle",
      visible: false,
    });
  },
}));
