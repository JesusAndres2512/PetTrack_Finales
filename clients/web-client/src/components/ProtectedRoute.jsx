// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const safePath = rolePathMap[user.role] || "/login";
    return <Navigate to={safePath} replace />;
  }

  return <Outlet />;
}
