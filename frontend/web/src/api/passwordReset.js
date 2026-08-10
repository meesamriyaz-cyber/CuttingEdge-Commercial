import { apiRequest } from "./client";

export async function requestPasswordReset(email) {
  return apiRequest("/auth/password/request-password-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, newPassword) {
  return apiRequest("/auth/password/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
