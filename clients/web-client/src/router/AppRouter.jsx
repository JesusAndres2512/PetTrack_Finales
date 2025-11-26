// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginView from "../pages/auth/LoginView.jsx";
import RegisterView from "../pages/auth/RegisterView.jsx";

// CLIENTE (USER)
import MenuCliente from "../pages/cliente/MenuCliente.jsx";
import DashboardCliente from "../pages/cliente/DashboardCliente.jsx";
import MascotasView from "../pages/cliente/MascotasView.jsx";
import CitasClienteView from "../pages/cliente/CitasClienteView.jsx";
import RewardsUsers from "../pages/RewardsUsers.jsx";

// DOCTOR
import MenuDoctor from "../pages/doctor/MenuDoctor.jsx";
import DashboardDoctor from "../pages/doctor/DashboardDoctor.jsx";
import CitasDoctorView from "../pages/doctor/CitasDoctorView.jsx";
import SeguimientoView from "../pages/doctor/SeguimientoView.jsx";

// ADMIN
import MenuAdmin from "../pages/admin/MenuAdmin.jsx";
import DashboardAdmin from "../pages/admin/DashboardAdmin.jsx";
import ViewUsers from "../pages/ViewUsers.jsx";
import ViewPets from "../pages/ViewPets.jsx";
import ViewAppointments from "../pages/ViewAppointments.jsx";

// Rutas protegidas
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import DashboardRouter from "./DashboardRouter.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Redirección raíz */}
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

      {/* Página no encontrada */}
      <Route
        path="*"
        element={<div className="p-8 text-center text-gray-600">Página no encontrada</div>}
      />
    </Routes>
  );
}
