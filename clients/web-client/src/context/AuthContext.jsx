// src/context/AuthContext.jsx
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

  // Función para cargar perfil de usuario con un token dado
  const loadProfile = async (tokenToUse) => {
    if (!tokenToUse) return null;

    try {
      console.log("🔍 [AuthContext] Loading profile. Token:", tokenToUse ? "EXISTE" : "NO EXISTE");
      const data = await getProfileService(tokenToUse);
      console.log("👤 [AuthContext] Perfil recibido. Rol:", data.role);

      if (!data.role || !rolePathMap[data.role]) {
        logout();
        return null;
      }

      const userData = { id: data.user_id, username: data.username, role: data.role };
      setUser(userData);
      localStorage.setItem("role", data.role);

      const expectedPath = rolePathMap[data.role];
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith(expectedPath)) {
        console.log("🚀 [AuthContext] Redirecting to:", expectedPath);
        navigate(expectedPath, { replace: true });
      }

      return userData;
    } catch (err) {
      console.error("❌ [AuthContext] Error obteniendo perfil", err);
      logout();
      return null;
    }
  };

  // useEffect inicial para cargar perfil si hay token en localStorage
  useEffect(() => {
    const init = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      await loadProfile(token);
      setLoading(false);
    };
    init();
  }, [token]);

  // Login: llama a loginService, guarda token y carga perfil inmediatamente
  const login = async ({ username, password }) => {
    try {
      console.log("🔐 [AuthContext] Intentando login...");
      const data = await loginService({ username, password });
      const userToken = data.access_token;

      if (!userToken) throw new Error("Token no recibido");

      setToken(userToken);
      localStorage.setItem("token", userToken);

      console.log("✅ [AuthContext] Login OK. Cargando perfil...");
      setLoading(true);
      await loadProfile(userToken);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("❌ [AuthContext] Error en login", err);
      throw err.response?.data || { detail: "Error al iniciar sesión" };
    }
  };

  // Logout: limpia todo y redirige a login
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
