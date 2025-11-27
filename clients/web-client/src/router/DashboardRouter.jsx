// src/router/DashboardRouter.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardRouter({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  if (loading) return <div className="text-center mt-10">Cargando perfil...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const safePath = rolePathMap[user.role] || "/login";

  // 🚫 Anti-loop: si la ruta NO coincide con su rol esperado, corregir
  if (!location.pathname.startsWith(safePath)) {
    console.warn("🔀 [DashboardRouter] URL no coincide con rol. Corrigiendo a:", safePath);
    return <Navigate to={safePath} replace />;
  }

  // 🛡 Si tiene rol pero no permitido en este router → fallback a dashboard seguro de su rol
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    console.error("⛔ [DashboardRouter] Acceso denegado. Rol:", user.role);
    return <Navigate to={safePath} replace />;
  }

  return <Outlet />;
}
