import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
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
        const fetchDashboardData = async () => {

            if (!currentUser?._id) return;
            
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
    }, [currentUser?._id]);



    const statCards = [
        { label: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending Requests', value: stats.pendingAppointments, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed Today', value: stats.completedAppointments, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
            <p className="text-gray-500 font-medium italic">Loading dashboard metrics...</p>
        </div>
    );

    return (
        <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-[1400px] mx-auto space-y-6">
            {/* 1. TOP SECTION (WELCOME BANNER) */}
            <div className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] rounded-3xl p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white overflow-hidden relative">
                <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 right-40 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome, {userName} 👋</h2>
                    <p className="text-[#bae6fd] font-medium text-lg mt-1">You have 12 appointments today · 5 pending requests</p>
                </div>
                
                <div className="flex gap-3 relative z-10 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('/doctor/appointments')}
                        className="flex-1 md:flex-none bg-white text-[#0284c7] px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                        View Appointments
                    </button>
                    <button 
                        onClick={() => navigate('/doctor/patients')}
                        className="flex-1 md:flex-none bg-white/20 border border-white/30 text-white hover:bg-white/30 px-6 py-3 rounded-xl font-bold backdrop-blur-sm transition-all"
                    >
                        My Patients
                    </button>
                </div>
            </div>

            {/* 2. STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-800 leading-tight">{stat.value}</p>
                            <p className="text-sm font-semibold text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. MAIN CONTENT GRID */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* 4. TODAY'S APPOINTMENTS (LEFT) */}
                <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Today's Appointments</h3>
                        <button 
                            onClick={() => navigate('/doctor/appointments')}
                            className="text-sm font-bold text-[#0ea5e9] hover:underline flex items-center"
                        >
                            View All <ChevronRight className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {todayAppointments.length === 0 ? (
                            <p className="text-gray-400 text-center py-8 font-medium">No appointments today</p>
                        ) : todayAppointments.map((appt) => (
                            <div key={appt._id} className="bg-[#f0f9ff] py-4 px-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow border border-[#bae6fd]/50">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-white text-[#0ea5e9] rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0 border border-[#e0f2fe]">
                                        {appt.patientId?.name?.charAt(0) || "P"}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{appt.patientId?.name || "Unknown Patient"}</h4>
                                        <p className="text-sm font-medium text-gray-500 truncate mt-0.5">{appt.consultationType}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto mt-2 sm:mt-0">
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-gray-800">{appt.appointmentTime}</p>
                                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider ${
                                            appt.status === 'completed' 
                                                ? 'bg-emerald-100 text-emerald-700' 
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                    
                                    {appt.status === 'upcoming' && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate('/doctor/patients')}
                                                className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-[#0ea5e9] hover:border-[#0ea5e9] flex items-center justify-center shadow-sm transition-colors" 
                                                title="View Patient"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                            <button className="w-9 h-9 rounded-full bg-[#0ea5e9] text-white hover:bg-[#0284c7] flex items-center justify-center shadow-sm transition-colors" title="Mark as Done">
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. TODAY'S SCHEDULE (RIGHT) */}
                <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
                        <button className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors">
                            Manage
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {scheduleSlots.map((slot, i) => {
                            let slotClass = "border-gray-200 bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-not-allowed"; 
                            if (slot.status === 'available') {
                                slotClass = "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 cursor-pointer";
                            } else if (slot.status === 'booked') {
                                slotClass = "border-[#bae6fd] bg-[#f0f9ff] text-[#0284c7] cursor-pointer hover:bg-[#e0f2fe]";
                            } else if (slot.status === 'active') {
                                slotClass = "border-[#0ea5e9] bg-[#0ea5e9] text-white shadow-md cursor-pointer hover:bg-[#0284c7]";
                            } else if (slot.status === 'break') {
                                slotClass = "border-dashed border-gray-200 bg-white text-gray-400 cursor-default";
                            }

                            return (
                                <button 
                                    key={i} 
                                    className={`py-2.5 px-2 text-sm font-bold rounded-xl border transition-all ${slotClass}`}
                                >
                                    {slot.time}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-3">
                            <span className="w-3 h-3 rounded-full bg-[#0ea5e9]"></span> Active / Next
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-3">
                            <span className="w-3 h-3 rounded-full bg-[#f0f9ff] border border-[#bae6fd]"></span> Booked Appointment
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                            <span className="w-3 h-3 rounded-full bg-white border border-gray-200"></span> Available Slot
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorDashboard;
