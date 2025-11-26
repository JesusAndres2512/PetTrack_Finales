// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * ProtectedRoute
 * Props:
 * - allowedRoles: array de roles permitidos
 * Comportamiento:
 * - Si no hay usuario → redirige a /login
 * - Si el usuario no tiene un rol permitido → redirige a su dashboard seguro
 * - Si el usuario tiene rol permitido → renderiza <Outlet />
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  // 🔹 Mientras se carga el usuario (token/role), podemos mostrar un spinner o null
  if (loading) return null;

  // 🔹 Usuario no autenticado → login
  if (!user) return <Navigate to="/login" replace />;

  // 🔹 Map de roles a rutas seguras
  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  // 🔹 Usuario autenticado pero rol no permitido → redirige a su dashboard seguro
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const safePath = rolePathMap[user.role] || "/login";
    return <Navigate to={safePath} replace />;
  }

  // 🔹 Usuario autorizado → renderiza la ruta protegida
  return <Outlet />;
}
