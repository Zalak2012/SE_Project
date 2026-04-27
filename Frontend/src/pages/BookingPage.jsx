import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { getImageUrl } from '../utils/getImageUrl';
import { Loader2 } from 'lucide-react';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuth } = useAuth();

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }
    }, [isAuth, navigate]);

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const res = await apiFetch(`/api/doctors/${id}`);
                
                if (res.ok) {
                    const data = await res.json();
                    setDoctor(data);
                } else {
                    setError("Failed to load doctor details.");
                }
            } catch (err) {
                console.error("Booking fetch error:", err);
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDoctor();
    }, [id]);


    useEffect(() => {
        if (selectedDate && doctor) {
            const fetchSlots = async () => {
                setLoadingSlots(true);
                try {
                    const res = await apiFetch(`/api/schedule?doctorId=${id}&date=${selectedDate}`);
                    if (res.ok) setSchedule(await res.json());
                } catch (err) {
                    console.error("Schedule fetch error:", err);
                } finally {
                    setLoadingSlots(false);
                }
            };
            fetchSlots();
        }
    }, [selectedDate, doctor, id]);

    const upcomingDates = Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i); 
        return d;
    });

    const isComplete = selectedDate && selectedTime;

    const handleProceedToPayment = () => {
        if (!isComplete) return;
        navigate('/payment', { 
            state: { 
                doctor: doctor, 
                date: selectedDate, 
                time: selectedTime 
            } 
        });
    };

    if (!isAuth) return null;
    
    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
            <p className="text-gray-500 font-medium italic">Fetching doctor availability...</p>
        </div>
    );

    if (error || !doctor) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-inner">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800">Doctor Not Found</h2>
            <p className="text-gray-500">{error || "The link might be broken or the doctor is unavailable."}</p>
            <button onClick={() => navigate('/doctors')} className="mt-4 px-6 py-2 bg-[#0277BD] text-white rounded-xl font-bold">Find Other Doctors</button>
        </div>
    );


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
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md mb-4 bg-[#E1F5FE] flex items-center justify-center">
                                {doctor.image ? (
                                    <img 
                                        src={getImageUrl(doctor.image)} 
                                        alt={doctor.name} 
                                        onError={(e) => { e.target.src = "/default-doctor.png"; }}
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-[#0277BD]">{doctor.name.charAt(0)}</span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{doctor.name}</h2>
                            <p className="text-[#028090] font-medium text-sm mb-4">{doctor.specialization}</p>

                            <div className="w-full bg-[#F8FAFC] rounded-xl p-4 text-left space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Consultation Fee</span>
                                    <span className="font-bold text-[#01579B]">₹{doctor.consultationFee}</span>
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

                            {loadingSlots ? (
                                <div className="flex items-center gap-2 text-gray-400 py-4 italic">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Checking slots...
                                </div>
                            ) : schedule?.slots ? (
                                <>
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-500 mb-3">Available Slots</p>
                                        <div className="flex flex-wrap gap-3">
                                            {schedule.slots.map(slot => (
                                                <button
                                                    key={slot.time}
                                                    disabled={slot.status !== 'available'}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                                                        selectedTime === slot.time 
                                                            ? 'border-[#00A896] bg-[#00A896] text-white shadow-sm' 
                                                            : slot.status === 'available'
                                                                ? 'border-gray-200 bg-white text-gray-700 hover:border-[#00A896] hover:bg-[#E6F4EA]'
                                                                : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                                                    }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-400 py-4 italic">Select a date to view available time slots.</p>
                            )}
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
