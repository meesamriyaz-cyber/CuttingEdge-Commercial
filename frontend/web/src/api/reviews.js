import { apiRequest } from "./client";

/**
 * Get reviews for a product (public)
 * @param {string} productId - Product ID
 * @param {object} params - Query params (page, limit, sort)
 */
export async function getProductReviews(productId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const path = queryString
    ? `/reviews/product/${productId}?${queryString}`
    : `/reviews/product/${productId}`;
  return apiRequest(path);
}

/**
 * Check if user can review a product
 * @param {string} productId - Product ID
 */
export async function canReviewProduct(productId) {
  return apiRequest(`/reviews/can-review/${productId}`);
}

/**
 * Get products that user can review (purchased but not reviewed)
 */
export async function getReviewableProducts() {
  return apiRequest("/reviews/reviewable");
}

/**
 * Get current user's reviews
 * @param {object} params - Query params (page, limit)
 */
export async function getUserReviews(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const path = queryString
    ? `/reviews/my-reviews?${queryString}`
    : "/reviews/my-reviews";
  return apiRequest(path);
}

/**
 * Create a new review
 * @param {object} reviewData - { productId, orderId, rating, title, comment, images }
 */
export async function createReview(reviewData) {
  return apiRequest("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

/**
 * Update a review
 * @param {string} reviewId - Review ID
 * @param {object} reviewData - { rating, title, comment, images }
 */
export async function updateReview(reviewId, reviewData) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
}

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 */
export async function deleteReview(reviewId) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

/**
 * Mark review as helpful
 * @param {string} reviewId - Review ID
 * @param {boolean} isHelpful - Whether the review was helpful
 */
export async function markReviewHelpful(reviewId, isHelpful = true) {
  return apiRequest(`/reviews/${reviewId}/helpful`, {
    method: "POST",
    body: JSON.stringify({ isHelpful }),
  });
}
