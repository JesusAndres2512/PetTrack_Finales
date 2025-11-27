// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginService, getProfileService } from "../api/authService.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("🔍 [AuthContext] Cargando perfil con token:", token ? "EXISTE" : "NO EXISTE");

      if (!token) {
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await getProfileService();
        const userRole = data.role;

        console.log("👤 [AuthContext] Perfil recibido. Rol:", userRole);

        if (!userRole || !rolePathMap[userRole]) {
          console.error("❌ [AuthContext] Rol inválido o no definido, cerrando sesión.");
          logout();
          return;
        }

        setUser({
          id: data.user_id,
          username: data.username,
          role: userRole,
        });

        localStorage.setItem("role", userRole);

        const expectedPath = rolePathMap[userRole];
        const currentPath = location.pathname;

        console.log("📍 [AuthContext] Ruta actual:", currentPath);
        console.log("🎯 [AuthContext] Ruta esperada para rol:", expectedPath);

        // Solo redirigir si no estamos ya en la ruta correcta
        if (!currentPath.startsWith(expectedPath)) {
          console.log("🔀 [AuthContext] Redirigiendo a:", expectedPath);
          navigate(expectedPath, { replace: true });
        }

      } catch (err) {
        console.error("⚠ [AuthContext] Error al obtener perfil:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, location.pathname]);

  const login = async ({ username, password }) => {
    console.log("🔐 [AuthContext] Intentando login...");

    try {
      const data = await loginService({ username, password });
      const userRole = data.role;

      console.log("✅ [AuthContext] Login OK. Rol:", userRole);

      if (!userRole || !rolePathMap[userRole]) {
        console.error("❌ Rol no reconocido, no se puede redirigir.");
        throw { detail: "Rol no reconocido por el sistema." };
      }

      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", userRole);

      setUser({
        id: data.user_id,
        username,
        role: userRole,
      });

      const expectedPath = rolePathMap[userRole];
      console.log("🚀 [AuthContext] Redirigiendo a dashboard según rol:", expectedPath);
      navigate(expectedPath, { replace: true });

      return data;
    } catch (err) {
      console.error("⚠ [AuthContext] Error en login:", err);
      throw err;
    }
  };

  const logout = () => {
    console.log("👋 [AuthContext] Cerrando sesión...");
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
