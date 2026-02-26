import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function authHeaders() {
  const { accessToken } = useAuthStore.getState();
  console.log("authHeaders - accessToken present:", !!accessToken);
  if (!accessToken) {
    console.warn("No access token available - user may need to login again");
  }
  return {
    "Content-Type": "application/json",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
}

/* ✅ GET ALL ENQUIRIES */
export async function fetchAdminEnquiries() {
  const res = await fetch(`${API_BASE}/admin/enquiries`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin enquiries");
  }

  return res.json();
}

/* ✅ GET SINGLE ENQUIRY (ADMIN) */
export async function fetchAdminEnquiry(id) {
  console.log("Fetching admin enquiry with ID:", id);
  const url = `${API_BASE}/admin/enquiries/${id}`;
  console.log("API URL:", url);
  console.log("API_BASE is:", API_BASE);

  try {
    const res = await fetch(url, {
      headers: authHeaders(),
    });
    console.log("Response received:", res.status, res.statusText);
    console.log("Response URL:", res.url);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", res.status, errorText);
      throw new Error(`Failed to fetch enquiry: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log("API Response:", data);
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

/* ✅ UPDATE STATUS */
export async function updateEnquiryStatus(id, status, adminRemark) {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, adminRemark }),
  });

  if (!res.ok) {
    throw new Error("Failed to update enquiry");
  }

  return res.json();
}
