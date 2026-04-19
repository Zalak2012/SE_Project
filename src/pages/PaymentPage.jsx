import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addAppointment } = useData();
    const { isAuth, currentUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    // If no state passed (direct url visit), or not auth, bounce back
    if (!isAuth) return <Navigate to="/login" replace />;
    if (!location.state || !location.state.doctor) return <Navigate to="/doctors" replace />;

    const { doctor, date, time } = location.state;

    // Hardcoded to COD. Future versions can add state for paymentMethod selection.
    const paymentMethod = 'COD';

    const getInitials = (name) => {
        if (!name) return "??";
        const parts = name.replace('Dr. ', '').split(' ');
        return parts.map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const handleConfirmBooking = () => {
        setIsProcessing(true);

        setTimeout(() => {
            const newAppointment = {
                name: doctor.name,
                specialization: doctor.specialty,
                date: date,
                time: time,
                status: 'upcoming',
                initials: getInitials(doctor.name),
                paymentMethod: paymentMethod,
                fee: doctor.fee
            };

            addAppointment(newAppointment);
            setIsProcessing(false);
            navigate('/appointments'); // Redirect to patient appointments
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl animate-[fadeIn_0.5s_ease-out_both]">
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="text-[#0277BD] font-medium hover:text-[#01579B] flex items-center gap-2 transition-colors">
                        <span>←</span> Back
                    </button>
                    <h1 className="text-3xl font-bold text-[#1F2937] mt-4">Complete Payment</h1>
                    <p className="text-gray-500 mt-1 font-medium">Choose your payment method to confirm the booking.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Payment Options */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Summary Header for Mobile (Optional, hidden on large) */}
                        <div className="lg:hidden bg-white p-5 rounded-2xl border border-[#E1F5FE] flex items-center justify-between shadow-sm">
                            <span className="font-bold text-gray-600">Total to pay</span>
                            <span className="text-2xl font-bold text-[#028090]">₹{doctor.fee}</span>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1F2937] mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-[#028090] w-5 h-5" /> Secure Checkout
                            </h2>

                            <div className="space-y-4">
                                {/* OP 1: COD (Active) */}
                                <label className="relative flex items-start sm:items-center p-5 rounded-2xl border-2 border-[#00A896] bg-[#00A896]/5 cursor-pointer hover:bg-[#00A896]/10 transition-colors">
                                    <div className="flex items-center h-6">
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="COD" 
                                            checked={true}
                                            readOnly
                                            className="w-5 h-5 text-[#00A896] focus:ring-[#00A896] bg-gray-100 border-gray-300"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                                <Banknote className="w-6 h-6 text-[#00A896]" />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-[#1F2937]">Cash on Delivery</span>
                                                <span className="block text-sm text-gray-500 font-medium">Pay directly at the clinic after consultation</span>
                                            </div>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="absolute top-5 right-5 sm:relative sm:top-auto sm:right-auto w-6 h-6 text-[#00A896] ml-4 shrink-0" />
                                </label>

                                {/* OP 2: Online (Disabled) */}
                                <label className="relative flex items-start sm:items-center p-5 rounded-2xl border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed">
                                    <div className="flex items-center h-6">
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            disabled
                                            className="w-5 h-5 border-gray-300 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                                <CreditCard className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-gray-600">Online Payment</span>
                                                <span className="block text-sm text-gray-400 font-medium">Credit/Debit Card, UPI, Netbanking</span>
                                            </div>
                                        </div>
                                        <span className="inline-flex mt-2 sm:mt-0 items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-200 text-gray-500 uppercase tracking-widest w-fit">
                                            Coming Soon
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm sticky top-8">
                            <h3 className="text-lg font-bold text-[#1F2937] mb-6">Booking Summary</h3>

                            {/* Doctor Card Profile */}
                            <div className="flex gap-4 items-center mb-6 pb-6 border-b border-gray-100">
                                <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-100" />
                                <div>
                                    <h4 className="font-bold text-[#1F2937] leading-tight">{doctor.name}</h4>
                                    <p className="text-sm text-[#028090] font-medium">{doctor.specialty}</p>
                                    <p className="text-xs text-gray-400 mt-1">{doctor.location}</p>
                                </div>
                            </div>

                            {/* Date Time Specs */}
                            <ul className="space-y-4 mb-6">
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-bold text-gray-800 text-right">{date}</span>
                                </li>
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500">Time</span>
                                    <span className="font-bold text-gray-800 text-right">{time}</span>
                                </li>
                                <li className="flex justify-between items-start text-sm">
                                    <span className="text-gray-500">Consultation Fee</span>
                                    <span className="font-bold text-gray-800 text-right">₹{doctor.fee}</span>
                                </li>
                                <li className="flex justify-between items-start text-sm text-[#00A896]">
                                    <span className="font-medium">Taxes & Fees</span>
                                    <span className="font-bold text-right">Free</span>
                                </li>
                            </ul>

                            <div className="border-t border-gray-100 pt-5 mb-6 flex items-center justify-between">
                                <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                                <span className="font-black text-2xl text-[#028090]">₹{doctor.fee}</span>
                            </div>

                            <button 
                                onClick={handleConfirmBooking}
                                disabled={isProcessing}
                                className={`w-full py-4 text-center rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                                    isProcessing 
                                        ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-[#0277BD] to-[#028090] hover:shadow-lg hover:-translate-y-0.5 text-white'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                            <p className="text-[11px] text-center text-gray-400 font-medium mt-4 px-2">
                                By confirming, you agree to CareMatePlus's terms of service and cancellation policy.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentPage;
