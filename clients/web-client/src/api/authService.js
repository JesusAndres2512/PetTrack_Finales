// src/services/authService.js
import apiClient from "../api/apiClient";

// Rutas consistentes con APIM/backend
export const loginService = (payload) => apiClient.post("/auth/login", payload).then(r => r.data);
export const registerService = (payload) => apiClient.post("/auth/register", payload).then(r => r.data);
export const getUsersService = () => apiClient.get("/auth/users").then(r => r.data);
export const getProfileService = () => apiClient.get("/auth/profile").then(r => r.data);

export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
