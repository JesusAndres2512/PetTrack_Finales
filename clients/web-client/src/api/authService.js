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
  const res = await axios.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const u = res.data;

  // Mapear a estructura esperada
  return {
    user_id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
  };
};

export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
