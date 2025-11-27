import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginService, getProfileService } from "../api/authService.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfileService();
        const userRole = data.role || "user";

        setUser({
          id: data.user_id || "unknown",
          username: data.username || "user",
          role: userRole,
        });

        localStorage.setItem("role", userRole);

        // Redirige automáticamente al dashboard correcto si estamos en "/"
        if (window.location.pathname === "/") {
          navigate(rolePathMap[userRole] || "/login", { replace: true });
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const login = async ({ username, password }) => {
    try {
      const data = await loginService({ username, password });
      const userRole = data.role || "user";

      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", userRole);

      setUser({
        id: data.user_id || "unknown",
        username,
        role: userRole,
      });

      navigate(rolePathMap[userRole] || "/login", { replace: true });
      return data;
    } catch (err) {
      throw err.response?.data || { detail: "Error al iniciar sesión" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
