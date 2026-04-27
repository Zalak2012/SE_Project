import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const HeroSection = ({ onProtectedAction }) => {
    const { reviews } = useData();
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    const approvedReviews = reviews.filter(r => r.status === 'Approved');

    useEffect(() => {
        if (approvedReviews.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentReviewIndex(prev => (prev + 1) % approvedReviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [approvedReviews.length]);

    const displayReview = approvedReviews.length > 0 ? approvedReviews[currentReviewIndex] : {
        userName: "JD",
        avatar: "",
        rating: 5,
        text: "Highly recommended! Dr. Sarah is amazing."
    };

    const getInitials = (name) => {
        if (!name) return "??";
        return name.substring(0, 2).toUpperCase();
    };
    return (
        <section className="bg-[#B3E5FC]/20 py-16 md:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="space-y-8 z-10">
                        <div className="inline-block bg-[#028090]/10 text-[#028090] font-semibold px-4 py-2 rounded-full text-sm border border-[#028090]/20 animate-[fadeIn_1s_ease-out]">
                            ✨ AI-Powered Healthcare Platform
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#01579B] leading-tight animate-[fadeIn_1s_ease-out_0.2s_both]">
                            Your Health, <br />
                            <span className="text-[#039BE5]">Our Priority</span>
                        </h1>

                        <p className="text-gray-600 text-lg md:text-xl max-w-lg animate-[fadeIn_1s_ease-out_0.4s_both]">
                            Connect with top-rated doctors, get AI-driven symptom insights, and take control of your well-being with CareMatePlus.
                        </p>

                        <div className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center max-w-md border border-[#B3E5FC]">
                            <div className="pl-4 text-gray-400">🔍</div>
                            <input
                                type="text"
                                placeholder="Search doctors, specializations..."
                                className="w-full px-3 text-gray-700 bg-transparent outline-none"
                            />
                            <Link to="/doctors" onClick={(e) => onProtectedAction && onProtectedAction(e, '/doctors')} className="bg-[#0277BD] hover:bg-[#01579B] text-white px-6 py-2 rounded-full transition-colors duration-300 font-medium whitespace-nowrap">
                                Search
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-[fadeIn_1s_ease-out_0.6s_both]">
                            <button onClick={(e) => onProtectedAction && onProtectedAction(e, '/ai-checker')} className="flex items-center justify-center gap-2 bg-[#00A896] hover:bg-[#028090] text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 font-medium">
                                🤖 AI Symptom Checker
                            </button>
                            <Link to="/doctors" onClick={(e) => onProtectedAction && onProtectedAction(e, '/doctors')} className="flex items-center justify-center gap-2 bg-white text-[#0277BD] border-2 border-[#B3E5FC] hover:border-[#039BE5] hover:bg-gray-50 px-8 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 font-medium">
                                Browse Doctors
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#B3E5FC]/50">
                            <div className="text-center md:text-left">
                                <p className="font-bold text-2xl text-[#01579B]">500+</p>
                                <p className="text-sm text-gray-500 font-medium">Doctors</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="font-bold text-2xl text-[#01579B]">50K+</p>
                                <p className="text-sm text-gray-500 font-medium">Patients</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="font-bold text-2xl text-[#01579B]">24/7</p>
                                <p className="text-sm text-gray-500 font-medium">Support</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="font-bold text-2xl text-[#01579B]">100%</p>
                                <p className="text-sm text-gray-500 font-medium">Secure</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full max-w-sm mx-auto lg:ml-auto mt-8 lg:mt-0 lg:mr-8 z-10 animate-[fadeIn_1s_ease-out_0.8s_both]">
                        <div className="absolute top-0 -right-8 w-60 h-60 bg-[#00A896]/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
                        <div className="absolute bottom-0 -left-8 w-60 h-60 bg-[#039BE5]/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite_1s]"></div>

                        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-[#B3E5FC] z-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-[float_6s_ease-in-out_infinite]">
                            <div className="bg-[#B3E5FC]/30 h-24 absolute top-0 left-0 w-full z-0"></div>

                            <div className="p-6 relative z-10 pt-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-3">
                                        <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md overflow-hidden flex items-center justify-center mx-auto sm:mx-0">
                                            <img
                                                src="https://t4.ftcdn.net/jpg/02/82/72/13/360_F_282721302_ASa8MKXhTukl1TnIxGl56eiOQkrvK5zL.jpg"
                                                alt="Dr. Sarah Jenkins"
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#01579B]">Dr. Sarah Jenkins</h3>
                                            <p className="text-[#028090] font-medium text-sm">Cardiology Specialist</p>

                                            <div className="flex items-center mt-1 text-sm text-gray-600 font-medium">
                                                ⭐ 4.9 <span className="text-gray-400 ml-1">(120 reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#E6F4EA] text-[#00A896] p-1.5 rounded-full shadow-sm border border-[#00A896]/20 flex items-center gap-1 px-3 text-xs font-bold" title="Verified Doctor">
                                        ✓ Verified
                                    </div>
                                </div>

                                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100 mb-6">
                                    <p className="text-sm text-gray-500 mb-3 font-medium flex items-center gap-2">
                                        🕒 Next Available
                                    </p>
                                    <div className="flex sm:flex-row flex-col gap-2">
                                        <div className="bg-white px-3 py-2 rounded-xl border-2 border-[#0277BD] text-[#0277BD] font-semibold text-xs text-center flex-1 cursor-pointer shadow-sm">
                                            Today<br />2:30 PM
                                        </div>
                                        <div className="bg-white px-3 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs text-center flex-1 cursor-pointer shadow-sm hover:border-gray-300">
                                            Tomorrow<br />10:00 AM
                                        </div>
                                    </div>
                                </div>

                                <button onClick={(e) => onProtectedAction && onProtectedAction(e, '/booking')} className="w-full bg-[#0277BD] hover:bg-[#01579B] text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 group">
                                    Book Appointment ➔
                                </button>
                            </div>
                        </div>

                        <div className="absolute -bottom-5 -left-10 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-[#B3E5FC] z-20 flex items-center gap-3 w-64 translate-y-2 transition-all duration-500">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0 overflow-hidden">
                                {displayReview.avatar ? (
                                    <img src={displayReview.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(displayReview.userName)
                                )}
                            </div>
                            <div>
                                <div className="flex text-yellow-400 text-xs mb-0.5">
                                    {"★".repeat(displayReview.rating)}{"☆".repeat(5 - displayReview.rating)}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">"{displayReview.text}"</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
