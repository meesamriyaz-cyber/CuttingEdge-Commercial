import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const { accessToken } = useAuthStore.getState();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function fetchAdminQuotes() {
  const res = await fetch(`${API_BASE}/admin/quotes`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch quotes");
  }

  return res.json();
}

export async function fetchAdminQuote(id) {
  if (!id) {
    throw new Error("Quote ID is missing");
  }

  const res = await fetch(`${API_BASE}/admin/quotes/${id}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch quote");
  }

  return res.json();
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
  return res.json();
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
  return res.json();
}

export async function fetchQuoteByEnquiry(enquiryId) {
  const res = await fetch(`${API_BASE}/admin/quotes/by-enquiry/${enquiryId}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch quote by enquiry");
  }

  return res.json();
}
