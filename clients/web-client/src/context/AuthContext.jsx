// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../services/authService"; // ✅ Import correcto
import { getProfileService as getProfile } from "../services/authService"; // ✅ Import correcto

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (username, password) => {
    const data = await apiLogin({ username, password });
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    setUser({ id: data.user_id, username, role: data.role });
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
