import { apiRequest } from "./client";

/**
 * Fetch all orders for the current user
 * @returns {Promise<{orders: Array, message: string}>}
 */
export function fetchOrders() {
  return apiRequest("/orders");
}

/**
 * Fetch a single order by ID
 * @param {string} orderId
 * @returns {Promise<Object>}
 */
export function fetchOrderById(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

/**
 * Create a new order from cart with address
 * @param {Object} payload
 * @param {string} payload.addressId
 * @returns {Promise<Object>}
 */
export function createOrder(payload) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Cancel an order
 * @param {string} orderId
 * @returns {Promise<Object>}
 */
export function cancelOrder(orderId) {
  return apiRequest(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
}
