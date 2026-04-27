import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getImageUrl } from '../utils/getImageUrl';

/**
 * PATIENT DASHBOARD - RESTORED ORIGINAL UI
 * This file has been reverted to the original card-based layout as requested.
 * All dynamic data metrics and appointments are preserved.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser, role, isAuth } = useAuth();
    
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({
        upcoming: 0,
        completed: 0,
        cancelled: 0,
        healthScore: 85
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Role-based protection & Redirection logic
    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
            return;
        }
        if (role === "doctor") {
            navigate("/doctor/dashboard");
        } else if (role === "admin") {
            navigate("/admin/dashboard");
        }
    }, [isAuth, role, navigate]);

    // Data fetching
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isAuth || role !== "patient") return;
            
            try {
                setLoading(true);
                const res = await apiFetch("/api/appointments");
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data);
                    
                    // Calculate stats from real data
                    const upcoming = data.filter(a => a.status === 'upcoming').length;
                    const completed = data.filter(a => a.status === 'completed').length;
                    const cancelled = data.filter(a => a.status === 'cancelled').length;
                    
                    setStats(prev => ({
                        ...prev,
                        upcoming,
                        completed,
                        cancelled
                    }));
                } else if (res.status === 401) {
                    setError("Session expired. Please login again.");
                } else {
                    setError("Failed to load dashboard data.");
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isAuth, role]);

    if (!isAuth || role !== "patient") return null;

    const userName = currentUser?.name || "Patient";

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />

            <main className="flex-grow p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8">
                
                {/* ---------- GREETING SECTION ---------- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Hello, <span className="text-[#01579B]">{userName}</span>! 👋
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Welcome back to CareMate+! Here's your health summary.</p>
                    </div>
                </div>

                {/* ---------- STATS CARDS (ORIGINAL STRUCTURE) ---------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Health Score */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6 flex items-center gap-5 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-[#E1F5FE] text-[#0277BD] rounded-xl flex items-center justify-center text-3xl shrink-0">
                            🌡️
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Health Score</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.healthScore}%</h3>
                        </div>
                    </div>

                    {/* Card 2: Upcoming Appointments */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6 flex items-center gap-5 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-[#E0F2F1] text-[#00A896] rounded-xl flex items-center justify-center text-3xl shrink-0">
                            📅
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Upcoming</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.upcoming}</h3>
                        </div>
                    </div>

                    {/* Card 3: Daily Progress */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6 flex items-center gap-5 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center text-3xl shrink-0">
                            🔥
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Progress</p>
                            <h3 className="text-2xl font-black text-gray-900">72%</h3>
                        </div>
                    </div>

                    {/* Card 4: Medical Records */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6 flex items-center gap-5 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-3xl shrink-0">
                            📂
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Records</p>
                            <h3 className="text-2xl font-black text-gray-900">{stats.completed}</h3>
                        </div>
                    </div>
                </div>

                {/* ---------- MAIN DASHBOARD GRID ---------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Recent Appointments & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* APPOINTMENT SECTION */}
                        <section className="bg-white rounded-2xl shadow-md border border-gray-50 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-[#F8FAFC]">
                                <h3 className="text-xl font-bold text-gray-900">Recent Appointments</h3>
                                <button 
                                    onClick={() => navigate("/appointments")}
                                    className="text-sm font-bold text-[#028090] hover:text-[#01579B] transition-colors"
                                >
                                    View All →
                                </button>
                            </div>
                            
                            <div className="p-6">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-10 h-10 border-4 border-[#01579B] border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-400 mt-4 font-medium">Fetching details...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100 p-6">
                                        <span className="text-3xl block mb-2">⚠️</span>
                                        <p className="text-red-500 font-bold">{error}</p>
                                    </div>
                                ) : Array.isArray(appointments) && appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments.slice(0, 4).map((appt) => (
                                            <div key={appt?._id || Math.random()} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#E1F5FE]/30 transition-colors border border-transparent hover:border-[#B3E5FC]/40 group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-[#01579B] border border-gray-100 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                                                        {appt?.doctorId?.image ? (
                                                            <img 
                                                                src={getImageUrl(appt.doctorId.image)} 
                                                                alt={appt.doctorId.name} 
                                                                onError={(e) => { e.target.src = "/default-doctor.png"; }}
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        ) : (
                                                            appt?.doctorId?.name ? appt.doctorId.name.charAt(0) : "D"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{appt?.doctorId?.name || "CareMate Specialist"}</h4>
                                                        <p className="text-xs text-gray-500 font-medium">
                                                            {appt?.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'} • {appt?.appointmentTime || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    appt?.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                                                    appt?.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {appt?.status || 'unknown'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-14 space-y-3">
                                        <span className="text-5xl block">📅</span>

                                        <p className="text-gray-400 font-medium italic">No appointments found. Ready for a checkup?</p>
                                        <button 
                                            onClick={() => navigate("/doctors")}
                                            className="px-6 py-2.5 bg-[#01579B] text-white rounded-xl font-bold hover:bg-[#0277BD] transition-all shadow-md active:scale-95"
                                        >
                                            Book Your First Appointment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* QUICK ACTIONS / CTA BUTTONS SECTION */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <button onClick={() => navigate("/records")} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#B3E5FC] transition-all text-center group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                                <p className="text-xs font-bold text-gray-700">Records</p>
                            </button>
                            <button onClick={() => navigate("/records")} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#B3E5FC] transition-all text-center group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💊</div>
                                <p className="text-xs font-bold text-gray-700">Prescriptions</p>
                            </button>
                            <button onClick={() => navigate("/lab-tests")} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#B3E5FC] transition-all text-center group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧪</div>
                                <p className="text-xs font-bold text-gray-700">Lab Reports</p>
                            </button>
                            <button onClick={() => navigate("/payment")} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#B3E5FC] transition-all text-center group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💳</div>
                                <p className="text-xs font-bold text-gray-700">Payments</p>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar-like content */}
                    <div className="space-y-8">
                        {/* Health Statistics / Chart Placeholder */}
                        <section className="bg-white rounded-2xl shadow-md border border-gray-50 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Health Progress</h3>
                                <span className="text-xs font-bold text-[#00A896] bg-green-50 px-2 py-1 rounded">Weekly</span>
                            </div>
                            <div className="space-y-5">
                                {[
                                    { label: "Water Intake", val: 80, color: "bg-blue-500", icon: "💧" },
                                    { label: "Daily Steps", val: 65, color: "bg-[#028090]", icon: "👟" },
                                    { label: "Sleep Quality", val: 90, color: "bg-purple-500", icon: "🌙" }
                                ].map(item => (
                                    <div key={item.label} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span className="flex items-center gap-2"><span>{item.icon}</span> {item.label}</span>
                                            <span>{item.val}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                                                style={{ width: `${item.val}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* PROMO / CTA CARD */}
                        <div className="bg-gradient-to-br from-[#01579B] to-[#028090] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-3 leading-tight">Need a Consultation Now?</h4>
                                <p className="text-white/80 text-sm mb-6 leading-relaxed">Connect with our top specialists in minutes through secure video call.</p>
                                <button 
                                    onClick={() => navigate("/doctors")}
                                    className="w-full bg-white text-[#01579B] font-bold py-3 rounded-2xl hover:bg-[#B3E5FC] transition-colors shadow-lg active:scale-95"
                                >
                                    Book Consult ➡️
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
