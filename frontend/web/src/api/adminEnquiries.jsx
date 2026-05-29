import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const { accessToken } = useAuthStore.getState();
  return {
    "Content-Type": "application/json",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
}

async function parseResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

/* ✅ GET ALL ENQUIRIES */
export async function fetchAdminEnquiries() {
  const res = await fetch(`${API_BASE}/admin/enquiries`, {
    headers: authHeaders(),
  });

  return parseResponse(res, "Failed to fetch admin enquiries");
}

/* ✅ GET SINGLE ENQUIRY (ADMIN) */
export async function fetchAdminEnquiry(id) {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
    headers: authHeaders(),
  });

  return parseResponse(res, "Failed to fetch enquiry");
}

/* ✅ UPDATE STATUS */
export async function updateEnquiryStatus(id, status, adminRemark) {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, adminRemark }),
  });

  return parseResponse(res, "Failed to update enquiry");
}
