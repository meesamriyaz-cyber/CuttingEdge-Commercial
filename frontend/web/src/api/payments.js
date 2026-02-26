import { API_URL } from "./client";
import { useAuthStore } from "../store/authStore";

const getHeaders = () => {
  const { accessToken } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

// Fetch Razorpay key for frontend
export const fetchRazorpayKey = async () => {
  const res = await fetch(`${API_URL}/payments/razorpay/key`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.key;
};

// Create Razorpay order from cart
export const createRazorpayOrder = async () => {
  const res = await fetch(`${API_URL}/payments/razorpay/create-order`, {
    method: "POST",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// Verify payment after Razorpay checkout
export const verifyRazorpayPayment = async (response, shippingAddress) => {
  const res = await fetch(`${API_URL}/payments/razorpay/verify`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ ...response, shippingAddress }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
