import React, { useState, useEffect } from 'react';
import { Menu, Bell, Calendar, Users, Clock, MessageSquare, Star, X, FileText } from 'lucide-react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { apiFetch } from '../../utils/api';

const DoctorNavbar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const [isAvailable, setIsAvailable] = useState(true);
    const { currentUser } = useAuth();
    const { addReview } = useData();
    const [feedbackModal, setFeedbackModal] = useState({ show: false, rating: 5, text: '' });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const userInitials = currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : "DR";

    useEffect(() => {
        if (!currentUser) return;
        const fetchNotifications = async () => {
            try {
                const res = await apiFetch("/api/notifications");
                if (res.ok) {
                    setNotifications(await res.json());
                }
            } catch (err) {
                console.error("Notifications fetch error:", err);
            }
        };
        fetchNotifications();
        
        // Optional: Polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [currentUser]);

    const handleNotificationsClick = async () => {
        setShowNotifications(!showNotifications);
        
        // Mark as read if opening
        if (!showNotifications && notifications.some(n => !n.isRead)) {
            try {
                await apiFetch("/api/notifications/mark-read", { method: "POST" });
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            } catch (e) {
                console.error("Mark read error", e);
            }
        }
    };

    const submitPlatformFeedback = () => {
        if (!feedbackModal.text.trim()) return;
        addReview({
            userName: currentUser?.name || "Doctor User",
            userType: "Doctor",
            text: `[Platform Feedback] ${feedbackModal.text}`,
            rating: feedbackModal.rating,
            status: "Pending",
            avatar: currentUser?.avatar,
            doctorId: currentUser?.userId || currentUser?._id
        });
        setFeedbackModal({ show: false, rating: 5, text: '' });
    };

    return (
        <header className="bg-[#01579B] text-white border-b border-[#01579B]/80 h-16 shrink-0 flex items-center justify-between px-4 sticky top-0 z-40 shadow-md">
            {/* Left Side */}
            <div className="flex items-center gap-4 relative z-10 w-1/4">
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 -ml-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo from Home Page styled for dark bg */}
                <Link to="/" className="flex items-center gap-2 group mr-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-white/20 transition-colors">
                        C
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                        Care<span className="text-[#00FFD1]">Mate</span><span className="text-[#B3E5FC]">Plus</span>
                    </span>
                </Link>
            </div>

            {/* Center Navigation - Hidden on mobile, flex on large screens */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
                <NavLink 
                    to="/doctor/appointments" 
                    className={({isActive}) => `flex items-center gap-2 text-sm font-semibold transition-all ${isActive ? 'text-white drop-shadow-md' : 'text-white/70 hover:text-white'}`}
                >
                    <Calendar className="w-4 h-4" /> Appointments
                </NavLink>
                <NavLink 
                    to="/doctor/patients" 
                    className={({isActive}) => `flex items-center gap-2 text-sm font-semibold transition-all ${isActive ? 'text-white drop-shadow-md' : 'text-white/70 hover:text-white'}`}
                >
                    <Users className="w-4 h-4" /> Patients
                </NavLink>
                <NavLink 
                    to="/doctor/records" 
                    className={({isActive}) => `flex items-center gap-2 text-sm font-semibold transition-all ${isActive ? 'text-white drop-shadow-md' : 'text-white/70 hover:text-white'}`}
                >
                    <FileText className="w-4 h-4" /> Records
                </NavLink>
                <NavLink 
                    to="/doctor/schedule" 
                    className={({isActive}) => `flex items-center gap-2 text-sm font-semibold transition-all ${isActive ? 'text-white drop-shadow-md' : 'text-white/70 hover:text-white'}`}
                >
                    <Clock className="w-4 h-4" /> Schedule
                </NavLink>
            </nav>

            {/* Right Side */}
            <div className="flex items-center justify-end gap-4 relative z-10 w-1/4">
                {/* Availability Toggle */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#00FFD1]' : 'bg-gray-400'} ${isAvailable ? 'shadow-[0_0_8px_rgba(0,255,209,0.6)]' : ''}`}></div>
                    <span className="text-xs font-semibold text-white">
                        {isAvailable ? 'Available' : 'Offline'}
                    </span>
                    <button 
                        onClick={() => setIsAvailable(!isAvailable)}
                        className={`ml-1 relative w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${isAvailable ? 'bg-[#00FFD1]/80' : 'bg-gray-400'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                </div>

                <button 
                    onClick={() => setFeedbackModal({ show: true, rating: 5, text: '' })}
                    className="relative p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors"
                    title="Platform Feedback"
                >
                    <MessageSquare className="w-5 h-5" />
                </button>

                <div className="relative">
                    <button 
                        onClick={handleNotificationsClick}
                        className="relative p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-[#01579B]" />
                        )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-200 z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">Notifications</h3>
                                <span className="text-xs font-semibold bg-[#E1F5FE] text-[#01579B] px-2 py-1 rounded-lg">
                                    {notifications.length}
                                </span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <div key={n._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                                            <p className="text-sm font-bold text-gray-800">{n.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2 font-semibold uppercase tracking-wider">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-gray-500 text-sm font-medium">
                                        No notifications yet
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-8 rounded-full bg-white text-[#01579B] flex items-center justify-center font-bold text-sm shadow-sm uppercase shrink-0">
                    {userInitials}
                </div>
            </div>

            {/* PLATFORM FEEDBACK MODAL */}
            {feedbackModal.show && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-2xl w-[90%] max-w-[500px] flex flex-col overflow-hidden shadow-xl animate-[slideUp_0.3s_ease-out]">
                        <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Platform Feedback</h2>
                            <button onClick={() => setFeedbackModal({ show: false, rating: 5, text: '' })} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">How would you rate CareMatePlus?</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            onClick={() => setFeedbackModal(prev => ({ ...prev, rating: star }))}
                                            className={`p-1 transition-all ${feedbackModal.rating >= star ? 'text-yellow-500 scale-110' : 'text-gray-300 hover:text-yellow-300'}`}
                                        >
                                            <Star className="w-8 h-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Your Feedback</label>
                                <textarea 
                                    rows="4" 
                                    placeholder="Tell us what you like or how we can improve your experience..."
                                    value={feedbackModal.text}
                                    onChange={e => setFeedbackModal(prev => ({ ...prev, text: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#028090] focus:border-transparent resize-none shadow-sm text-gray-800"
                                />
                            </div>
                            <button 
                                onClick={submitPlatformFeedback}
                                disabled={!feedbackModal.text.trim()}
                                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all ${
                                    feedbackModal.text.trim() ? 'bg-[#028090] hover:bg-[#026c7a] shadow-md hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default DoctorNavbar;
