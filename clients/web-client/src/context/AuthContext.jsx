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

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("🔍 [AuthContext] Loading profile. Token:", token ? "EXISTE" : "NO EXISTE");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileService(token);
        console.log("👤 [AuthContext] Perfil recibido. Rol:", data.role);

        if (!data.role || !rolePathMap[data.role]) {
          logout();
          return;
        }

        setUser({ id: data.user_id, username: data.username, role: data.role });
        localStorage.setItem("role", data.role);

        const expectedPath = rolePathMap[data.role];
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith(expectedPath)) {
          console.log("🚀 [AuthContext] Redirecting to:", expectedPath);
          navigate(expectedPath, { replace: true });
        }
      } catch (err) {
        console.error("❌ [AuthContext] Error obteniendo perfil", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

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
      setUser({ id: data.user_id, username, role: userRole });

      navigate(rolePathMap[userRole], { replace: true });
    } catch (err) {
      throw err.response?.data || { detail: "Error al iniciar sesión" };
    }
  };

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
