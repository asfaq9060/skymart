import { apiRequest } from "./api";

export function registerAccount(credentials) {
  return apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(credentials) });
}

export function loginAccount(credentials) {
  return apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) });
}

export function verifyEmail(credentials) {
  return apiRequest("/api/auth/verify-email", { method: "POST", body: JSON.stringify(credentials) });
}

export function fetchCurrentUser(token) {
  return apiRequest("/api/auth/me", { token });
}
