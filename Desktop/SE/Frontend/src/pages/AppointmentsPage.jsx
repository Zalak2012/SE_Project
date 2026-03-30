import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppointmentsPage = () => {
    // Initial static sample data
    const [appointments, setAppointments] = useState([
        { 
            id: 1, 
            doctorName: "Dr. Sarah Chen", 
            specialization: "Cardiologist", 
            date: "Feb 26, 2026", 
            time: "3:00 PM", 
            status: "Upcoming" 
        },
        { 
            id: 2, 
            doctorName: "Dr. Emily Park", 
            specialization: "Pediatrician", 
            date: "Feb 20, 2026", 
            time: "10:00 AM", 
            status: "Completed" 
        },
        { 
            id: 3, 
            doctorName: "Dr. James Wilson", 
            specialization: "Dermatologist", 
            date: "Feb 15, 2026", 
            time: "2:00 PM", 
            status: "Completed" 
        }
    ]);

    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];

    const handleCancel = (id) => {
        setAppointments(prev => prev.map(app => 
            app.id === id ? { ...app, status: 'Cancelled' } : app
        ));
    };

    const filteredAppointments = appointments.filter(app => 
        activeFilter === 'All' || app.status === activeFilter
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Upcoming':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Completed':
                return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled':
                return 'bg-red-50 text-red-600 border-red-100';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col w-full">
            <Navbar />

            <main className="flex-grow flex flex-col items-center p-4 py-12 w-full max-w-4xl mx-auto space-y-8">
                
                {/* ---------- PAGE HEADER ---------- */}
                <header className="w-full text-center md:text-left space-y-2 animate-[fadeIn_0.4s_ease-out_both]">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Appointments</h1>
                    <p className="text-gray-500 font-medium">Manage your scheduled appointments.</p>
                </header>

                {/* ---------- FILTER TABS ---------- */}
                <nav className="w-full flex flex-wrap justify-center md:justify-start gap-3 animate-[fadeIn_0.5s_ease-out_both]">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm border ${
                                activeFilter === filter
                                    ? 'bg-[#028090] text-white border-[#028090] shadow-md scale-105'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#028090] hover:text-[#028090]'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </nav>

                {/* ---------- APPOINTMENT LIST ---------- */}
                <section className="w-full space-y-4 animate-[slideUp_0.5s_ease-out_both]">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(app => (
                            <div 
                                key={app.id} 
                                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Left Side: Doctor Info */}
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0277BD] flex items-center justify-center font-bold text-lg border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                                        {getInitials(app.doctorName)}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#01579B] transition-colors">{app.doctorName}</h4>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
                                            <span className="text-[#028090]">{app.specialization}</span>
                                            <span className="text-gray-300 hidden md:block">•</span>
                                            <span className="text-gray-500">{app.date} • {app.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Status & Actions */}
                                <div className="flex items-center md:justify-end gap-4 min-w-[140px]">
                                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                    
                                    {app.status === 'Upcoming' && (
                                        <button 
                                            onClick={() => handleCancel(app.id)}
                                            className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            <span className="text-4xl mb-4 block">📅</span>
                            <p className="text-gray-400 font-medium italic">No {activeFilter.toLowerCase()} appointments found.</p>
                        </div>
                    )}
                </section>

            </main>

            <Footer />
        </div>
    );
};

export default AppointmentsPage;
