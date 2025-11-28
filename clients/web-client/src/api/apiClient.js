import axios from "axios";

const API_BASE = import.meta.env.VITE_API_APIM_URL || "https://pettrack-apim.azure-api.net";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true // 👈 esto permite que se envíen y reciban cookies
});

// 🔒 Interceptor para errores de autenticación
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
