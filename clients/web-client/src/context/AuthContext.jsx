// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginService, getProfileService } from "../api/authService.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar perfil si hay token y manejar reload
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileService();
        // Asegurar role por defecto
        const userRole = data.role || "user";
        setUser({
          id: data.user_id || "unknown",
          username: data.username || "user",
          role: userRole,
        });
        localStorage.setItem("role", userRole);

        // Redirección automática si está en /login o root
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/"
        ) {
          window.location.href = `/dashboard/${userRole}`;
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // 🔹 Login seguro con redirección
  const login = async ({ username, password }) => {
    try {
      const data = await loginService({ username, password });
      const userRole = data.role || "user"; // fallback seguro
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", userRole);
      setUser({
        id: data.user_id || "unknown",
        username,
        role: userRole,
      });

      // Redirección segura por rol
      window.location.href = `/dashboard/${userRole}`;

      return data;
    } catch (err) {
      throw err.response?.data || { detail: "Error al iniciar sesión" };
    }
  };

  // 🔹 Logout
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
