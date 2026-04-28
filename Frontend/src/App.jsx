import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
import PaymentPage from './pages/PaymentPage';
import AppointmentsPage from './pages/AppointmentsPage';
import LabTestsPage from './pages/LabTestsPage';
import HealthRecordsPage from './pages/HealthRecordsPage';

// Doctor Imports
import DoctorRoutes from './doctor/layout/DoctorRoutes';
import DoctorLayout from './doctor/layout/DoctorLayout';
import DoctorDashboard from './doctor/pages/DoctorDashboard';
import DoctorPatients from './doctor/pages/DoctorPatients';
import PatientDetails from './doctor/pages/PatientDetails';
import DoctorAppointments from './doctor/pages/DoctorAppointments';
import DoctorSchedule from './doctor/pages/DoctorSchedule';
import MedicalRecords from './doctor/pages/MedicalRecords';
import Prescriptions from './doctor/pages/Prescriptions';
import DoctorProfilePage from './doctor/pages/DoctorProfilePage';

// Admin Imports
import AdminRoutes from './Admin/routes/AdminRoutes';
import AdminLayout from './Admin/layout/AdminLayout';
import AdminDashboard from './Admin/pages/AdminDashboard';
import ManageUsers from './Admin/pages/ManageUsers';
import DoctorApprovals from './Admin/pages/DoctorApprovals';
import Analytics from './Admin/pages/Analytics';
import AdminProfile from './Admin/pages/AdminProfile';
import AdminSettings from './Admin/pages/AdminSettings';
import ManageReviews from './Admin/pages/ManageReviews';
import ManageLabTests from './Admin/pages/ManageLabTests';
import Appointments from './Admin/pages/Appointments';
import AIMonitoring from './Admin/pages/AIMonitoring';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public & Patient Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/doctors" element={<FindDoctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/ai-checker" element={<AICheckerPage />} />
            
            {/* Standardized Patient Dashboard with Role Guarding */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard/profile/edit" element={<EditProfilePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/lab-tests" element={<LabTestsPage />} />
            <Route path="/records" element={<HealthRecordsPage />} />

            {/* Admin Protected Routes */}
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="approvals" element={<DoctorApprovals />} />
                <Route path="reviews" element={<ManageReviews />} />
                <Route path="lab-tests" element={<ManageLabTests />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="ai-monitoring" element={<AIMonitoring />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Doctor Protected Routes */}
            <Route element={<DoctorRoutes />}>
              <Route path="/doctor" element={<DoctorLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="patient/:id" element={<PatientDetails />} />
                <Route path="schedule" element={<DoctorSchedule />} />
                <Route path="records" element={<MedicalRecords />} />
                <Route path="prescriptions" element={<Prescriptions />} />
                <Route path="profile" element={<DoctorProfilePage />} />
              </Route>
            </Route>
            
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;