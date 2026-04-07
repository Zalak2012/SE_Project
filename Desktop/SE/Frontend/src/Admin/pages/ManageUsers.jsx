import React, { useState } from 'react';
import { Search, MoreHorizontal, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ManageUsers = () => {
    // Static Sample Data mimicking the image exactly
    const initialUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Patient", joined: "Jan 15, 2026", status: "active" },
        { id: 2, name: "Emma Wilson", email: "emma@example.com", role: "Patient", joined: "Feb 10, 2026", status: "active" },
        { id: 3, name: "Dr. Sarah Chen", email: "sarah@example.com", role: "Doctor", joined: "Dec 05, 2025", status: "active" },
        { id: 4, name: "Dr. Omar Hassan", email: "omar@example.com", role: "Doctor", joined: "Feb 23, 2026", status: "pending" },
        { id: 5, name: "Maria Garcia", email: "maria@example.com", role: "Patient", joined: "Mar 01, 2026", status: "active" },
        { id: 6, name: "Dr. Lisa Wang", email: "lisa@example.com", role: "Doctor", joined: "Feb 24, 2026", status: "pending" },
        { id: 7, name: "Robert Taylor", email: "robert@example.com", role: "Patient", joined: "Jan 28, 2026", status: "active" }
    ];

    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filtering
    const filteredUsers = initialUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || user.status === filter.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-white min-h-screen">
            {/* Header */}
            <motion.div {...fadeUp}>
                <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight">Manage Users</h1>
                <p className="text-gray-500 mt-1 text-[15px]">View and manage all platform users</p>
            </motion.div>

            {/* Search + Filter Section */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Search */}
                <div className="relative w-full sm:flex-1 max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0277BD]/20 focus:border-[#0277BD] transition-all shadow-sm"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setFilter('All')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                            filter === 'All'
                                ? 'bg-[#0277BD] border-[#0277BD] text-white hover:bg-[#01579B]' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        All
                    </button>
                    {['Active', 'Pending'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                                filter === f 
                                    ? 'bg-[#0277BD] border-[#0277BD] text-white hover:bg-[#01579B]' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* User Table Container */}
            <motion.div {...fadeUp} className="bg-white rounded-2xl shadow-sm border border-[#E1F5FE] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#F5FAFF]">
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">User</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">Role</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">Joined</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#4B6884] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-[#FAFAFA] transition-colors group">
                                    
                                    {/* User Column */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 shrink-0 rounded-full bg-[#E1F5FE] text-[#0277BD] flex items-center justify-center font-bold text-lg">
                                                {user.name.replace('Dr. ', '').charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1F2937] text-[15px] group-hover:text-[#0277BD] transition-colors truncate">{user.name}</p>
                                                <p className="text-[13px] text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                                                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role Column */}
                                    <td className="py-4 px-6 align-middle">
                                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${
                                            user.role === 'Doctor' 
                                                ? 'bg-[#00BFA5] text-white border-[#00BFA5] shadow-sm' 
                                                : 'bg-[#F9FAFB] text-gray-700 border-gray-200'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>

                                    {/* Joined Column */}
                                    <td className="py-4 px-6 align-middle">
                                        <div className="flex items-center gap-2 text-[14px] text-[#4B5563] font-medium">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {user.joined}
                                        </div>
                                    </td>

                                    {/* Status Column */}
                                    <td className="py-4 px-6 align-middle">
                                        <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${
                                            user.status === 'active' 
                                                ? 'bg-[#E6F4EA] text-[#1E8E3E] border-[#CEEAD6]' 
                                                : 'bg-[#FEF7E0] text-[#E37400] border-[#FAD28B]'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>

                                    {/* Actions Column */}
                                    <td className="py-4 px-6 align-middle text-right">
                                        <button className="p-2 text-gray-600 hover:text-[#0277BD] hover:bg-blue-50 rounded-lg transition-colors focus:outline-none">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium bg-gray-50/50">
                        No users found matching your specifications.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ManageUsers;
