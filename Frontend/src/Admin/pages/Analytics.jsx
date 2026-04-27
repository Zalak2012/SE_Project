import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Calendar, TrendingUp, Loader2, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { apiFetch } from "../../utils/api";

const Analytics = () => {
    const navigate = useNavigate();

    // ✅ Dynamic State (Phase 17)
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState({ months: [], monthlyUsers: [] });
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            console.log("⏳ Fetching live analytics from MongoDB...");
            const results = await Promise.allSettled([
                apiFetch("/api/admin/dashboard-stats"),
                apiFetch("/api/admin/analytics")
            ]);

            if (results[0].status === "fulfilled" && results[0].value.ok) {
                const data = await results[0].value.json();
                setStats(data);
            }

            if (results[1].status === "fulfilled" && results[1].value.ok) {
                const data = await results[1].value.json();
                setAnalytics(data);
            }

            console.log("✅ Analytics Synced");
        } catch (err) {
            console.error("❌ Analytics Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const growthData = analytics.months.map((month, i) => ({
        month,
        users: analytics.monthlyUsers[i] || 0
    }));

    // Mock weekly data for now as backend doesn't support it yet, 
    // but users request says "Analytics Connect to GET /api/admin/analytics"
    const weeklyData = [
        { day: 'Mon', appointments: 45 },
        { day: 'Tue', appointments: 52 },
        { day: 'Wed', appointments: 49 },
        { day: 'Thu', appointments: 63 },
        { day: 'Fri', appointments: 58 },
        { day: 'Sat', appointments: 30 },
        { day: 'Sun', appointments: 15 },
    ];

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium tracking-tight">Calculating platform insights...</p>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, colorClass: 'text-[#0277BD]', bgClass: 'bg-[#E1F5FE]' },
        { title: 'Active Doctors', value: stats?.activeDoctors || 0, icon: UserCheck, colorClass: 'text-[#00BFA5]', bgClass: 'bg-[#E0F2F1]' },
        { title: 'Appointments', value: stats?.appointments || 0, icon: Calendar, colorClass: 'text-[#0277BD]', bgClass: 'bg-[#E1F5FE]' },
        { title: 'Pending Req', value: stats?.pendingDoctors || 0, icon: BarChart3, colorClass: 'text-[#E37400]', bgClass: 'bg-[#FFF7ED]' }
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
            
            {/* Header */}
            <motion.div {...fadeUp}>
                <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Analytics</h1>
                <p className="text-[#4B5563] mt-1 text-[15px]">Database-driven performance insights</p>
            </motion.div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, idx) => (
                    <motion.div
                        key={idx}
                        {...fadeUp}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-[140px]"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-[#6B7280] font-medium text-sm">{s.title}</h3>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.bgClass} ${s.colorClass}`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <h2 className="text-[32px] font-bold text-[#1F2937] tracking-tight leading-none">{s.value.toLocaleString()}</h2>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Left Chart: Growth Overview */}
                <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-[#111827] text-lg">Growth Overview</h3>
                            <p className="text-xs text-gray-400">Monthly user registrations</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full text-xs font-bold border border-[#D1FAE5]">
                            <TrendingUp className="w-4 h-4" />
                            <span>Live</span>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0277BD" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#0277BD" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#0277BD" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorUsers)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Right Chart: Weekly Appointments */}
                <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="font-bold text-[#111827] text-lg">Weekly Engagement</h3>
                        <p className="text-xs text-gray-400">Sample weekly appointment trends</p>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={{stroke: '#9CA3AF'}} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#F3F4F6'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="appointments" 
                                    fill="#00BFA5" 
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Analytics;
