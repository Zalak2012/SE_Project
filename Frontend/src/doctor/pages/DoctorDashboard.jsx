import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, initialized } = useAuth();
    const userName = currentUser?.name || "Doctor";

    const [stats, setStats] = useState({
        todayAppointments: 0,
        totalPatients: 0,
        pendingAppointments: 0,
        completedAppointments: 0
    });
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [scheduleSlots, setScheduleSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth to initialize
        if (!initialized) return;

        // If not logged in as doctor, redirect
        if (!currentUser) {
            navigate("/login");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Standardizing with standardized api endpoints
                const [statsRes, appointmentsRes, scheduleRes] = await Promise.allSettled([
                    apiFetch("/api/doctor/stats"),
                    apiFetch("/api/appointments"),
                    apiFetch(`/api/schedule?doctorId=${currentUser._id}&date=${new Date().toISOString()}`)
                ]);

                if (statsRes.status === "fulfilled" && statsRes.value.ok) {
                    setStats(await statsRes.value.json());
                }
                
                if (appointmentsRes.status === "fulfilled" && appointmentsRes.value.ok) {
                    const allAppts = await appointmentsRes.value.json();
                    if (Array.isArray(allAppts)) {
                        const todayStr = new Date().toDateString();
                        const todayOnly = allAppts.filter(a => a?.appointmentDate && new Date(a.appointmentDate).toDateString() === todayStr);
                        setTodayAppointments(todayOnly.slice(0, 5)); 
                    }
                }

                if (scheduleRes.status === "fulfilled" && scheduleRes.value.ok) {
                    const sched = await scheduleRes.value.json();
                    setScheduleSlots(sched?.slots || []);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser?._id, initialized, navigate]);



    const statCards = [
        { label: "Today's Appointments", value: stats.todayAppointments || 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Patients', value: stats.totalPatients || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending Requests', value: stats.pendingAppointments || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed Today', value: stats.completedAppointments || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const handleComplete = async (id) => {
        try {
            const res = await apiFetch(`/api/appointments/${id}`, {
                method: "PUT",
                body: JSON.stringify({ status: "completed" })
            });
            if (res.ok) {
                setTodayAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'completed' } : a));
                // Refresh stats
                const statsRes = await apiFetch("/api/doctor/stats");
                if (statsRes.ok) setStats(await statsRes.json());
            }
        } catch (err) {
            console.error("Update status error:", err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
            <p className="text-gray-500 font-medium italic">Loading dashboard metrics...</p>
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-[1400px] mx-auto space-y-6">
            {/* 1. TOP SECTION (WELCOME BANNER) */}
            <div className="bg-gradient-to-r from-[#028090] to-[#01579B] rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white overflow-hidden relative border border-white/10">
                <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 right-40 w-32 h-32 bg-[#F0F3BD]/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome, {userName} 👋</h2>
                    <p className="text-white/80 font-medium text-lg mt-1">
                        You have <span className="text-[#F0F3BD] font-bold">{stats.todayAppointments || 0}</span> appointments scheduled for today.
                    </p>
                </div>
                
                <div className="flex gap-3 relative z-10 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('/doctor/appointments')}
                        className="flex-1 md:flex-none bg-[#F0F3BD] text-[#01579B] px-7 py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Check Appointments
                    </button>
                    <button 
                        onClick={() => navigate('/doctor/records')}
                        className="flex-1 md:flex-none bg-white/10 border border-white/20 text-white hover:bg-white/20 px-7 py-3.5 rounded-2xl font-bold backdrop-blur-sm transition-all"
                    >
                        Patient Records
                    </button>
                </div>
            </div>

            {/* 2. STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md hover:border-[#028090]/30 transition-all group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900 leading-tight">{stat.value}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. MAIN CONTENT GRID */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* 4. TODAY'S APPOINTMENTS (LEFT) */}
                <div className="lg:col-span-8 bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Today's Appointments</h3>
                            <p className="text-sm text-gray-500 mt-1">Real-time patient queue</p>
                        </div>
                        <button 
                            onClick={() => navigate('/doctor/appointments')}
                            className="px-4 py-2 text-sm font-bold text-[#028090] bg-[#028090]/5 rounded-xl hover:bg-[#028090]/10 transition-colors flex items-center gap-2"
                        >
                            View Full List <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {todayAppointments.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <div className="text-4xl mb-4 opacity-50">📅</div>
                                <p className="text-gray-400 font-bold italic tracking-tight">No consultations scheduled for today</p>
                                <button 
                                    onClick={() => navigate('/doctor/schedule')}
                                    className="mt-4 text-[#028090] text-sm font-bold hover:underline"
                                >
                                    Manage your availability
                                </button>
                            </div>
                        ) : todayAppointments.map((appt) => (
                            <div key={appt._id} className="bg-white hover:bg-gray-50/50 py-5 px-6 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 transition-all border border-gray-100 hover:border-[#028090]/30 hover:shadow-sm">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#028090] to-[#01579B] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner shrink-0 overflow-hidden">
                                        {appt.patientId?.name?.charAt(0) || "P"}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">{appt.patientId?.name || "Unknown Patient"}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-[#028090] uppercase tracking-wider">{appt.consultationType}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-500 font-medium">#{appt._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0 border-gray-50">
                                    <div className="text-right shrink-0">
                                        <p className="font-black text-gray-900 text-lg">{appt.appointmentTime}</p>
                                        <div className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg mt-1 uppercase tracking-widest ${
                                            appt.status === 'completed' 
                                                ? 'bg-emerald-50 text-emerald-600' 
                                                : 'bg-[#F0F3BD]/50 text-[#01579B]'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${appt.status === 'completed' ? 'bg-emerald-500' : 'bg-[#01579B]'}`}></div>
                                            {appt.status}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => navigate(`/doctor/records?patientId=${appt.patientId?._id}`)}
                                            className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#028090] hover:border-[#028090] flex items-center justify-center shadow-sm transition-all hover:scale-105" 
                                            title="Medical Records"
                                        >
                                            <Users className="w-5 h-5" />
                                        </button>
                                        {appt.status === 'upcoming' && (
                                            <button 
                                                onClick={() => handleComplete(appt._id)}
                                                className="w-11 h-11 rounded-xl bg-[#028090] text-white hover:bg-[#01579B] flex items-center justify-center shadow-md shadow-[#028090]/20 transition-all hover:scale-105 active:scale-95" 
                                                title="Complete Consultation"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. TODAY'S SCHEDULE (RIGHT) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Today's Slots</h3>
                            <button 
                                onClick={() => navigate('/doctor/schedule')}
                                className="text-xs font-bold text-gray-400 hover:text-[#028090] transition-colors uppercase tracking-widest"
                            >
                                Manage
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {scheduleSlots.length === 0 ? (
                                <div className="col-span-2 text-center py-6 text-gray-400 text-xs font-medium italic">
                                    No slots configured for today
                                </div>
                            ) : scheduleSlots.map((slot, i) => {
                                let slotClass = "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"; 
                                if (slot.status === 'available') {
                                    slotClass = "border-gray-200 bg-white text-gray-600 hover:border-[#028090] hover:text-[#028090] cursor-pointer";
                                } else if (slot.status === 'booked') {
                                    slotClass = "border-[#F0F3BD] bg-[#F0F3BD]/30 text-[#01579B] cursor-default";
                                } else if (slot.status === 'active') {
                                    slotClass = "border-[#028090] bg-[#028090] text-white shadow-md cursor-default scale-105";
                                }

                                return (
                                    <div 
                                        key={i} 
                                        className={`py-3 px-2 text-xs font-black rounded-xl border text-center transition-all ${slotClass}`}
                                    >
                                        {slot.time}
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#028090]"></span> Active
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#F0F3BD]"></span> Booked
                            </div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200"></span> Open
                            </div>
                        </div>
                    </div>

                    {/* QUICK ANALYTICS / TIPS */}
                    <div className="bg-gradient-to-br from-indigo-900 to-[#01579B] rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <CheckCircle className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold mb-2">Did you know?</h4>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                            Patients who receive digital prescriptions within 24 hours are 40% more likely to book a follow-up.
                        </p>
                        <button className="text-xs font-bold text-[#F0F3BD] hover:underline uppercase tracking-widest">
                            Learn more about Patient Care →
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorDashboard;
