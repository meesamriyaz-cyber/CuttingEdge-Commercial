import { apiRequest } from "./client";

export async function fetchAllUsers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.clientType) query.set("clientType", params.clientType);
  if (params.role) query.set("role", params.role);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);

  const qs = query.toString();
  return apiRequest(`/admin/users${qs ? `?${qs}` : ""}`);
}

export async function fetchUser(id) {
  return apiRequest(`/admin/users/${id}`);
}

export async function updateUser(id, data) {
  return apiRequest(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return apiRequest(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

export async function toggleUserActive(id) {
  return apiRequest(`/admin/users/${id}/toggle-active`, {
    method: "POST",
  });
}
