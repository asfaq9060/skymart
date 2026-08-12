import { apiRequest } from "./api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export async function fetchProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const response = await fetch(`${API_URL}/api/products${query}`);

  if (!response.ok) {
    throw new Error("We couldn't load the product catalogue. Please try again.");
  }

  return response.json();
}

export async function fetchProduct(productId) {
  const response = await fetch(`${API_URL}/api/products/${productId}`);

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("We couldn't load this product. Please try again.");
  }

  return response.json();
}

export function createProduct(product, token) {
  return apiRequest("/api/products", { token, method: "POST", body: JSON.stringify(product) });
}

export function updateProductPrice(productId, prices, token) {
  return apiRequest(`/api/products/${productId}`, { token, method: "PATCH", body: JSON.stringify(prices) });
}

export function deleteProduct(productId, token) {
  return apiRequest(`/api/products/${productId}`, { token, method: "DELETE" });
}
