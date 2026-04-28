import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, User, UserPlus, SearchCheck, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await apiFetch("/api/admin/appointments");
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Fetch appointments error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = 
            (app.patientId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.doctorId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.consultationType || "").toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
        
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-50 text-green-600 border-green-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            case 'upcoming': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-[#028090] animate-spin" />
                <p className="text-gray-500 font-medium">Loading system appointments...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 bg-white min-h-screen">
            {/* Header */}
            <motion.div {...fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-[#01579B] tracking-tight text-left">Appointments</h1>
                    <p className="text-gray-500 mt-1 text-[15px] text-left">Manage and oversee the system-wide appointment operations.</p>
                </div>
                <div className="bg-[#E1F5FE] text-[#0277BD] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {appointments.length} Total Bookings
                </div>
            </motion.div>

            {/* Search & Filters */}
            <motion.div {...fadeUp} className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by patient, doctor or reason..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#028090]/20 focus:border-[#028090] transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    {['All', 'upcoming', 'completed', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap border ${
                                statusFilter === f 
                                ? 'bg-[#028090] text-white border-[#028090] shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Appointments Table */}
            <motion.div {...fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Doctor</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Appointment Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAppointments.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {app.patientId?.name?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{app.patientId?.name || "Deleted User"}</p>
                                                <p className="text-xs text-gray-500">{app.patientId?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                                                {app.doctorId?.name?.charAt(0) || 'D'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{app.doctorId?.name || "Deleted Doctor"}</p>
                                                <p className="text-xs text-gray-500">{app.doctorId?.specialization}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(app.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-[#028090] font-bold flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                {app.appointmentTime}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 italic">
                                                Booked: {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(app.status)}`}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                                        ₹{app.amount || app.doctorId?.consultationFee || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium">
                        No appointments found matching your search.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Appointments;
