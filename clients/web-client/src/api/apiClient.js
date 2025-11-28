import axios from "axios";

// Configurar URL base según el entorno
// Detectar si estamos en desarrollo local (Vite dev server) o producción
const isViteDev = import.meta.env.DEV;
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
const port = window.location.port;
const isLocalPort = port === '' || port === '80' || port === '5173';

// Si estamos en localhost (desarrollo o Docker local), usar API Gateway local
// Si estamos en producción real (dominio real), usar Azure APIM
const shouldUseLocalGateway = isLocalhost || isViteDev;
const isProduction = !isViteDev && !isLocalhost;

// Prioridad: usar API Gateway local si estamos en localhost, sino Azure APIM
// Desde el navegador, el API Gateway debe ser accesible en localhost:8003
const API_BASE = shouldUseLocalGateway
  ? (import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8003")
  : (import.meta.env.VITE_API_APIM_URL || "https://pettrack-apim.azure-api.net");

console.log(`🌐 API Client configurado:`, {
  baseURL: API_BASE,
  hostname: window.location.hostname,
  port: window.location.port,
  isViteDev,
  isLocalhost,
  isProduction,
  shouldUseLocalGateway,
  env: {
    VITE_API_GATEWAY_URL: import.meta.env.VITE_API_GATEWAY_URL,
    VITE_API_APIM_URL: import.meta.env.VITE_API_APIM_URL
  }
});

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// 🔒 Inyectar JWT en cada request con validación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Validar que el token no esté expirado antes de enviarlo
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          console.warn('🕒 Token expirado, limpiando localStorage');
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(new Error('Token expirado'));
        }
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`📤 Enviando request a: ${config.method?.toUpperCase()} ${config.url}`);
      } catch (e) {
        console.error('❌ Error al decodificar token:', e);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    } else {
      console.log(`📤 Request sin token: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Manejar errores de autenticación y red con más cuidado
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const isNetworkError = !error.response; // CORS, timeout, network error

    // Manejar errores de red/CORS
    if (isNetworkError) {
      console.error('🚨 Error de red/CORS:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        suggestion: 'Verificar CORS en el servidor o conectividad de red'
      });
      
      // Si es un error de red en login/register, proporcionar mensaje más claro
      if (url?.includes('/login') || url?.includes('/register')) {
        const networkError = new Error('Error de conexión. Verifica que el servidor esté disponible y que CORS esté configurado correctamente.');
        networkError.isNetworkError = true;
        networkError.originalError = error;
        return Promise.reject(networkError);
      }
    }

    // Solo cerrar sesión en 401 si no es una ruta de login/register
    if (status === 401 && !url?.includes('/login') && !url?.includes('/register')) {
      console.warn('🔒 Token inválido o expirado, cerrando sesión:', error.response?.data);
      localStorage.clear();
      // Evitar redirección infinita
      if (window.location.pathname !== '/login') {
        window.location.href = "/login";
      }
    } else if (status === 401) {
      console.warn('🚫 Error 401 en ruta de auth, no redirigiendo:', url);
    }

    // Log otros errores para debugging
    if (status >= 400 || isNetworkError) {
      console.error(`🚨 API Error [${status || 'NETWORK'}]:`, {
        url,
        method: error.config?.method,
        status,
        data: error.response?.data,
        message: error.message,
        isNetworkError
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
