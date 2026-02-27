import { apiRequest } from "./client";

// Get user's wishlist
export const getWishlist = async () => {
  return apiRequest("/wishlist", { method: "GET" });
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  return apiRequest("/wishlist/add", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  return apiRequest("/wishlist/remove", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
};

// Check if product is in wishlist
export const checkWishlist = async (productId) => {
  return apiRequest(`/wishlist/check/${productId}`, { method: "GET" });
};
