import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { CheckCircle, XCircle, Clock, Search, Filter, Loader2, AlertCircle } from 'lucide-react';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("Fetching appointments...");
            const res = await apiFetch("/api/appointments");
            
            if (res.status === 401) {
                throw new Error("Token expired — Please login again.");
            }
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch appointments");
            }

            
            const data = await res.json();
            console.log("Appointments fetched successfully:", data.length);
            
            if (!Array.isArray(data)) {
                throw new Error("Invalid response format: expected an array");
            }
            
            setAppointments(data);
            setFilteredAppointments(data.filter(appt => 
                appt?.status?.toLowerCase() === 'upcoming'
            ));
        } catch (err) {
            console.error("Appointments fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!Array.isArray(appointments)) {
            setFilteredAppointments([]);
            return;
        }

        let filtered = appointments;
        
        if (filter !== 'all') {
            filtered = appointments.filter(appt => 
                appt?.status?.toLowerCase() === filter.toLowerCase()
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(appt => 
                appt?.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt?._id?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredAppointments(filtered);
    }, [filter, searchTerm, appointments]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await apiFetch(`/api/appointments/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchAppointments(); // Refresh list
            } else {
                const errorData = await res.json().catch(() => ({}));
                alert(errorData.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("An error occurred while updating status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'upcoming': return 'bg-sky-50 text-sky-700 border-sky-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getInitials = (name) => {
        if (!name) return "??";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Loading appointments...</p>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto py-24 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Appointments</h3>
            <p className="text-gray-500 mb-8">{error}</p>
            <button 
                onClick={fetchAppointments}
                className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl font-bold hover:bg-[#0284c7] transition-all"
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out_both] pb-12 w-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Appointments</h2>
                    <p className="text-gray-500 mt-1">Manage and track your patient consultations.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-gray-100/50 p-1 rounded-xl w-fit">
                {['upcoming', 'completed', 'cancelled', 'all'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                            filter === t 
                            ? 'bg-white text-[#0ea5e9] shadow-sm' 
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="grid gap-4 w-full">
                {Array.isArray(filteredAppointments) && filteredAppointments.length > 0 ? filteredAppointments.map((appt) => (
                    <div key={appt?._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Patient Info */}
                            <div className="flex items-center gap-4 min-w-[240px]">
                                <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-100">
                                    {getInitials(appt?.patientId?.name)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-[#0ea5e9] transition-colors">{appt?.patientId?.name || "Unknown Patient"}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{appt?.patientId?.email || "No email"}</p>
                                    <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(appt?.status)}`}>
                                        {appt?.status === 'upcoming' && <Clock className="w-3 h-3" />}
                                        {appt?.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                        {appt?.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                                        {appt?.status || 'Unknown'}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:block w-px h-12 bg-gray-100" />

                            {/* Appointment Details */}
                            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                        <Clock className="w-4 h-4 text-sky-500" />
                                        {appt?.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A'} at {appt?.appointmentTime || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Type</p>
                                    <p className="text-sm font-semibold text-gray-800">{appt?.consultationType || "General Checkup"}</p>
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                    <p className="text-sm font-semibold text-gray-800 uppercase italic text-sky-700">{appt?.paymentMethod || "Cash"} - {appt?.paymentStatus || "Pending"}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            {appt?.status === 'upcoming' && (
                                <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50 lg:ml-auto">
                                    <button 
                                        onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                                        className="flex-1 lg:flex-none px-4 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(appt._id, 'completed')}
                                        className="flex-1 lg:flex-none px-5 py-2 text-sm font-bold bg-[#0ea5e9] text-white rounded-xl shadow-lg shadow-sky-100 hover:bg-[#0284c7] hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    >
                                        Mark Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="bg-white rounded-2xl py-20 px-6 shadow-sm border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center text-4xl mb-6">🗓️</div>
                        <h3 className="text-xl font-bold text-gray-900">No Appointments Found</h3>
                        <p className="text-gray-500 mt-2 max-w-xs font-medium">There are no {filter === 'all' ? '' : filter} appointments that match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;
