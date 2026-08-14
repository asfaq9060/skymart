import { apiRequest } from "./api";

export function subscribeToNewsletter(email) {
  return apiRequest("/api/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
