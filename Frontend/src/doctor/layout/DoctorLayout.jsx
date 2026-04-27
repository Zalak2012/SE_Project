import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from '../components/DoctorSidebar';
import DoctorNavbar from '../components/DoctorNavbar';

const DoctorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-grow flex flex-col min-w-0 transition-all duration-300 relative">
                <DoctorNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DoctorLayout;
