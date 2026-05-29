import { API_URL } from "./client";
import { useBackendWakeStore } from "../store/backendWakeStore";

const SLOW_REQUEST_MS = 2200;
const WARMUP_INTERVAL_MS = 60 * 1000;

let lastWarmupAt = 0;

export async function warmBackend({ force = false } = {}) {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  if (!force && now - lastWarmupAt < WARMUP_INTERVAL_MS) return true;

  lastWarmupAt = now;

  let settled = false;
  let markedSlow = false;
  let completedWarmup = false;
  const slowTimer = window.setTimeout(() => {
    if (!settled) {
      markedSlow = true;
      useBackendWakeStore.getState().beginWake();
    }
  }, SLOW_REQUEST_MS);

  try {
    const response = await window.fetch(`${API_URL}/`, {
      cache: "no-store",
      credentials: "include",
      method: "GET",
    });

    if (!response.ok) {
      useBackendWakeStore.getState().markIssue();
      return false;
    }

    completedWarmup = true;
    return true;
  } catch {
    useBackendWakeStore.getState().markIssue();
    return false;
  } finally {
    settled = true;
    window.clearTimeout(slowTimer);

    if (markedSlow && completedWarmup) {
      useBackendWakeStore.getState().endWake();
    }
  }
}
