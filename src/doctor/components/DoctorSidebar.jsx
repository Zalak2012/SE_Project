import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Clock, User, LogOut, FileText, Pill } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DoctorSidebar = ({ isOpen, setIsOpen }) => {
    const { logout, currentUser } = useAuth();
    const userName = currentUser?.name || "Dr. Smith";
    const userInitials = currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "DR";
    
    const menuItems = [
        { name: 'Dashboard', path: '/doctor-dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/doctor-appointments', icon: Calendar },
        { name: 'Patients', path: '/doctor-patients', icon: Users },
        { name: 'Schedule', path: '/doctor-schedule', icon: Clock },
        { name: 'Medical Records', path: '/doctor-records', icon: FileText },
        { name: 'Prescriptions', path: '/doctor-prescriptions', icon: Pill },
        { name: 'Profile', path: '/doctor-profile', icon: User },
    ];

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-20"
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#01579B] text-white transition-transform duration-300 transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center gap-2 border-b border-white/10 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#01579B] font-bold text-xl shadow-sm">
                        C
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Care<span className="text-[#00FFD1]">Mate</span><span className="text-[#B3E5FC]">Plus</span>
                    </span>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <p className="px-2 text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Main Menu</p>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                isActive ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                
                <div className="p-4 border-t border-white/10 shrink-0">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                    <div className="mt-4 flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold uppercase">{userInitials}</div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{userName}</p>
                            <p className="text-xs text-white/50 truncate">Doctor</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorSidebar;
