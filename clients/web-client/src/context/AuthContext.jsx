// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginService, getProfileService } from "../api/authService.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Cargar perfil si hay token
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileService();
        // Aseguramos role por defecto
        setUser({
          id: data.user_id || "unknown",
          username: data.username || "user",
          role: data.role || "user",
        });
        localStorage.setItem("role", data.role || "user");
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async ({ username, password }) => {
    try {
      const data = await loginService({ username, password });
      const userRole = data.role || "user"; // fallback seguro
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", userRole);
      setUser({
        id: data.user_id || "unknown",
        username: username,
        role: userRole,
      });

      // 🔹 Redirección segura por rol
      window.location.href = `/dashboard/${userRole}`;

      return data;
    } catch (err) {
      throw err.response?.data || { detail: "Error al iniciar sesión" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
