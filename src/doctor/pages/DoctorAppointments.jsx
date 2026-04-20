import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const DoctorAppointments = () => {
    const { appointments, cancelAppointment, addReview } = useData();
    const [filter, setFilter] = useState('All');

    const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];

    const filteredAppointments = appointments.filter(appt => {
        if (filter === 'All') return true;
        return appt.status.toLowerCase() === filter.toLowerCase();
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-[#3b82f6]/10 text-[#3b82f6]';
            case 'completed': return 'bg-[#10b981]/10 text-[#10b981]';
            case 'cancelled': return 'bg-[#ef4444]/10 text-[#ef4444]';
            default: return 'bg-gray-100 text-[#6b7280]';
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out_both] pb-12 pt-6">
            {/* 1. PAGE HEADER */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#1f2937]">Appointments</h2>
                <p className="text-[#6b7280] font-medium mt-2">Manage your scheduled appointments.</p>
            </div>

            {/* 2. FILTER TABS */}
            <div className="flex flex-wrap gap-3 mb-8">
                {filters.map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                            filter === f 
                                ? 'bg-gradient-to-r from-[#1e6fa3] to-[#2d8ac7] text-[#ffffff] shadow-md' 
                                : 'bg-[#eaf4fb] text-[#6b7280] hover:bg-gradient-to-r hover:from-[#1e6fa3] hover:to-[#2d8ac7] hover:text-[#ffffff]'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* 3. APPOINTMENT CARDS (MAIN UI) */}
            <div className="flex flex-col gap-4">
                {filteredAppointments.length > 0 ? filteredAppointments.map((appt) => (
                    /* 4. CARD DESIGN */
                    <div 
                        key={appt.id} 
                        className="bg-[#ffffff] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-[#eaf4fb] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                    >
                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-5 min-w-0">
                            <div className="w-12 h-12 bg-[#eaf4fb] text-[#2d8ac7] flex items-center justify-center rounded-full text-lg font-bold shrink-0">
                                {appt.initials}
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-[#1f2937] truncate">{appt.name}</h3>
                                <p className="text-sm text-[#6b7280] mt-0.5">{appt.specialization}</p>
                                <p className="text-sm font-medium text-[#6b7280] mt-1.5">
                                    {appt.date} · {appt.time}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 shrink-0">
                            {/* Status Badge */}
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize tracking-wide ${getStatusStyles(appt.status)}`}>
                                {appt.status}
                            </span>
                            
                            {/* Cancel Button - Upcoming */}
                            {appt.status === 'upcoming' && (
                                <button 
                                    onClick={() => cancelAppointment(appt.id)}
                                    className="px-5 py-2 bg-[#ffffff] text-[#ef4444] hover:bg-[#ef4444]/10 border border-[#ef4444]/30 hover:border-[#ef4444] text-sm font-medium rounded-full transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="bg-[#ffffff] rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-[#eaf4fb] text-[#6b7280] rounded-full flex items-center justify-center text-3xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-[#1f2937]">No appointments found</h3>
                        <p className="text-[#6b7280] mt-1">There are no {filter.toLowerCase()} appointments to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;
