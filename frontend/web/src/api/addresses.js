import { apiRequest } from "./client";

// Fetch all addresses for the logged-in user
export function fetchAddresses() {
  return apiRequest("/addresses", {
    method: "GET",
  });
}

// Add a new address
export function addAddress(addressData) {
  return apiRequest("/addresses", {
    method: "POST",
    body: JSON.stringify(addressData),
  });
}

// Update an existing address
export function updateAddress(id, addressData) {
  return apiRequest(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(addressData),
  });
}

// Delete an address
export function deleteAddress(id) {
  return apiRequest(`/addresses/${id}`, {
    method: "DELETE",
  });
}

// Set an address as default
export function setDefaultAddress(id) {
  return apiRequest(`/addresses/${id}/default`, {
    method: "PATCH",
  });
}
