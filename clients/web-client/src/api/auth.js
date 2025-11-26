import apiClient from "../api/apiClient";

// =============================
// 🧩 Autenticación
// =============================
export const login = async (username, password) => {
  try {
    const { data } = await apiClient.post("/auth/login", { username, password });
    if (data.access_token) localStorage.setItem("token", data.access_token);
    if (data.role) localStorage.setItem("role", data.role);
    return data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al iniciar sesión" };
  }
};

export const register = async ({ username, email, password, role }) => {
  try {
    const { data } = await apiClient.post("/auth/register", { username, email, password, role });
    return data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al registrar usuario" };
  }
};

export const getProfile = async () => {
  try {
    return (await apiClient.get("/auth/profile")).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al obtener perfil" };
  }
};

export const getStoredRole = () => localStorage.getItem("role") || "user";
export const logout = () => { localStorage.clear(); window.location.href = "/login"; };

export const getUsers = async () => {
  try {
    return (await apiClient.get("/auth/users")).data;
  } catch (err) {
    throw err.response?.data || { detail: "Error al obtener usuarios" };
  }
};

export const deleteUser = async (id) => {
  try {
    await apiClient.delete(`/auth/users/${id}`);
  } catch (err) {
    throw err.response?.data || { detail: "Error al eliminar usuario" };
  }
};

export const updateUser = async (id, userData) => {
  try {
    await apiClient.put(`/auth/users/${id}`, userData);
  } catch (err) {
    throw err.response?.data || { detail: "Error al actualizar usuario" };
  }
};
