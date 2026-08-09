import { apiRequest } from "./client";

export async function checkDelivery(pincode, orderTotal = 0) {
  return apiRequest("/delivery/check", {
    method: "POST",
    body: JSON.stringify({ pincode, orderTotal }),
  });
}
