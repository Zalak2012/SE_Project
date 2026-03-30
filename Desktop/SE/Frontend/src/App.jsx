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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;