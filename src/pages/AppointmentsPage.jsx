import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star } from 'lucide-react';
import { useData } from '../context/DataContext';

const AppointmentsPage = () => {
    // Initial static sample data
    const { appointments, addReview } = useData();

    const [activeFilter, setActiveFilter] = useState('All');
    
    // Feedback Modal State
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState(new Set());

    const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];

    const handleCancel = (id) => {
        // Mock cancel (if patient cancel functionality is enabled later)
    };

    const filteredAppointments = appointments.filter(app => {
        const statusMatch = activeFilter === 'All' || app.status.toLowerCase() === activeFilter.toLowerCase();
        return statusMatch;
    });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (!rating || !review.trim()) {
            alert("Please provide both a rating and a review.");
            return;
        }

        const newFeedback = {
            patientName: "John Doe (Me)", // Mock patient
            doctorName: selectedAppt.name, 
            userName: "John Doe (Me)", // For review card schema
            userType: "Patient",
            rating: rating,
            text: review,
            date: new Date().toLocaleDateString(),
            status: "Pending", // For admin to approve
            avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        };

        addReview(newFeedback);
        
        setSubmittedFeedbacks(prev => new Set(prev).add(selectedAppt.id));
        setSelectedAppt(null);
        setRating(0);
        setReview("");
    };

    const getInitials = (name) => {
        if (!name) return "??";
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
                                        {getInitials(app.name)}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#01579B] transition-colors">{app.name}</h4>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
                                            <span className="text-[#028090]">{app.specialization}</span>
                                            <span className="text-gray-300 hidden md:block">•</span>
                                            <span className="text-gray-500">{app.date} • {app.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Status & Actions */}
                                <div className="flex items-center md:justify-end gap-4 min-w-[140px]">
                                    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                    
                                    {app.status === 'upcoming' && (
                                        <button 
                                            onClick={() => handleCancel(app.id)}
                                            className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {app.status === 'completed' && !submittedFeedbacks.has(app.id) && (
                                        <button 
                                            onClick={() => setSelectedAppt(app)}
                                            className="text-sm font-bold border border-[#028090] text-[#028090] hover:bg-[#028090] hover:text-white px-4 py-1.5 rounded-lg transition-all"
                                        >
                                            Give Feedback
                                        </button>
                                    )}
                                    {app.status === 'completed' && submittedFeedbacks.has(app.id) && (
                                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                                            Feedback Submitted
                                        </span>
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

            {/* FEEDBACK MODAL OVERLAY */}
            {selectedAppt && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-[slideUp_0.4s_ease-out]">
                        
                        <div className="p-6 border-b border-gray-100 bg-[#eaf4fb]/50">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-[#1f2937]">Rate Review</h3>
                                <button 
                                    onClick={() => setSelectedAppt(null)}
                                    className="text-gray-400 hover:text-red-500 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                                >✕</button>
                            </div>
                            <p className="text-sm text-[#028090] font-medium mt-1">Doctor: {selectedAppt.name}</p>
                        </div>
                        
                        <form onSubmit={handleFeedbackSubmit} className="p-6">
                            <div className="space-y-6">
                            
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Rate your doctor</label>
                                    <div className="flex gap-2 justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`p-2 rounded-full transition-all hover:scale-110 ${rating >= star ? 'text-amber-400 bg-amber-50' : 'text-gray-300 hover:bg-gray-50'}`}
                                            >
                                                <Star className="w-8 h-8" fill={rating >= star ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Review</label>
                                    <textarea 
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        className="w-full border border-gray-200 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#00A896]/50 resize-none text-sm text-gray-800"
                                        placeholder="How was your consultation experience? Let others know..."
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedAppt(null)}
                                        className="flex-1 py-3 text-gray-600 font-bold border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
                                    >Cancel</button>
                                    <button 
                                        type="submit"
                                        disabled={!rating || !review.trim()}
                                        className={`flex-1 py-3 font-bold rounded-2xl transition-all shadow-md ${(!rating || !review.trim()) ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-[#0277BD] to-[#00A896] text-white hover:shadow-lg hover:-translate-y-0.5'}`}
                                    >Submit Feedback</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AppointmentsPage;
