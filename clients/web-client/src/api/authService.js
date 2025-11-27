// src/services/authService.js
import apiClient from "../api/apiClient.js";

// Servicios de autenticación
export const loginService = async (payload) => (await apiClient.post("/auth/login", payload)).data;
export const registerService = async (payload) => (await apiClient.post("/auth/register", payload)).data;
export const getUsersService = async () => (await apiClient.get("/auth/users")).data;

export const getProfileService = async (token) => {
  return axios.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
};

export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
