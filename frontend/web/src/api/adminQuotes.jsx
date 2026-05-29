import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const { accessToken } = useAuthStore.getState();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

async function parseResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

export async function fetchAdminQuotes() {
  const res = await fetch(`${API_BASE}/admin/quotes`, {
    headers: authHeaders(),
  });

  return parseResponse(res, "Failed to fetch quotes");
}

export async function fetchAdminQuote(id) {
  if (!id) {
    throw new Error("Quote ID is missing");
  }

  const res = await fetch(`${API_BASE}/admin/quotes/${id}`, {
    headers: authHeaders(),
  });

  return parseResponse(res, "Failed to fetch quote");
}

export async function updateQuoteStatus(id, status, adminRemark) {
  const res = await fetch(
    `${API_BASE}/admin/quotes/from-enquiry/${id}/status`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status, adminRemark }),
    },
  );

  return parseResponse(res, "Failed to update quote");
}

export async function createQuoteFromEnquiry(enquiryId, payload) {
  const res = await fetch(
    `${API_BASE}/admin/quotes/from-enquiry/${enquiryId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );

  return parseResponse(res, "Failed to create quote");
}

export async function fetchQuoteByEnquiry(enquiryId) {
  const res = await fetch(`${API_BASE}/admin/quotes/by-enquiry/${enquiryId}`, {
    headers: authHeaders(),
  });

  return parseResponse(res, "Failed to fetch quote by enquiry");
}
