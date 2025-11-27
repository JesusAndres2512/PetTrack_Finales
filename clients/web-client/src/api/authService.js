// src/api/authService.js
import apiClient from "../api/apiClient.js";

// 🔹 Login
export const loginService = async (payload) =>
  (await apiClient.post("/login", payload)).data;

// 🔹 Registro
export const registerService = async (payload) =>
  (await apiClient.post("/register", payload)).data;

// 🔹 Obtener todos los usuarios (solo admin/doctor)
export const getUsersService = async () =>
  (await apiClient.get("/users")).data;

// 🔹 Obtener perfil del usuario actual
export const getProfileService = async (token) => {
  const res = await apiClient.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const u = res.data;

  // Mapear a objeto consistente
  return {
    user_id: u.id ?? u.user_id,
    username: u.username,
    email: u.email,
    role: u.role,
  };
};

// 🔹 Logout
export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
