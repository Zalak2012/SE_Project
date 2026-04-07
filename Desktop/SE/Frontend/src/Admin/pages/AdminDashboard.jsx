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

import { Users, UserCheck, Calendar, IndianRupee, Brain, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const Button = ({ children, variant, size, className = "", onClick }) => {
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
        >
            {children}
        </button>
    );
};

const useToast = () => ({
    toast: ({ title }) => alert(title) // simple mock for toast 
});

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
});

const chartData = [
    { month: "Jan", users: 800, revenue: 12000 },
    { month: "Feb", users: 1200, revenue: 18000 },
    { month: "Mar", users: 1800, revenue: 24000 },
    { month: "Apr", users: 2400, revenue: 32000 },
    { month: "May", users: 3200, revenue: 38000 },
    { month: "Jun", users: 4100, revenue: 45000 },
];

const recentActivity = [
    { action: "Dr. Lisa Wang submitted registration", time: "2 hours ago" },
    { action: "Payment received from John Doe — ₹12,000", time: "3 hours ago" },
    { action: "New patient registered: Emma Wilson", time: "5 hours ago" },
    { action: "Dr. Omar Hassan approved by admin", time: "1 day ago" },
    { action: "Lab test order #1234 completed", time: "1 day ago" },
];

const pendingDoctors = [
    { id: "1", name: "Dr. Lisa Wang", specialization: "Oncologist", submitted: "Feb 24, 2026" },
    { id: "2", name: "Dr. Omar Hassan", specialization: "ENT Specialist", submitted: "Feb 23, 2026" },
    { id: "3", name: "Dr. Nina Patel", specialization: "Psychiatrist", submitted: "Feb 22, 2026" },
];

const recentlyApprovedDoctors = [
    {
        name: "Dr. Sarah Chen",
        specialization: "Cardiologist",
        approvedDate: "Feb 20, 2026"
    },
    {
        name: "Dr. James Brown",
        specialization: "Dermatologist",
        approvedDate: "Feb 18, 2026"
    },
    {
        name: "Dr. Emily Davis",
        specialization: "Pediatrician",
        approvedDate: "Feb 17, 2026"
    }
];

export default function AdminDashboard() {
    const { toast } = useToast();

    const stats = [
        { label: "Total Users", value: "12,450", icon: Users },
        { label: "Active Doctors", value: "432", icon: UserCheck },
        { label: "Appointments", value: "8,901", icon: Calendar },
        { label: "Revenue", value: "₹2.85L", icon: IndianRupee },
        { label: "AI Queries", value: "8,934", icon: Brain },
        { label: "Pending Requests", value: "3", icon: Clock },
    ];

    return (
        <div className="space-y-8 p-6">

            {/* HERO */}
            <motion.div {...fadeUp(0)} className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white shadow-lg relative">
                <h1 className="text-3xl font-bold">System Overview & Control 🛡️</h1>
                <p className="mt-2 opacity-80">
                    Monitor platform health, manage users, and track performance.
                </p>

                <div className="flex gap-3 mt-6">
                    <Button className="bg-white text-blue-700 font-semibold">
                        Manage Users
                    </Button>
                    <Button variant="outline" className="border-white text-white">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Reports
                    </Button>
                </div>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        {...fadeUp(0.1 + i * 0.05)}
                        className="bg-white rounded-xl shadow p-5"
                    >
                        <div className="flex justify-between mb-2">
                            <p className="text-sm text-gray-500">{s.label}</p>
                            <s.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold">{s.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* CHART + ACTIVITY */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* CHART */}
                <motion.div {...fadeUp(0.3)} className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-semibold">Growth Overview</h3>
                        <span className="text-green-500 text-sm flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +28%
                        </span>
                    </div>

                    <div className="h-[250px]">
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />

                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#2563eb"
                                    fill="#93c5fd"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    fill="#6ee7b7"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* ACTIVITY */}
                <motion.div {...fadeUp(0.35)} className="bg-white p-5 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>

                    <div className="space-y-4">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-sm">{item.action}</p>
                                    <p className="text-xs text-gray-400">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* PENDING DOCTORS */}
            <motion.div {...fadeUp(0.4)} className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold mb-4">Pending Doctor Registrations</h3>

                {pendingDoctors.map((d) => (
                    <div key={d.id} className="flex items-center justify-between mb-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                {d.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">{d.name}</p>
                                <p className="text-sm text-gray-500">
                                    {d.specialization} • {d.submitted}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => toast({ title: "Approved" })}>
                                Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toast({ title: "Rejected" })}>
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* RECENTLY APPROVED DOCTORS */}
            <motion.div {...fadeUp(0.45)} className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold mb-4">Recently Approved Doctors</h3>

                {recentlyApprovedDoctors.map((d, index) => (
                    <div key={index} className="flex items-center justify-between mb-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold">
                                {d.name.replace('Dr. ', '').charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">{d.name}</p>
                                <p className="text-sm text-gray-500">
                                    {d.specialization}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                                Approved {d.approvedDate}
                            </span>
                        </div>
                    </div>
                ))}
            </motion.div>

        </div>
    );
}