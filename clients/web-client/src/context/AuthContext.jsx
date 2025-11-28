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

  // 🔹 Cargar perfil si hay token
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 [AuthContext] Loading profile. Token: EXISTE");

        const data = await getProfileService();
        console.log("👤 [AuthContext] Perfil recibido:", data);

        // Detectar rol real según la respuesta
        const userRole = data.role ?? data.rol;
        if (!userRole || !rolePathMap[userRole]) {
          console.warn("❌ [AuthContext] Rol inválido");
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // 🔹 Login
  const login = async ({ username, password }) => {
    try {
      console.log("🔐 [AuthContext] Intentando login...");
      const data = await loginService({ username, password });

      const userToken = data.access_token;
      const userRole = data.role;

      console.log("✅ [AuthContext] Login OK. Rol:", userRole);

      setToken(userToken);
      localStorage.setItem("token", userToken);
      localStorage.setItem("role", userRole);

      setUser({
        id: data.user_id,
        username: data.username ?? username,
        email: data.email,
        role: userRole,
      });

      // Redirigir automáticamente al dashboard según rol
      const expectedPath = rolePathMap[userRole];
      if (expectedPath) navigate(expectedPath, { replace: true });

    } catch (err) {
      console.error("❌ [AuthContext] Error en login:", err);
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
