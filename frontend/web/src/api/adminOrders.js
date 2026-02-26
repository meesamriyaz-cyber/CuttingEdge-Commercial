import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const { accessToken } = useAuthStore.getState();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function fetchAdminOrders() {
  const res = await fetch(`${API_BASE}/admin/orders`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function fetchAdminOrder(id) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}
