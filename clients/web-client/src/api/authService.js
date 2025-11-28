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
  try {
    console.log("🔍 [getProfileService] Obteniendo perfil (token en localStorage)");

    // El apiClient interceptor ya añade el Authorization header automáticamente desde localStorage
    const res = await apiClient.get("/auth/profile");

    console.log("📦 [getProfileService] Respuesta cruda:", res.data);

    // Normaliza el perfil
    return {
      id: res.data.user_id ?? res.data.id,
      username: res.data.username ?? res.data.name ?? res.data.email?.split("@")[0],
      email: res.data.email,
      role: res.data.role ?? res.data.rol,
      raw: res.data, // Mantener datos completos
    };
  } catch (err) {
    if (err.response) {
      console.error(
        "❌ [getProfileService] Error en response:",
        err.response.status,
        err.response.data
      );
    } else {
      console.error("❌ [getProfileService] Error desconocido:", err.message);
    }
    throw err; // Re-lanzar para que el contexto de Auth lo capture
  }
};

// 🔹 Logout
export const logoutService = () => {
  localStorage.clear();
  window.location.href = "/login";
};
