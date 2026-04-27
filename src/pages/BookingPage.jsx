import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuth, handleProtectedAction } = useAuth();

    // In a real app, verify isAuth and redirect if false (though handleProtectedAction handles this usually)
    // Actually, App.jsx / Navigation should protect this route. 
    // We will do a strict check here.
    if (!isAuth) {
        // We use handleProtectedAction manually or just redirect
        setTimeout(() => navigate('/login'), 0);
        return null;
    }

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Mock Doctor Data
    const doctor = {
        name: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        fee: 1500,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        location: "HeartCare Center, NY"
    };

    // Generate upcoming 14 days for date selection
    const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1); // start from tomorrow for mockup
        return d;
    });

    // Mock Time Slots
    const mngSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM"];
    const aftSlots = ["01:00 PM", "02:00 PM", "03:30 PM", "04:00 PM"];

    const isComplete = selectedDate && selectedTime;

    const handleProceedToPayment = () => {
        if (!isComplete) return;
        navigate('/payment', { 
            state: { 
                doctor: doctor, 
                date: new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
                time: selectedTime 
            } 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 md:px-8 max-w-4xl py-12">
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="text-[#0277BD] font-medium hover:text-[#01579B] flex items-center gap-2 transition-colors">
                        <span>←</span> Back to Profile
                    </button>
                    <h1 className="text-3xl font-bold text-[#01579B] mt-4">Book Appointment</h1>
                    <p className="text-gray-500 mt-1">Select an available slot to schedule your consultation</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 animate-[fadeIn_0.5s_ease-out_both] flex flex-col md:flex-row gap-8">

                    {/* STEP 1: Doctor Details */}
                    <div className="md:w-1/3 border-r border-gray-100 pr-0 md:pr-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md mb-4">
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
                            <p className="text-[#028090] font-medium text-sm mb-4">{doctor.specialty}</p>

                            <div className="w-full bg-[#F8FAFC] rounded-xl p-4 text-left space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Consultation Fee</span>
                                    <span className="font-bold text-[#01579B]">₹{doctor.fee}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3">
                                    <span className="text-gray-500">Clinic</span>
                                    <span className="font-medium text-gray-800 text-right max-w-[120px] truncate">{doctor.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Date & Time Selection */}
                    <div className="md:w-2/3">
                        {/* STEP 2: Date Selection */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-[#E1F5FE] text-[#0277BD] w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                Select Date
                            </h3>

                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                                {upcomingDates.map((date, idx) => {
                                    const isSelected = selectedDate === date.toISOString();
                                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                    const dayNum = date.getDate();
                                    const monthName = date.toLocaleDateString('en-US', { month: 'short' });

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => { setSelectedDate(date.toISOString()); setSelectedTime(null); }}
                                            className={`snap-center flex-shrink-0 w-20 py-4 rounded-2xl border flex flex-col items-center justify-center transition-all ${isSelected ? 'border-[#028090] bg-[#028090] text-white shadow-md transform -translate-y-1' : 'border-gray-200 bg-white text-gray-600 hover:border-[#028090] hover:bg-[#F8FAFC]'}`}
                                        >
                                            <span className="text-xs font-semibold mb-1 opacity-80">{monthName}</span>
                                            <span className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>{dayNum}</span>
                                            <span className="text-xs font-medium">{dayName}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* STEP 3: Time Slots */}
                        <div className={`transition-opacity duration-300 ${selectedDate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className={`${selectedDate ? 'bg-[#E1F5FE] text-[#0277BD]' : 'bg-gray-100 text-gray-400'} w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors`}>2</span>
                                Select Time
                            </h3>

                            <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-500 mb-3">Morning Slots</p>
                                <div className="flex flex-wrap gap-3">
                                    {mngSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedTime === time ? 'border-[#00A896] bg-[#00A896] text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-[#00A896] hover:bg-[#E6F4EA]'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-3 mt-6">Afternoon Slots</p>
                                <div className="flex flex-wrap gap-3">
                                    {aftSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${selectedTime === time ? 'border-[#00A896] bg-[#00A896] text-white shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-[#00A896] hover:bg-[#E6F4EA]'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* STEP 4: Proceed to Payment */}
                <div className="flex justify-end animate-[slideUp_0.5s_ease-out_0.2s_both]">
                    <button
                        onClick={handleProceedToPayment}
                        disabled={!isComplete}
                        className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${isComplete ? 'bg-[#0277BD] hover:bg-[#01579B] text-white shadow-lg hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        Proceed to Payment
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingPage;
