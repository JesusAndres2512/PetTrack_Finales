// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DashboardRouter from "./DashboardRouter.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// AUTH PAGES
import LoginView from "../pages/auth/LoginView.jsx";
import RegisterView from "../pages/auth/RegisterView.jsx";

// USER PAGES
import MenuCliente from "../pages/cliente/MenuCliente.jsx";
import DashboardCliente from "../pages/cliente/DashboardCliente.jsx";
import MascotasView from "../pages/cliente/MascotasView.jsx";
import CitasClienteView from "../pages/cliente/CitasClienteView.jsx";
import RewardsUsers from "../pages/RewardsUsers.jsx";
import PostconsultaClienteView from "../pages/cliente/PostconsultaClienteView.jsx";

// DOCTOR PAGES
import MenuDoctor from "../pages/doctor/MenuDoctor.jsx";
import DashboardDoctor from "../pages/doctor/DashboardDoctor.jsx";
import CitasDoctorView from "../pages/doctor/CitasDoctorView.jsx";
import SeguimientoView from "../pages/doctor/SeguimientoView.jsx";

// ADMIN PAGES
import MenuAdmin from "../pages/admin/MenuAdmin.jsx";
import DashboardAdmin from "../pages/admin/DashboardAdmin.jsx";
import ViewUsers from "../pages/ViewUsers.jsx";
import ViewPets from "../pages/ViewPets.jsx";
import ViewAppointments from "../pages/ViewAppointments.jsx";

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="text-center">
          <div className="text-teal-700 text-lg">Verificando sesión...</div>
        </div>
      </div>
    );
  }

  // 🧭 RUTA RAÍZ → decidir según auth + role (solo si estamos en la raíz)
  const currentPath = window.location.pathname;
  if (currentPath === "/" && user?.role) {
    const rolePathMap = {
      admin: "/admin/dashboard",
      doctor: "/doctor/dashboard",
      user: "/user/dashboard",
    };
    const expectedPath = rolePathMap[user.role];
    if (expectedPath) {
      return <Navigate to={expectedPath} replace />;
    }
  }

  return (
    <Routes>
      {/* raíz por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />

      {/* USER */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/user/menu" element={<MenuCliente />} />
        <Route element={<DashboardRouter allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<DashboardCliente />} />
        </Route>
        <Route path="/user/mascotas" element={<MascotasView />} />
        <Route path="/user/citas" element={<CitasClienteView />} />
        <Route path="/user/rewards" element={<RewardsUsers />} />
        <Route path="/user/postconsulta" element={<PostconsultaClienteView />} />
      </Route>

      {/* DOCTOR */}
      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor/menu" element={<MenuDoctor />} />
        <Route element={<DashboardRouter allowedRoles={["doctor"]} />}>
          <Route path="/doctor/dashboard" element={<DashboardDoctor />} />
        </Route>
        <Route path="/doctor/citas" element={<CitasDoctorView />} />
        <Route path="/doctor/seguimiento" element={<SeguimientoView />} />
      </Route>

      {/* ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/menu" element={<MenuAdmin />} />
        <Route element={<DashboardRouter allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        </Route>
        <Route path="/admin/users" element={<ViewUsers />} />
        <Route path="/admin/pets" element={<ViewPets />} />
        <Route path="/admin/appointments" element={<ViewAppointments />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="p-8 text-center text-gray-500">Página no encontrada</div>} />
    </Routes>
  );
}
