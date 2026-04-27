import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DoctorRoutes = () => {
    const { isAuth, role, initialized } = useAuth();
    
    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (!isAuth) return <Navigate to="/login" replace />;
    if (role !== "doctor") return <Navigate to="/dashboard" replace />;
    
    return <Outlet />;
};

export default DoctorRoutes;
