import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
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
import AIMonitoring from './Admin/pages/AIMonitoring';
import { AdminAppointments } from './Admin/pages/PlaceholderPages';

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
            <Route path="/doctors" element={<FindDoctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
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
                <Route path="/admin/reviews" element={<ManageReviews />} />
                <Route path="/admin/lab-tests" element={<ManageLabTests />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/ai-monitoring" element={<AIMonitoring />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Doctor Protected Routes */}
            <Route element={<DoctorRoutes />}>
              <Route element={<DoctorLayout />}>
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-patients" element={<DoctorPatients />} />
                <Route path="/doctor-patient/:id" element={<PatientDetails />} />
                <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                <Route path="/doctor-schedule" element={<DoctorSchedule />} />
                <Route path="/doctor-records" element={<MedicalRecords />} />
                <Route path="/doctor-prescriptions" element={<Prescriptions />} />
                <Route path="/doctor-profile" element={<DoctorProfilePage />} />
              </Route>
            </Route>
            
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;