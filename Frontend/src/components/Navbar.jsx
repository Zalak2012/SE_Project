import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuth, role, currentUser, logout, handleProtectedAction } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // State for Modals/Menus
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    
    // Auth Dropdown State
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    // Dynamic User Info for UI
    const userName = currentUser?.name || "User";
    const userInitials = currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "U";

    // Close Dropdown and Sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            // For sidebar overlay click, we handle it on the overlay div directly
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close sidebar on route change
    useEffect(() => {
        setShowSidebar(false);
        setShowProfileDropdown(false);
    }, [location.pathname]);

    // UI Handle Profile Dropdown
    const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

    return (
        <>
            {/* Role Selection Modal (Before Login - Get Started) */}
            {showRoleModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-[slideUp_0.3s_ease-out]">
                        <h3 className="text-2xl font-bold text-[#01579B] mb-2 text-center">Join CareMatePlus</h3>
                        <p className="text-gray-600 text-center mb-6 text-sm">Select how you want to use our platform</p>
                        <div className="space-y-3">
                            {[
                                { id: "patient", title: "Patient", icon: "👶", desc: "Book appointments & manage health" },
                                { id: "doctor", title: "Doctor", icon: "🩺", desc: "Manage patients & schedule" },
                                { id: "admin", title: "Admin", icon: "🛡️", desc: "System administration" }
                            ].map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => {
                                        setShowRoleModal(false);
                                        navigate('/signup', { state: { defaultRole: r.id } });
                                    }}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#039BE5] hover:bg-[#E1F5FE] transition-all text-left group"
                                >
                                    <div className="text-3xl group-hover:scale-110 transition-transform">{r.icon}</div>
                                    <div>
                                        <div className="font-bold text-gray-800 group-hover:text-[#01579B]">{r.title}</div>
                                        <div className="text-xs text-gray-500">{r.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowRoleModal(false)}
                            className="w-full mt-6 py-3 font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* --- SIDEBAR IMPLEMENTATION --- */}
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[110] transition-opacity duration-300 ${showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setShowSidebar(false)}
            ></div>
            
            {/* Sidebar Content */}
            <div 
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out flex flex-col ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#01579B] flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#01579B]">
                            Care<span className="text-[#00A896]">Mate</span>
                        </span>
                    </div>
                    <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:text-gray-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto py-4">
                    <nav className="space-y-1 px-4">
                        <Link to={role === 'admin' ? '/admin/dashboard' : role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} onClick={(e) => handleProtectedAction(e, role === 'admin' ? '/admin/dashboard' : role === 'doctor' ? '/doctor/dashboard' : '/dashboard')} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">📊</span> Dashboard
                        </Link>
                        <Link to="/doctors" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">🩺</span> Find Doctors
                        </Link>
                        <a href="#" onClick={(e) => handleProtectedAction(e, '/appointments')} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">📅</span> Appointments
                        </a>
                        <Link to="/ai-checker" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">🤖</span> AI Symptom Checker
                        </Link>
                        <Link to="/lab-tests" onClick={(e) => handleProtectedAction(e, '/lab-tests')} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">🧪</span> Lab Tests
                        </Link>
                        <Link to="/records" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">📂</span> Health Records
                        </Link>
                        <Link to="/profile" onClick={(e) => handleProtectedAction(e, '/profile')} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#E1F5FE] hover:text-[#01579B] rounded-xl font-medium transition-colors">
                            <span className="text-xl">👤</span> Profile
                        </Link>
                    </nav>
                </div>

                {/* Sidebar Bottom */}
                {isAuth ? (
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-[#028090] text-white flex items-center justify-center font-bold">
                                {userInitials}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{userName}</p>
                                <p className="text-xs text-gray-500 capitalize">{role} Account</p>
                            </div>
                        </div>
                        <button onClick={() => { setShowSidebar(false); logout(); }} className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-semibold transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-2">
                        <Link to="/login" className="w-full text-center py-2.5 text-[#0277BD] hover:bg-[#E1F5FE] rounded-xl font-bold transition-colors">
                            Sign In
                        </Link>
                        <button onClick={() => { setShowSidebar(false); setShowRoleModal(true); }} className="w-full text-center py-2.5 bg-[#0277BD] hover:bg-[#01579B] text-white rounded-xl font-bold transition-colors">
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            {/* --- MAIN NAVBAR --- */}
            {/* Enforcing Left, Center, Right using flex justify-between / flex-1 */}
            <header className="sticky top-0 z-50 bg-white border-b border-[#B3E5FC]/50 shadow-sm h-16 md:h-20 flex flex-col justify-center">
                <div className="px-4 md:px-8 flex justify-between items-center w-full max-w-[1400px] mx-auto">
                    
                    {/* LEFT SIDE: Hamburger + Logo */}
                    <div className="flex items-center gap-4 flex-1 justify-start">
                        {/* Hamburger Icon */}
                        <button 
                            onClick={() => setShowSidebar(true)} 
                            className="p-2 -ml-2 text-gray-600 hover:text-[#01579B] hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                            aria-label="Open sidebar menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>

                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-[#01579B] flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-[#0277BD] transition-colors">
                                C
                            </div>
                            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#01579B]">
                                Care<span className="text-[#00A896]">Mate</span><span className="text-[#039BE5]">Plus</span>
                            </span>
                        </Link>
                    </div>

                    {/* CENTER: Navigation Links (Hidden on small screens) */}
                    <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
                        <Link to="/doctors" className="text-gray-600 hover:text-[#0277BD] font-semibold transition-colors whitespace-nowrap">Find Doctors</Link>
                        <Link to="/specialties" className="text-gray-600 hover:text-[#0277BD] font-semibold transition-colors whitespace-nowrap">Specialities</Link>
                        <Link to="/ai-checker" className="text-gray-600 hover:text-[#0277BD] font-semibold transition-colors whitespace-nowrap">AI Checker</Link>
                        <Link to="/about" className="text-gray-600 hover:text-[#0277BD] font-semibold transition-colors whitespace-nowrap">About Us</Link>
                    </nav>

                    {/* RIGHT SIDE: Authentication Area */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        {isAuth ? (
                            <div className="relative" ref={dropdownRef}>
                                {/* Profile Avatar Button */}
                                <button 
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-50 hover:bg-[#E1F5FE] border border-gray-200 hover:border-[#B3E5FC] rounded-full transition-all focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#028090] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                        {userInitials}
                                    </div>
                                    <span className="text-sm font-bold text-[#01579B] hidden sm:block">
                                        {userName}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-200 origin-top-right z-50 overflow-hidden ${showProfileDropdown ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                                    
                                    {/* Mobile info (visible if screen is small) */}
                                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50 sm:hidden">
                                        <p className="font-bold text-gray-800 text-sm truncate">{userName}</p>
                                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                                    </div>

                                    <div className="py-2">
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F8FAFC] hover:text-[#01579B] transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            My Profile
                                        </Link>
                                        <Link 
                                            to={role === 'admin' ? '/admin/dashboard' : role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} 
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#F8FAFC] hover:text-[#01579B] transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                            Dashboard
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-100 py-1">
                                        <button
                                            onClick={() => { setShowProfileDropdown(false); logout(); }}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-[#0277BD] font-bold hover:text-[#01579B] transition-colors hidden sm:flex items-center gap-1.5 px-2"
                                >
                                    Sign In
                                </Link>
                                <button 
                                    onClick={() => setShowRoleModal(true)} 
                                    className="bg-[#0277BD] hover:bg-[#01579B] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </header>
        </>
    );
};

export default Navbar;
