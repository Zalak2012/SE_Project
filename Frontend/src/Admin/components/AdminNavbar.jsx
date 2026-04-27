import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = ({ toggleSidebar }) => {
    const { currentUser, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Manage Users', path: '/admin/manage-users' },
        { name: 'Doctor Approvals', path: '/admin/approvals' },
        { name: 'Analytics', path: '/admin/analytics' },
    ];

    return (
        <header className="bg-gradient-to-r from-[#1E6FAF] to-[#2F80C1] h-[70px] flex items-center justify-between px-4 md:px-8 z-20 shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative text-white rounded-b-sm">

            {/* Left side: Hamburger & Logo */}
            <div className="flex items-center gap-4 flex-1 justify-start">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors focus:outline-none"
                    aria-label="Toggle Sidebar"
                >
                    <span className="text-2xl font-bold">☰</span>
                </button>
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1E6FAF] font-bold text-xl shadow-sm transition-transform group-hover:scale-105">
                        C
                    </div>
                    <span className="hidden sm:block text-xl font-bold tracking-tight">
                        Care<span className="text-[#80DEEA]">Mate</span><span className="text-white/80">Plus</span>
                        {/* <span className="ml-1 text-sm font-medium uppercase tracking-wider text-white/60">Admin</span> */}
                    </span>
                </div>
            </div>

            {/* Exact Center: Horizontal Navigation */}
            <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 h-10">
                {navItems.map(item => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                ? 'bg-white/20 text-white shadow-sm'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Right Side: Notifications & Profile */}
            <div className="flex items-center gap-6 text-white flex-1 justify-end">

                {/* Notification Bell */}
                <button className="relative hover:bg-white/10 p-2 rounded-full transition-colors">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] border-2 border-[#1E6FAF] rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="w-9 h-9 rounded-full bg-white text-[#1E6FAF] flex items-center justify-center font-bold text-sm shadow-sm hover:scale-105 transition-transform">
                            {currentUser?.name?.charAt(0) || 'A'}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-2 animate-[fadeIn_0.2s_ease-out] text-[#1F2937]">
                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                <p className="text-sm font-bold">{currentUser?.name || 'Admin User'}</p>
                                <p className="text-xs text-[#6B7280] capitalize mt-0.5">{currentUser?.role || 'Administrator'}</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-[#1F2937] hover:bg-gray-50 transition-colors">
                                Profile Settings
                            </button>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-red-50 transition-colors font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
