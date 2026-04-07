import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import FindDoctors from './pages/FindDoctors';
import DoctorProfile from './pages/DoctorProfile';
import SpecialtiesPage from './pages/SpecialtiesPage';
import AboutUsPage from './pages/AboutUsPage';
import AICheckerPage from './pages/AICheckerPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import BookingPage from './pages/BookingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import LabTestsPage from './pages/LabTestsPage';
import HealthRecordsPage from './pages/HealthRecordsPage';

// Admin Imports
import AdminRoutes from './Admin/routes/AdminRoutes';
import AdminLayout from './Admin/layout/AdminLayout';
import AdminDashboard from './Admin/pages/AdminDashboard';
import ManageUsers from './Admin/pages/ManageUsers';
import DoctorApprovals from './Admin/pages/DoctorApprovals';
import Analytics from './Admin/pages/Analytics';
import AdminProfile from './Admin/pages/AdminProfile';
import AdminSettings from './Admin/pages/AdminSettings';
import { AdminAppointments } from './Admin/pages/PlaceholderPages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public & Patient/Doctor Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/doctors" element={<FindDoctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/ai-checker" element={<AICheckerPage />} />
          <Route path="/dashboard/:role" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard/profile/edit" element={<EditProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/lab-tests" element={<LabTestsPage />} />
          <Route path="/records" element={<HealthRecordsPage />} />

          {/* Admin Protected Routes */}
          <Route element={<AdminRoutes />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/admin/approvals" element={<DoctorApprovals />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;