import axios from "axios";

const API_BASE = import.meta.env.VITE_API_APIM_URL;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// =============================
// 🔒 Interceptor JWT (inyectar token en cada request)
// =============================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// ⚠️ Interceptor de respuesta (cerrar sesión en 401)
// =============================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =============================
// 🧩 Autenticación
// =============================
export const login = async (username, password) => {
  try {
    const { data } = await apiClient.post("/auth/login", { username, password });

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    if (data.role) {
      localStorage.setItem("role", data.role);
    }

    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al iniciar sesión" };
  }
};

export const register = async ({ username, email, password, role }) => {
  try {
    const { data } = await apiClient.post("/auth/register", {
      username,
      email,
      password,
      role,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al registrar usuario" };
  }
};

export const getProfile = async () => {
  try {
    const { data } = await apiClient.get("/auth/profile");
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al obtener perfil" };
  }
};

// =============================
// 👥 Gestión de usuarios (admin)
// =============================
export const getUsers = async () => {
  try {
    const { data } = await apiClient.get("/auth/users");
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al obtener usuarios" };
  }
};

export const deleteUser = async (userId) => {
  try {
    const { data } = await apiClient.delete(`/auth/users/${userId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al eliminar usuario" };
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const { data } = await apiClient.put(`/auth/users/${userId}`, updatedData);
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al actualizar usuario" };
  }
};

// =============================
// 🐾 Módulo Mascotas
// =============================
export const getPets = async () => {
  try {
    const { data } = await apiClient.get("/pets");
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al obtener mascotas" };
  }
};

export const addPet = async (petData) => {
  try {
    const { data } = await apiClient.post("/pets", petData);
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al agregar mascota" };
  }
};

// =============================
// 📅 Módulo Citas
// =============================
export const getAppointments = async () => {
  try {
    const { data } = await apiClient.get("/appointments");
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al obtener citas" };
  }
};

export const addAppointment = async (appointmentData) => {
  try {
    const { data } = await apiClient.post("/appointments", appointmentData);
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al crear cita" };
  }
};

// =============================
// 📊 Dashboard
// =============================
export const getDashboard = async () => {
  try {
    const { data } = await apiClient.get("/dashboard");
    return data;
  } catch (error) {
    throw error.response?.data || { detail: "Error al obtener datos del dashboard" };
  }
};

export const getStoredRole = () => localStorage.getItem("role") || "user";

export default apiClient;
