import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const { currentUser, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Manage Users', path: '/admin/manage-users', icon: '👥' },
        { name: 'Doctor Approvals', path: '/admin/approvals', icon: '👨‍⚕️' },
        { name: 'Manage Lab Tests', path: '/admin/lab-tests', icon: '🧪' },
        { name: 'Manage Reviews', path: '/admin/reviews', icon: '⭐' },
        { name: 'Appointments', path: '/admin/appointments', icon: '📅' },
        { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    ];

    const settingItems = [
        { name: 'Profile', path: '/admin/profile', icon: '👤' },
    ];

    return (
        <>
            {/* Dark Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Drawer */}
            <aside 
                className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#1E6FAF] text-white flex flex-col shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header inside drawer */}
                <div className="p-6 pb-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 text-white font-bold text-xl shadow-sm">
                            💙
                        </div>
                        <span className="text-xl font-bold tracking-tight">CareMate<span className="text-white/80">Plus</span></span>
                    </div>
                    {/* Close button */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Close Sidebar"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6 space-y-1">
                    <p className="px-3 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Main Menu</p>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive ? 'bg-[#2F80C1] text-white shadow-md' : 'text-white/70 hover:bg-[#2F80C1]/50 hover:text-white'
                                }`
                            }
                        >
                            <span className="text-xl shrink-0">{item.icon}</span>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}

                    <p className="px-3 text-xs font-bold text-white/50 uppercase tracking-wider mb-2 mt-8">System</p>
                    {settingItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive ? 'bg-[#2F80C1] text-white shadow-md' : 'text-white/70 hover:bg-[#2F80C1]/50 hover:text-white'
                                }`
                            }
                        >
                            <span className="text-xl shrink-0">{item.icon}</span>
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Profile Footer */}
                <div className="p-4 border-t border-white/10 mt-auto bg-[#185e96]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-white text-[#1E6FAF] flex items-center justify-center font-bold text-lg shadow-sm">
                            {currentUser?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">{currentUser?.name || 'Admin User'}</p>
                            <p className="text-xs text-white/80 truncate">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full py-2.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
