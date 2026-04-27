import React, { useState } from 'react';
import { Search, Filter, Eye, X, BrainCircuit, Activity, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, bgColor, colorClass }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${bgColor} ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-[28px] font-black mt-1 text-gray-900">{value}</p>
    </div>
);

const AIMonitoring = () => {
    // Top Stat Cards
    const stats = [
        { title: 'Total AI Queries', value: '45,200', icon: BrainCircuit, bgColor: 'bg-blue-50', colorClass: 'text-blue-600' },
        { title: 'Today’s Queries', value: '320', icon: Activity, bgColor: 'bg-green-50', colorClass: 'text-green-600' },
        { title: 'Weekly Queries', value: '2,100', icon: CalendarIcon, bgColor: 'bg-purple-50', colorClass: 'text-purple-600' },
    ];

    // Static Logs Data
    const initialLogs = [
        {
            id: 1,
            name: "John Doe",
            symptoms: "fever, headache",
            response: "Based on your symptoms, you seem to be experiencing signs of a general illness like fever or flu. I strongly recommend visiting a General Physician for proper evaluation. Please do not self-medicate.",
            date: "Feb 25, 2026"
        },
        {
            id: 2,
            name: "Emma Wilson",
            symptoms: "chest pain",
            response: "⚠️ Your symptoms may indicate a cardiac concern. Chest pain and related symptoms should be taken seriously. Please consult a Cardiologist immediately. If symptoms are severe, visit an emergency room.",
            date: "Feb 24, 2026"
        },
        {
            id: 3,
            name: "David Chen",
            symptoms: "knee pain, swelling",
            response: "Your symptoms indicate a possible musculoskeletal issue. An Orthopedic Surgeon specializes in bones, joints, muscles, and related injuries. I recommend scheduling a consultation.",
            date: "Feb 24, 2026"
        },
        {
            id: 4,
            name: "Sarah Jenkins",
            symptoms: "skin rash, itch",
            response: "Your symptoms point to a skin-related condition. A Dermatologist is the right specialist to diagnose and treat concerns like rashes, acne, eczema, or other skin disorders.",
            date: "Feb 20, 2026"
        }
    ];

    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLog, setSelectedLog] = useState(null);

    // Filtering
    const filteredLogs = initialLogs.filter(log => {
        const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              log.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesFilter = true;
        if (filter === 'Recent') {
            // Mock "Recent" logic: let's pretend anything Feb 24 or later is recent
            matchesFilter = log.date.includes("Feb 25") || log.date.includes("Feb 24");
        }
        
        return matchesSearch && matchesFilter;
    });

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-white min-h-screen relative">
            {/* Header */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">AI Symptom Checker Monitoring</h1>
                    <p className="text-gray-500 mt-1 text-[15px]">Track AI usage and analyze symptom queries</p>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                        <StatCard {...s} />
                    </motion.div>
                ))}
            </div>

            {/* Search + Filter Section */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <div className="relative w-full sm:flex-1 max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search symptoms or users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#01579B]/20 focus:border-[#01579B] transition-all shadow-sm"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    {['All', 'Recent'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm flex items-center gap-2 ${
                                filter === f 
                                    ? 'bg-[#01579B] border-[#01579B] text-white hover:bg-[#004C8C]' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {f === 'All' && <Filter className="w-4 h-4" />}
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Table Container */}
            <motion.div {...fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Symptoms</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">AI Response (Preview)</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="bg-white hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#E1F5FE] text-[#01579B] flex items-center justify-center font-bold text-sm shrink-0">
                                                {log.name.charAt(0)}
                                            </div>
                                            <p className="font-bold text-gray-900 text-[14px]">{log.name}</p>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 align-middle">
                                        <p className="font-semibold text-gray-700 text-[14px]">{log.symptoms}</p>
                                    </td>

                                    <td className="py-4 px-6 align-middle">
                                        <p className="text-gray-500 text-sm line-clamp-1 italic truncate">"{log.response}"</p>
                                    </td>

                                    <td className="py-4 px-6 align-middle">
                                        <span className="text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">
                                            {log.date}
                                        </span>
                                    </td>

                                    <td className="py-4 px-6 align-middle text-right">
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#01579B] bg-[#E1F5FE] hover:bg-[#0277BD] hover:text-white rounded-lg transition-colors focus:outline-none"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Full
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium bg-gray-50/50">
                        No AI logs found.
                    </div>
                )}
            </motion.div>

            {/* View Full Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-[#01579B]" /> 
                                    AI Response Details
                                </h2>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">User</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#E1F5FE] text-[#01579B] flex items-center justify-center font-bold text-xs">
                                        {selectedLog.name.charAt(0)}
                                    </div>
                                    <p className="font-semibold text-gray-800">{selectedLog.name}</p>
                                    <span className="text-xs text-gray-400 ml-auto">{selectedLog.date}</span>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Symptoms Queried</p>
                                <p className="font-semibold text-gray-800">{selectedLog.symptoms}</p>
                            </div>

                            <div className="bg-[#F0F9FF] p-4 rounded-xl border border-[#B3E5FC]">
                                <p className="text-xs font-bold text-[#0277BD] uppercase tracking-wider mb-2">AI Response</p>
                                <p className="text-gray-700 leading-relaxed italic">{selectedLog.response}</p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button 
                                onClick={() => setSelectedLog(null)}
                                className="px-5 py-2.5 rounded-xl font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AIMonitoring;
