// src/api/authService.js
import apiClient from "../api/apiClient.js";
import axios from "axios";

export const loginService = async (payload) =>
  (await apiClient.post("/auth/login", payload)).data;

export const registerService = async (payload) =>
  (await apiClient.post("/auth/register", payload)).data;

export const getUsersService = async () =>
  (await apiClient.get("/auth/users")).data;

export const getProfileService = async (token) => {
  // Aquí usamos axios directamente para evitar problemas de apiClient baseURL
  const res = await axios.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Retornamos la estructura que espera AuthContext
  const userData = res.data.user || res.data; // ajustar según API
  return {
    user_id: userData.user_id || userData.id,
    username: userData.username,
    role: userData.role,
    email: userData.email,
  };
};

export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
