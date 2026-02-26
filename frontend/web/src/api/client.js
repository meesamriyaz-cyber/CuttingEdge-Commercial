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
    console.warn("Could not get token from auth store:", e);
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
    console.warn("[apiRequest] No access token found for:", path);
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
      console.warn("[apiRequest] 401 Unauthorized - logging out user");
      
      // Clear auth store
      try {
        useAuthStore.getState().logout();
      } catch (e) {
        console.error("[apiRequest] Failed to logout from store:", e);
      }
      
      // Clear localStorage
      try {
        localStorage.removeItem("session");
      } catch (e) {
        console.error("[apiRequest] Failed to clear localStorage:", e);
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
    throw new Error(message);
  }

  return payload;
}
