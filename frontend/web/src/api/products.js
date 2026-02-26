import { apiRequest } from "./client";

// Public API base path (no auth required) - for guest/public pages
const PUBLIC_API_BASE = "/public";

// Private API base path (auth required) - for authenticated users
const PRIVATE_API_BASE = "/products";

/**
 * Fetch all categories with product counts (private - auth required)
 * Categories are filtered by user's segment on the backend
 */
export async function getCategories() {
  return apiRequest(`${PRIVATE_API_BASE}/categories`);
}

/**
 * Fetch products, optionally filtered by category (private - auth required)
 * @param {string} category - Optional category filter
 */
export async function getProducts(category = null) {
  const path = category
    ? `${PRIVATE_API_BASE}?category=${encodeURIComponent(category)}`
    : PRIVATE_API_BASE;
  return apiRequest(path);
}

/**
 * Fetch a single product by ID (private - auth required)
 * @param {string} id - Product ID
 */
export async function getProductById(id) {
  return apiRequest(`${PRIVATE_API_BASE}/${id}`);
}

/**
 * Fetch product reviews (public - no auth required)
 * @param {string} productId - Product ID
 * @param {object} params - Query params (page, limit, sort)
 */
export async function getProductReviews(productId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const path = queryString
    ? `${PUBLIC_API_BASE}/products/${productId}/reviews?${queryString}`
    : `${PUBLIC_API_BASE}/products/${productId}/reviews`;
  return apiRequest(path);
}

/**
 * Get review summary for a product (public - no auth required)
 * @param {string} productId - Product ID
 */
export async function getReviewSummary(productId) {
  return apiRequest(`${PUBLIC_API_BASE}/products/${productId}/review-summary`);
}

/**
 * Get review summary for a product (with reviews)
 * @param {string} productId - Product ID
 */
export async function getReviewSummaryWithReviews(productId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const path = queryString
    ? `${PUBLIC_API_BASE}/products/${productId}/reviews?${queryString}`
    : `${PUBLIC_API_BASE}/products/${productId}/reviews`;

  try {
    const response = await apiRequest(path);
    return {
      averageRating: response.summary?.averageRating || 0,
      totalReviews: response.summary?.totalReviews || 0,
      distribution: response.summary?.distribution || {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      reviews: response.reviews || [],
      pagination: response.pagination || {},
    };
  } catch (error) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      reviews: [],
      pagination: {},
    };
  }
}

// ============================================
// PUBLIC/GUEST PAGE APIs (No authentication)
// ============================================

/**
 * Fetch all categories with product counts (public - no auth)
 */
export async function getPublicCategories() {
  return apiRequest(`${PUBLIC_API_BASE}/categories`);
}

/**
 * Fetch products, optionally filtered by category (public - no auth)
 * @param {string} category - Optional category filter
 */
export async function getPublicProducts(category = null) {
  const path = category
    ? `${PUBLIC_API_BASE}/products?category=${encodeURIComponent(category)}`
    : `${PUBLIC_API_BASE}/products`;
  return apiRequest(path);
}

/**
 * Fetch a single product by ID (public - no auth)
 * @param {string} id - Product ID
 */
export async function getPublicProductById(id) {
  return apiRequest(`${PUBLIC_API_BASE}/products/${id}`);
}
