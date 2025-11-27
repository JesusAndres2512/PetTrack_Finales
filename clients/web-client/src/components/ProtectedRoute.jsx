// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  const safePath = rolePathMap[user.role] || "/login";

  // ✅ Si la URL no corresponde a su rol permitido → redirigir a ruta segura
  if (!location.pathname.startsWith(safePath) && allowedRoles.includes(user.role)) {
    console.warn("⚠ [ProtectedRoute] URL no coincide con rol, corrigiendo hacia:", safePath);
    return <Navigate to={safePath} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    console.error("⛔ [ProtectedRoute] Acceso no permitido para rol:", user.role);
    return <Navigate to={safePath} replace />;
  }

  return <Outlet />;
}
