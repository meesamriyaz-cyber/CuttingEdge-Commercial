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

export async function fetchAllProducts() {
  const res = await fetch(`${API_BASE}/products`, {
    headers: authHeaders(),
  });
  return parseResponse(res, "Failed to fetch products");
}

export async function fetchProductCategories() {
  const res = await fetch(`${API_BASE}/products/categories`, {
    headers: authHeaders(),
  });
  return parseResponse(res, "Failed to fetch categories");
}

export async function createProduct(data) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res, "Failed to create product");
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return parseResponse(res, "Failed to update product");
}

export async function deactivateProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return parseResponse(res, "Failed to deactivate product");
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    headers: authHeaders(),
  });
  return parseResponse(res, "Failed to fetch product");
}
