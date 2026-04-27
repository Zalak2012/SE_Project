import React from 'react';
import { Users, UserCheck, Calendar, DollarSign, TrendingUp } from 'lucide-react';
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

const Analytics = () => {
    // Top Stats Mock Data
    const stats = [
        { title: 'Total Users', value: '12,847', icon: Users, colorClass: 'text-[#0277BD]', bgClass: 'bg-[#E1F5FE]' },
        { title: 'Active Doctors', value: '156', icon: UserCheck, colorClass: 'text-[#00BFA5]', bgClass: 'bg-[#E0F2F1]' },
        { title: 'Appointments', value: '3,421', icon: Calendar, colorClass: 'text-[#0277BD]', bgClass: 'bg-[#E1F5FE]' },
        { title: 'Revenue', value: '$285K', icon: DollarSign, colorClass: 'text-[#059669]', bgClass: 'bg-[#D1FAE5]' }
    ];

    // Left Chart (Area)
    const growthData = [
        { month: "Jan", metric1: 12000, metric2: 1000 },
        { month: "Feb", metric1: 18000, metric2: 1200 },
        { month: "Mar", metric1: 24000, metric2: 1800 },
        { month: "Apr", metric1: 32000, metric2: 2400 },
        { month: "May", metric1: 38000, metric2: 3200 },
        { month: "Jun", metric1: 45000, metric2: 4000 },
    ];

    // Right Chart (Bar)
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

    return (
        <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
            
            {/* Header */}
            <motion.div {...fadeUp}>
                <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Analytics</h1>
                <p className="text-[#4B5563] mt-1 text-[15px]">Platform performance and insights</p>
            </motion.div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, idx) => (
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
                        <h2 className="text-[32px] font-bold text-[#1F2937] tracking-tight leading-none">{s.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Left Chart: Growth Overview */}
                <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-[#111827] text-lg">Growth Overview</h3>
                        <div className="flex items-center gap-1 text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full text-sm font-bold border border-[#D1FAE5]">
                            <TrendingUp className="w-4 h-4" />
                            <span>+28%</span>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMetric2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
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
                                    dataKey="metric1" 
                                    stroke="#10B981" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorMetric1)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="metric2" 
                                    stroke="#2563EB" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorMetric2)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Right Chart: Weekly Appointments */}
                <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h3 className="font-bold text-[#111827] text-lg">Weekly Appointments</h3>
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
                                    fill="#0277BD" 
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
