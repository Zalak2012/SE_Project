import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { handleProtectedAction } = useAuth();
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header / Navbar */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection onProtectedAction={handleProtectedAction} />

            {/* Features Section */}
            <section className="py-24 px-4 md:px-8 container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-[#028090]/10 text-[#028090] font-semibold px-4 py-2 rounded-full text-sm border border-[#028090]/20 mb-4">
                        Why Choose CareMate Plus
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#01579B] mb-4">Everything You Need for Better Healthcare</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        From finding the right doctor to managing your health records, we've got you covered with intelligent features designed for your well-being.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature Card */}
                    <Link to="/doctors" onClick={(e) => handleProtectedAction(e, '/doctors')}>
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-[#039BE5] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 group relative overflow-hidden flex flex-col h-full cursor-pointer">

                            <div className="w-16 h-16 bg-[#B3E5FC]/50 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#0277BD] transition-colors duration-300">
                                🩺
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#01579B]">
                                Find Expert Doctors
                            </h3>

                            <p className="text-gray-600 leading-relaxed flex-grow">
                                Connect with highly-rated specialists. View profiles, reviews, and credentials to make informed health decisions.
                            </p>

                            <div className="mt-6 flex items-center text-[#0277BD] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>

                        </div>
                    </Link>

                    {/* Feature Card */}
                    <div onClick={(e) => handleProtectedAction(e, '/ai-checker')} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-[#00A896] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 group relative overflow-hidden flex flex-col h-full cursor-pointer">
                        <div className="absolute top-0 right-0 bg-[#00A896]/10 w-32 h-32 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="w-16 h-16 bg-[#00A896]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#00A896] transition-colors duration-300">
                            💡
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#028090]">AI Symptom Checker</h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">Analyze your symptoms instantly using our advanced AI to understand potential conditions and next steps.</p>

                        {/* Learn More Hover Link */}
                        <div className="mt-6 flex items-center text-[#00A896] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Feature Card */}
                    <div onClick={(e) => handleProtectedAction(e, '/booking')} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-[#028090] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 group relative overflow-hidden flex flex-col h-full cursor-pointer">
                        <div className="w-16 h-16 bg-[#028090]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#028090] transition-colors duration-300">
                            📅
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#028090]">Easy Scheduling</h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">Book, reschedule or cancel appointments seamlessly online. Get automated reminders before your visit.</p>

                        {/* Learn More Hover Link */}
                        <div className="mt-6 flex items-center text-[#028090] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Feature Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-[#0277BD] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 group relative overflow-hidden flex flex-col h-full">
                        <div className="w-16 h-16 bg-[#B3E5FC]/40 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#0277BD] transition-colors duration-300">
                            🧪
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#01579B]">Lab Test Booking</h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">Schedule diagnostic tests comfortably from home or find trusted labs near your location with ease.</p>

                        {/* Learn More Hover Link */}
                        <div className="mt-6 flex items-center text-[#0277BD] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Feature Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-[#039BE5] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 group relative overflow-hidden flex flex-col h-full">
                        <div className="w-16 h-16 bg-[#039BE5]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#039BE5] transition-colors duration-300">
                            📱
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#01579B]">Digital Health Records</h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">Keep all your medical history, prescriptions, and lab reports securely stored in one accessible digital vault.</p>

                        {/* Learn More Hover Link */}
                        <div className="mt-6 flex items-center text-[#039BE5] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Feature Card */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-[#00A896] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-105 group relative overflow-hidden flex flex-col h-full">
                        <div className="w-16 h-16 bg-[#00A896]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#00A896] transition-colors duration-300">
                            📞
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#028090]">24/7 Virtual Support</h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">Access medical assistance anytime, anywhere. Consult with certified professionals over secure video or chat.</p>

                        {/* Learn More Hover Link */}
                        <div className="mt-6 flex items-center text-[#00A896] font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            Learn more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Medical Specializations Section */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <div className="inline-block bg-[#028090]/10 text-[#028090] font-semibold px-4 py-2 rounded-full text-sm border border-[#028090]/20 mb-4">
                                Medical Specializations
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#01579B]">Find Doctors by Specialty</h2>
                        </div>
                        {/* View All Specialties Button */}
                        <button className="hidden sm:flex items-center gap-2 text-[#028090] font-medium border-2 border-[#028090] px-6 py-2.5 rounded-full hover:bg-[#028090] hover:text-white transition-all duration-300">
                            View All Specialties ➔
                        </button>
                    </div>

                    {/* Specialties Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { name: 'Cardiology', icon: '❤️', desc: 'Heart Specialists' },
                            { name: 'Neurology', icon: '🧠', desc: 'Brain & Nerves' },
                            { name: 'Orthopedics', icon: '🦴', desc: 'Bone & Joints' },
                            { name: 'Pediatrics', icon: '👶', desc: 'Child Specialists' },
                            { name: 'Dermatology', icon: '✨', desc: 'Skin Experts' },
                            { name: 'Dentistry', icon: '🦷', desc: 'Dental Care' },
                            { name: 'Ophthalmology', icon: '👁️', desc: 'Eye Care' },
                            { name: 'Psychiatry', icon: '🫂', desc: 'Mental Health' },
                        ].map((spec, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer hover:border-[#039BE5] group text-center hover:-translate-y-1">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{spec.icon}</div>
                                <h3 className="font-bold text-gray-800 text-lg">{spec.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{spec.desc}</p>
                            </div>
                        ))}
                    </div>
                    <button className="sm:hidden w-full mt-8 py-4 text-[#0277BD] font-bold border-2 border-[#0277BD] rounded-xl hover:bg-[#0277BD] hover:text-white transition-colors">
                        View All Specializations
                    </button>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4 md:px-8 container mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#01579B] mb-4">Loved by Patients & Doctors</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">Join thousands of satisfied users who trust CareMate Plus for their healthcare needs.</p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex gap-1 text-yellow-400 mb-4 text-sm">
                            ★★★★★
                        </div>
                        <p className="text-gray-700 mb-8 leading-relaxed italic">
                            "The platform is incredibly easy to use. I was able to find a specialist and book an appointment for my mother within just 5 minutes. Highly recommended!"
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Sarah Jenkins" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Sarah Jenkins</h4>
                                <p className="text-xs text-gray-500 font-medium">Patient</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex gap-1 text-yellow-400 mb-4 text-sm">
                            ★★★★★
                        </div>
                        <p className="text-gray-700 mb-8 leading-relaxed italic">
                            "CareMatePlus has completely streamlined my clinic's workflow. The digital records and easy scheduling system give me more time to focus on actual patient care."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Dr. Marcus Thorne" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Dr. Marcus Thorne</h4>
                                <p className="text-xs text-[#00A896] font-medium">Cardiologist</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex gap-1 text-yellow-400 mb-4 text-sm">
                            ★★★★★
                        </div>
                        <p className="text-gray-700 mb-8 leading-relaxed italic">
                            "The AI symptom checker is remarkably accurate! It guided me to the right type of doctor when I wasn't sure what my symptoms meant. True peace of mind."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="David Chen" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">David Chen</h4>
                                <p className="text-xs text-gray-500 font-medium">Patient</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-[#01579B] via-[#028090] to-[#00A896] py-32 relative overflow-hidden flex items-center justify-center min-h-[500px]">
                {/* Floating modern background shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#039BE5]/30 rounded-full blur-[100px] animate-[pulse_6s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#B3E5FC]/20 rounded-full blur-[80px] animate-[pulse_8s_ease-in-out_infinite_1s]"></div>

                <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl relative z-10 flex flex-col items-center justify-center h-full">
                    {/* CTA Heading */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight relative z-10 animate-[fadeIn_1s_ease-out_both] transform translate-y-0">
                            Your Health Deserves <br className="hidden md:block" /> the Best Care
                        </h2>
                    </div>

                    {/* CTA Description */}
                    <p className="text-[#B3E5FC] text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-[fadeIn_1s_ease-out_0.3s_both]">
                        Join thousands of patients and top-tier doctors on the most trusted healthcare platform. Experience modern healthcare today.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-[fadeIn_1s_ease-out_0.6s_both]">
                        <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-[#01579B] px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:scale-105 cursor-pointer">
                            Get Started Free
                        </Link>
                        <Link to="/doctors" className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white hover:text-[#028090] hover:border-white hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                            Browse Doctors
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <Footer />
        </div>
    );
};

export default HomePage;
