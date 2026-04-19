import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoutes = () => {
    const { isAuth, role } = useAuth();
    
    if (!isAuth) return <Navigate to="/login" replace />;
    if (role !== "admin") return <Navigate to="/dashboard" replace />;
    
    return <Outlet />;
};

export default AdminRoutes;
