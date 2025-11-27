// src/api/authService.js
import apiClient from "../api/apiClient.js";

// 🔹 Login
export const loginService = async (payload) =>
  (await apiClient.post("/auth/login", payload)).data;

// 🔹 Registro
export const registerService = async (payload) =>
  (await apiClient.post("/auth/register", payload)).data;

// 🔹 Obtener todos los usuarios (solo admin/doctor)
export const getUsersService = async () =>
  (await apiClient.get("/auth/users")).data;

// 🔹 Obtener perfil del usuario actual
export const getProfileService = async (token) => {
  const res = await apiClient.get("/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("📦 [getProfileService] Respuesta cruda:", res.data);

  return {
    id: res.data.user_id ?? res.data.id,
    username: res.data.username ?? res.data.name ?? res.data.email?.split("@")[0],
    email: res.data.email,
    role: res.data.role ?? res.data.rol,
    raw: res.data // opcional, si quieres mantener toda la info original
  };
};


// 🔹 Logout
export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
