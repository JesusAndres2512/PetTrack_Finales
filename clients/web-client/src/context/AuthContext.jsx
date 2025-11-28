import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginService, getProfileService } from "../api/authService.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  // 🔹 Cargar perfil si hay token pero no hay usuario (solo en refresh/recarga)
  useEffect(() => {
    const fetchProfile = async () => {
      // Si ya tenemos usuario, no necesitamos hacer el request
      if (user) {
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 [AuthContext] Loading profile. Token: EXISTE, User: NO");

        const data = await getProfileService(token);
        console.log("👤 [AuthContext] Perfil recibido:", data);

        // Detectar rol real según la respuesta
        const userRole = data.role ?? data.rol;
        if (!userRole || !rolePathMap[userRole]) {
          console.warn("❌ [AuthContext] Rol inválido:", userRole);
          setLoading(false);
          return; // No cerrar sesión, solo no redirigir
        }

        const userData = {
          id: data.user_id ?? data.id,
          username: data.username ?? data.name ?? data.email?.split("@")[0],
          email: data.email,
          role: userRole,
        };

        setUser(userData);
        localStorage.setItem("role", userRole);

        const expectedPath = rolePathMap[userRole];
        if (!window.location.pathname.startsWith(expectedPath)) {
          console.log("🚀 [AuthContext] Redirigiendo a dashboard:", expectedPath);
          navigate(expectedPath, { replace: true });
        }

      } catch (err) {
        console.error("❌ [AuthContext] Error obteniendo perfil", err);
        // Si falla el perfil, limpiar token inválido
        if (err.response?.status === 401) {
          console.warn("🔒 Token inválido, limpiando sesión");
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, user]);

  // 🔹 Login
  const login = async ({ username, password }) => {
    try {
      console.log("🔐 [AuthContext] Intentando login...");
      const data = await loginService({ username, password });

      const userToken = data.access_token;
      const userRole = data.role;

      console.log("✅ [AuthContext] Login OK. Rol:", userRole, "Datos:", data);

      // Validar que tenemos los datos necesarios
      if (!userToken || !userRole) {
        throw new Error("Respuesta de login incompleta");
      }

      // Establecer token y usuario ANTES de redirigir
      setToken(userToken);
      localStorage.setItem("token", userToken);
      localStorage.setItem("role", userRole);

      const userData = {
        id: data.user_id,
        username: data.username ?? username,
        email: data.email,
        role: userRole,
      };

      setUser(userData);
      setLoading(false); // Asegurar que loading sea false después del login

      // Redirigir automáticamente al dashboard según rol
      const expectedPath = rolePathMap[userRole];
      if (expectedPath) {
        console.log("🚀 [AuthContext] Redirigiendo a:", expectedPath);
        navigate(expectedPath, { replace: true });
      }

    } catch (err) {
      console.error("❌ [AuthContext] Error en login:", err);
      setLoading(false); // Asegurar que loading sea false en caso de error
      throw err.response?.data || { detail: "Error al iniciar sesión" };
    }
  };

  // 🔹 Logout
  const logout = () => {
    console.log("👋 [AuthContext] Cerrando sesión...");
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate("/login", { replace: true });
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
