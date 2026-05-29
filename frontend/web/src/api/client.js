import { useAuthStore } from "../store/authStore";

// client.js (create/update)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const url = `${API_URL}${path}`;

  // Get token from auth store first (reactive state)
  let accessToken = null;
  try {
    const authState = useAuthStore.getState();
    accessToken = authState?.accessToken;
  } catch (e) {
    // Could not get token from auth store
  }

  // Fallback to localStorage if auth store doesn't have it yet
  if (!accessToken) {
    try {
      const session = JSON.parse(localStorage.getItem("session") || "null");
      accessToken = session?.accessToken;
    } catch {
      accessToken = null;
    }
  }

  // Debug logging for refresh issues
  if (!accessToken) {
    // No access token found - will proceed without auth
  }

  // Destructure options
  const { headers = {}, method = "GET", body = null } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? body : undefined,
    credentials: "include", // Important: send cookies with cross-origin requests
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    // Handle 401 - Unauthorized (expired or invalid token)
    if (res.status === 401) {
      // Clear auth store
      try {
        useAuthStore.getState().expireSession();
      } catch (e) {
        // Fallback - clear localStorage directly
        localStorage.removeItem("session");
      }

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=true";
      }

      // Throw error to stop further processing
      throw new Error("Session expired. Please log in again.");
    }

    // convert various server responses into a thrown Error with message
    const message =
      (payload && (payload.message || payload.error)) ||
      res.statusText ||
      "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
