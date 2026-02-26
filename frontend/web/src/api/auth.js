import { apiRequest } from "./client";
export function loginApi({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerApi(payload) {
  if (payload.clientType === "PUBLIC") {
    // Govt client registration
    return apiRequest("/auth/register/govt", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Private customer registration
  return apiRequest("/auth/register/private", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyGovtCodeApi({ code }) {
  return apiRequest("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function refreshTokenApi(refreshToken) {
  return apiRequest("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
