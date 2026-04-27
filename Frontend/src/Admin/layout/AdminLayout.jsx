import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="flex flex-col h-screen bg-[#F5F7FA] font-sans overflow-hidden">
            {/* Top Navbar */}
            <AdminNavbar toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 flex min-h-0 relative">
                {/* Sidebar Drawer */}
                <AdminSidebar 
                    isOpen={isSidebarOpen} 
                    setIsOpen={setIsSidebarOpen} 
                />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto w-full p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
