import { apiRequest } from "./api";

export function validateCoupon(code, subtotal) {
  return apiRequest("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

export function checkout(items, couponCode, token) {
  return apiRequest("/api/orders/checkout", {
    method: "POST",
    token,
    body: JSON.stringify({ items, couponCode }),
  });
}

export function fetchOrder(orderId, token) {
  return apiRequest(`/api/orders/${orderId}`, { token });
}

export function fetchOrders(token) {
  return apiRequest("/api/orders", { token });
}
