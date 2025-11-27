import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function DashboardRouter({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const rolePathMap = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    user: "/user/dashboard",
  };

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={rolePathMap[user.role]} replace />;
  }

  return <Outlet />;
}
