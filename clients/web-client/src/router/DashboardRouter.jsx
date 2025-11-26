// src/router/DashboardRouter.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * DashboardRouter
 * Props:
 * - allowedRoles: array de roles permitidos para el dashboard
 * Comportamiento:
 * - Mientras carga el usuario → mostrar loader
 * - Usuario no autenticado → redirige a /login
 * - Usuario autenticado pero rol no permitido → mensaje de error
 * - Usuario autorizado → renderiza <Outlet />
 */
export default function DashboardRouter({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // Map de roles a rutas seguras
  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  // Rol no permitido → redirige al dashboard correcto
  if (!allowedRoles.includes(user.role)) {
    const safePath = rolePathMap[user.role] || "/login";
    return <Navigate to={safePath} replace />;
  }

  // Usuario autorizado → renderiza el dashboard
  return <Outlet />;
}
