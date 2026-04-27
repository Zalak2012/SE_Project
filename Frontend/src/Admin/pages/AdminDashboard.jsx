// import React from 'react';
// import { Link } from 'react-router-dom';

// const StatCard = ({ title, value, icon, trend, bgColor, colorClass }) => (
//     <div className="bg-white rounded-[16px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
//         <div className="flex justify-between items-start mb-4">
//             <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl ${bgColor}`}>
//                 {icon}
//             </div>
//             <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-[#22C55E]' : 'bg-red-50 text-[#EF4444]'}`}>
//                 {trend > 0 ? '+' : ''}{trend}%
//             </span>
//         </div>
//         <h3 className="text-[#6B7280] text-sm font-medium">{title}</h3>
//         <p className="text-[32px] font-black mt-1 text-[#1F2937]">{value}</p>
//     </div>
// );

// const AdminDashboard = () => {
//     // Mock Data
//     const stats = [
//         { title: 'Total Users', value: '12,450', icon: '👥', bgColor: 'bg-[#E6F2FA]', colorClass: 'text-blue-700' },
//         { title: 'Active Doctors', value: '432', icon: '👨‍⚕️', bgColor: 'bg-[#E6F2FA]', colorClass: 'text-teal-700' },
//         { title: 'Appointments', value: '8,901', icon: '📅', bgColor: 'bg-[#E6F2FA]', colorClass: 'text-purple-700' },
//         { title: 'Revenue', value: '₹4.2L', icon: '💳', bgColor: 'bg-[#E6F2FA]', colorClass: 'text-emerald-700' },
//         { title: 'AI Queries', value: '45.2K', icon: '🤖', bgColor: 'bg-[#E6F2FA]', colorClass: 'text-rose-700' },
//         { title: 'Pending Requests', value: '15', icon: '⏳', bgColor: 'bg-[#E6F2FA]', colorClass: 'text-amber-700' },
//     ];

//     const pendingApprovals = [
//         { id: 1, name: 'Dr. Ramesh Kumar', spec: 'Cardiologist', date: 'Oct 24, 2026', exp: '8 Yrs' },
//         { id: 2, name: 'Dr. Anita Desai', spec: 'Neurologist', date: 'Oct 23, 2026', exp: '12 Yrs' },
//         { id: 3, name: 'Dr. Vikas Gupta', spec: 'Orthopedics', date: 'Oct 22, 2026', exp: '5 Yrs' },
//     ];

//     const recentActivity = [
//         { icon: '👨‍⚕️', title: 'New Doctor Registered', desc: 'Dr. Anita Desai applied for verification.', time: '2 hrs ago' },
//         { icon: '💳', title: 'Payment Successful', desc: 'Received ₹450 booking fee.', time: '3 hrs ago' },
//         { icon: '👥', title: 'New User Joined', desc: 'Priya Sharma created an account.', time: '5 hrs ago' },
//         { icon: '✅', title: 'Doctor Approved', desc: 'Dr. John Doe was verified by Admin.', time: '1 day ago' },
//     ];

//     return (
//         <div className="space-y-[24px] pb-12 animate-[fadeIn_0.4s_ease-out]">

//             {/* HERO SECTION */}
//             <div className="bg-gradient-to-r from-[#1E6FAF] to-[#2F80C1] rounded-[24px] p-8 text-white shadow-[0_8px_30px_rgba(30,111,175,0.3)] relative overflow-hidden transform transition-all duration-300 hover:shadow-[0_12px_40px_rgba(30,111,175,0.4)] hover:-translate-y-1">
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>

//                 <h1 className="text-3xl font-black mb-2 relative z-10">System Overview & Control 🛡️</h1>
//                 <p className="text-white/80 text-lg max-w-2xl relative z-10 mb-8">
//                     Monitor platform health, manage users, track performance, and handle doctor approvals.
//                 </p>

//                 <div className="flex gap-4 relative z-10">
//                     <Link to="/admin/users" className="bg-white text-[#1E6FAF] px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-[#F5F7FA] hover:scale-105 transition-all duration-300">
//                         Manage Users
//                     </Link>
//                     <button className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300">
//                         View Reports
//                     </button>
//                 </div>
//             </div>

//             {/* STATS GRID */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
//                 {stats.map((s, i) => (
//                     <StatCard key={i} {...s} />
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-[24px]">

//                 {/* LEFT COL: CHART & PENDING DOCS */}
//                 <div className="xl:col-span-2 space-y-[24px]">

//                     {/* GROWTH CHART */}
//                     <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-0 relative overflow-hidden">
//                         <div className="flex items-center justify-between mb-6">
//                             <div>
//                                 <h2 className="text-xl font-bold text-[#1F2937]">Growth Overview</h2>
//                                 <p className="text-sm text-[#6B7280] font-medium mt-1">Platform metrics over last 30 days</p>
//                             </div>
//                             <span className="px-3 py-1 bg-[#F5F7FA] text-[#1E6FAF] font-bold text-sm rounded-lg border border-gray-100">
//                                 +28% this month
//                             </span>
//                         </div>
//                         {/* Mock Chart Area */}
//                         <div className="h-64 mt-4 w-full flex items-end justify-between gap-2 px-1 relative">
//                             {/* Grid Lines */}
//                             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
//                                 <div className="border-t border-gray-100 w-full h-0"></div>
//                                 <div className="border-t border-gray-100 w-full h-0"></div>
//                                 <div className="border-t border-gray-100 w-full h-0"></div>
//                                 <div className="border-t border-gray-100 w-full h-0"></div>
//                             </div>
//                             {/* Bars */}
//                             {[40, 55, 45, 70, 65, 85, 80, 100, 95].map((h, i) => (
//                                 <div key={i} className="w-full bg-[#F5F7FA] rounded-t-lg relative group h-full flex items-end">
//                                     <div
//                                         className="w-full bg-gradient-to-t from-[#1E6FAF] to-[#2F80C1] rounded-t-lg transition-all duration-1000 origin-bottom hover:opacity-80"
//                                         style={{ height: `${h}%` }}
//                                     ></div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* PENDING APPROVALS */}
//                     <div className="bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border-0">
//                         <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white">
//                             <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
//                                 <span className="p-1.5 bg-amber-50 text-amber-500 rounded-lg text-sm">⏳</span>
//                                 Pending Doctor Approvals
//                             </h2>
//                             <Link to="/admin/approvals" className="text-sm font-bold text-[#1E6FAF] hover:underline">View All</Link>
//                         </div>
//                         <div className="p-6 space-y-[16px]">
//                             {pendingApprovals.map(doc => (
//                                 <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-[16px] bg-[#E6F2FA] rounded-xl hover:-translate-y-1 transition-transform duration-300">
//                                     <div className="flex items-center gap-4 mb-4 sm:mb-0">
//                                         <div className="w-12 h-12 bg-white text-[#1E6FAF] rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
//                                             {doc.name.replace('Dr. ', '').charAt(0)}
//                                         </div>
//                                         <div>
//                                             <h4 className="font-bold text-[#1F2937] text-lg">{doc.name}</h4>
//                                             <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-0.5">
//                                                 <span className="font-bold text-[#1E6FAF]">{doc.spec}</span>
//                                                 <span className="text-gray-300">•</span>
//                                                 <span>{doc.exp}</span>
//                                                 <span className="text-gray-300">•</span>
//                                                 <span>{doc.date}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-3">
//                                         <button className="flex-1 sm:flex-none px-5 py-2.5 bg-red-50 hover:bg-red-100 text-[#EF4444] font-bold text-sm rounded-lg transition-colors">
//                                             Reject
//                                         </button>
//                                         <button className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1E6FAF] hover:bg-[#155A92] text-white font-bold text-sm rounded-lg shadow-sm transition-colors">
//                                             Approve
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT COL: RECENT ACTIVITY */}
//                 <div className="xl:col-span-1">
//                     <div className="bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-0 h-full flex flex-col">
//                         <div className="px-6 py-5 border-b border-gray-50">
//                             <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
//                                 <span className="p-1.5 bg-[#E6F2FA] text-[#1E6FAF] rounded-lg text-sm">⚡</span>
//                                 Recent Activity
//                             </h2>
//                         </div>
//                         <div className="p-6 flex-1 overflow-y-auto w-full">
//                             <div className="relative">
//                                 {/* Timeline line */}
//                                 <div className="absolute top-4 bottom-0 left-5 w-px bg-gray-100"></div>

//                                 <div className="space-y-[24px]">
//                                     {recentActivity.map((act, i) => (
//                                         <div key={i} className="flex gap-4 relative z-10 group cursor-default">
//                                             <div className="w-10 h-10 rounded-full bg-white border-[3px] border-[#F5F7FA] group-hover:border-[#E6F2FA] transition-colors flex items-center justify-center shadow-sm shrink-0">
//                                                 <span className="text-sm">{act.icon}</span>
//                                             </div>
//                                             <div className="pt-1">
//                                                 <h4 className="font-bold text-[#1F2937] text-sm">{act.title}</h4>
//                                                 <p className="text-sm text-[#6B7280] mt-0.5 leading-snug">{act.desc}</p>
//                                                 <p className="text-[11px] text-[#A1A1AA] font-bold mt-1.5 uppercase tracking-wider">{act.time}</p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <button className="w-full mt-8 py-3 text-sm font-bold text-[#6B7280] hover:text-[#1E6FAF] hover:bg-[#F5F7FA] rounded-xl transition-colors border border-dashed border-gray-200">
//                                 Load More Activity
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Calendar, IndianRupee, Brain, Clock, TrendingUp, BarChart3, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { apiFetch } from "../../utils/api";

// ✅ Helper for relative time (Phase 16)
const formatTime = (date) => {
    if (!date) return "N/A";
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;

    return `${Math.floor(diff / 86400)} days ago`;
};

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

const Button = ({ children, variant, size, className = "", onClick, disabled }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
    };
    return (
        <button
            className={`${base} ${variants[variant || "default"]} ${sizes[size || "default"]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default function AdminDashboard() {
    const navigate = useNavigate();

    // ✅ Dynamic State (Phase 11)
    const [stats, setStats] = useState({});
    const [activities, setActivities] = useState([]);
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [approvedDoctors, setApprovedDoctors] = useState([]);
    const [analytics, setAnalytics] = useState({ months: [], monthlyUsers: [] });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // ✅ Fetch Dashboard Data (Phase 13)
    const fetchDashboardData = async () => {
        try {
            // ✅ Safe Token Check (Phase 12)
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, redirecting to login.");
                navigate("/login");
                return;
            }

            console.log("⏳ Fetching live dashboard data from MongoDB...");

            const results = await Promise.allSettled([
                apiFetch("/api/admin/dashboard-stats"),
                apiFetch("/api/admin/pending-doctors"),
                apiFetch("/api/admin/approved-doctors"),
                apiFetch("/api/admin/activities"),
                apiFetch("/api/admin/analytics")
            ]);

            // ✅ Handling Stats (results[0])
            if (results[0].status === "fulfilled" && results[0].value.ok) {
                const data = await results[0].value.json();
                console.log("✅ Stats Loaded:", data);
                setStats(data);
            }

            // ✅ Handling Pending Doctors (results[1])
            if (results[1].status === "fulfilled" && results[1].value.ok) {
                const data = await results[1].value.json();
                console.log("✅ Pending Doctors Loaded:", data.length);
                setPendingDoctors(data);
            }

            // ✅ Handling Approved Doctors (results[2])
            if (results[2].status === "fulfilled" && results[2].value.ok) {
                const data = await results[2].value.json();
                console.log("✅ Approved Doctors Loaded:", data.length);
                setApprovedDoctors(data);
            }

            // ✅ Handling Activities (results[3])
            if (results[3].status === "fulfilled" && results[3].value.ok) {
                const data = await results[3].value.json();
                console.log("✅ Activities Loaded:", data.length);
                setActivities(data);
            }

            // ✅ Handling Analytics (results[4])
            if (results[4].status === "fulfilled" && results[4].value.ok) {
                const data = await results[4].value.json();
                setAnalytics(data);
            }

            console.log("🚀 Dashboard Fully Synced with MongoDB");

        } catch (err) {
            console.error("❌ Dashboard Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Auto Load (Phase 14)
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            console.log("⏳ Approving doctor id:", id);
            const res = await apiFetch(`/api/admin/approve/${id}`, { method: "PUT" });
            if (res.ok) {
                console.log("✅ Approved successfully, refreshing dashboard...");
                await fetchDashboardData();
            }
        } catch (error) {
            console.error("❌ Approval error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id);
        try {
            console.log("⏳ Rejecting doctor id:", id);
            const res = await apiFetch(`/api/admin/reject/${id}`, { method: "PUT" });
            if (res.ok) {
                console.log("✅ Rejected successfully, refreshing dashboard...");
                await fetchDashboardData();
            }
        } catch (error) {
            console.error("❌ Rejection error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const chartData = analytics.months.map((month, i) => ({
        month,
        users: analytics.monthlyUsers[i] || 0
    }));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Connecting to MongoDB...</p>
            </div>
        );
    }

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers || 0, icon: Users },
        { label: "Active Doctors", value: stats?.activeDoctors || 0, icon: UserCheck },
        { label: "Appointments", value: stats?.appointments || 0, icon: Calendar },
        { label: "Pending Requests", value: stats?.pendingDoctors || 0, icon: Clock },
    ];

    return (
        <div className="space-y-8 p-6 pb-12">
            {/* HERO */}
            <motion.div {...fadeUp(0)} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                <h1 className="text-3xl font-bold relative z-10">CareMatePlus Admin 🛡️</h1>
                <p className="mt-2 opacity-80 relative z-10">
                    Database-driven system monitoring and hospital control.
                </p>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div
                        key={i}
                        {...fadeUp(0.1 + i * 0.05)}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between mb-2">
                            <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                            <s.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{s.value.toLocaleString()}</h2>
                    </motion.div>
                ))}
            </div>

            {/* CHART + ACTIVITY */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* CHART */}
                <motion.div {...fadeUp(0.3)} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-gray-800">Growth Overview</h3>
                            <p className="text-sm text-gray-500">Live MongoDB analytics</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* ACTIVITY (Phase 15) */}
                <motion.div {...fadeUp(0.35)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 mb-6">Recent Activity</h3>

                    <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px]">
                        {activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Clock className="w-10 h-10 text-gray-200 mb-2" />
                                <p className="text-gray-400 text-sm">No recent activity</p>
                            </div>
                        ) : (
                            activities.map((item) => (
                                <div key={item._id} className="flex gap-4 group">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 mt-1.5 bg-blue-500 rounded-full ring-4 ring-blue-50 z-10 relative"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 leading-snug">{item.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatTime(item.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* PENDING DOCTORS (Phase 17 UI in Dashboard) */}
            <motion.div {...fadeUp(0.4)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800">Pending Approvals</h3>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {pendingDoctors.length} Requests
                    </span>
                </div>

                <div className="grid gap-3">
                    {pendingDoctors.length > 0 ? (
                        pendingDoctors.map((d) => (
                            <div key={d._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                                        {d.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{d.name}</p>
                                        <p className="text-sm text-gray-500">{d.specialization || "Physician"} • {new Date(d.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleApprove(d._id)} disabled={actionLoading === d._id}>
                                        {actionLoading === d._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleReject(d._id)} disabled={actionLoading === d._id} className="text-red-600 border-red-100 hover:bg-red-50">
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No pending doctors</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
