import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AccountSettings from "./pages/AccountSettings";
import UsersManagement from "./pages/UsersManagement";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppHeader from "./components/AppHeader";

const App = () => (
  <BrowserRouter>
    <AppHeader />
    <main className="portal-main">
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Welcome />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Account Settings */}
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />

      {/* Services */}
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services/:serviceId"
        element={
          <ProtectedRoute>
            <ServiceDetails />
          </ProtectedRoute>
        }
      />

      {/* Application Form */}
      <Route
        path="/services/:serviceId/apply"
        element={
          <ProtectedRoute>
            <ApplicationForm />
          </ProtectedRoute>
        }
      />

      {/* My Applications */}
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications/:id"
        element={
          <ProtectedRoute>
            <ApplicationDetails />
          </ProtectedRoute>
        }
      />

      {/* Admin and Reviewer: Application Review */}
      <Route
        path="/admin"
        element={
          <AdminRoute allowedRoles={["admin", "reviewer"]}>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Admin Only: Account Management */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UsersManagement />
          </AdminRoute>
        }
      />
    </Routes>
    </main>
  </BrowserRouter>
);

export default App;
