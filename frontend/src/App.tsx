import React, { useEffect } from "react";
import { useNavigation } from "./context/NavigationContext";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./features/Landing/pages/LandingPage";
import ServicesPage from "./features/services/pages/ServicesPage";
import StaffPage from "./features/staff/pages/StaffPage";
import DashboardPage from "./features/Dashboard/pages/DashboardPage";
import ProfilePage from "./features/Profile/pages/ProfilePage";
import AppointmentsPage from "./features/Appointment/pages/AppointmentsPage";
import LoginPage from "./features/Authentication/pages/LoginPage";
import RegisterPage from "./features/Authentication/pages/RegisterPage";
import AdminPage from "./features/admin/pages/AdminPage";
import IntegrationPage from "./features/Integration/pages/IntegrationPage";
import StaffDashboardPage from "./features/staff/pages/StaffDashboardPage";

const AppContent = () => {
  const { page, setPage } = useNavigation();
  const { user, isAuthenticated } = useAuth();

  // Route protection
  useEffect(() => {
    // If a normal user tries to access admin or staff pages
    if ((page === 'admin' || page === 'staff-dashboard') && user?.role === 'USER') {
      setPage('dashboard');
    }
    
    // If an admin is logged in, restrict them to the admin dashboard
    if (user?.role === 'ADMIN' && page !== 'admin') {
      setPage('admin');
    }

    // If staff is logged in, restrict them to staff dashboard
    if (user?.role === 'STAFF' && page !== 'staff-dashboard') {
      setPage('staff-dashboard');
    }
  }, [page, user, setPage]);

  // If Admin is logged in, only render AdminPage
  if (user?.role === 'ADMIN') {
    return <AdminPage />;
  }

  // If Staff is logged in, only render StaffDashboardPage
  if (user?.role === 'STAFF') {
    return <StaffDashboardPage />;
  }

  // Normal User / Public Routes
  return (
    <div>
      {page === "landing" && <LandingPage />}
      {page === "dashboard" && (isAuthenticated ? <DashboardPage /> : <LandingPage />)}
      {page === "services" && <ServicesPage />}
      {page === "staff" && <StaffPage />}
      {page === "appointments" && <AppointmentsPage />}
      {page === "integration" && <IntegrationPage />}
      
      {page === "profile" && <ProfilePage />}
      
      {page === "login" && (
        <LoginPage onGoToRegister={() => setPage("register")} />
      )}
      
      {page === "register" && (
        <RegisterPage onGoToLogin={() => setPage("login")} />
      )}
    </div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;