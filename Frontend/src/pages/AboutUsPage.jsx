import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-[#01579B] to-[#0277BD] text-white py-20">
                    <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-[fadeIn_0.5s_ease-out]">About CareMatePlus</h1>
                        <p className="text-[#B3E5FC] text-xl max-w-3xl mx-auto leading-relaxed animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                            CareMatePlus is an AI-powered healthcare platform dedicated to bridging the gap between patients and top-tier medical professionals.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 md:px-8 max-w-5xl py-16">
                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16 animate-[fadeIn_0.5s_ease-out_0.4s_both]">
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#039BE5] transition-all duration-300">
                            <div className="w-16 h-16 bg-[#00A896]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                                🎯
                            </div>
                            <h2 className="text-2xl font-bold text-[#01579B] mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Making healthcare accessible and smart. We aim to to simplify the healthcare journey by providing a seamless, intuitive, and highly secure platform for patient-doctor interactions.
                            </p>
                        </div>
                        
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#039BE5] transition-all duration-300">
                            <div className="w-16 h-16 bg-[#039BE5]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                                👁️
                            </div>
                            <h2 className="text-2xl font-bold text-[#01579B] mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Empowering users with digital healthcare tools. We envision a future where technology empowers every individual to take complete control of their well-being.
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-16 animate-[fadeIn_0.5s_ease-out_0.6s_both]">
                        <h2 className="text-3xl font-bold text-[#01579B] mb-8 text-center">What We Offer</h2>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                <div className="p-8 text-center hover:bg-gray-50 transition-colors">
                                    <div className="text-4xl mb-4">🩺</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Doctor Discovery</h3>
                                    <p className="text-gray-500">Find experienced specialists, read reviews, and browse profiles to make informed healthcare choices.</p>
                                </div>
                                <div className="p-8 text-center hover:bg-gray-50 transition-colors">
                                    <div className="text-4xl mb-4">📅</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Appointment Booking</h3>
                                    <p className="text-gray-500">Easily schedule, manage, and attend consultations with our seamless digital scheduling system.</p>
                                </div>
                                <div className="p-8 text-center hover:bg-gray-50 transition-colors">
                                    <div className="text-4xl mb-4">🤖</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">AI Symptom Analysis</h3>
                                    <p className="text-gray-500">Leverage our intelligent pre-screening tool to understand your symptoms and know who to consult.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-[#E1F5FE] rounded-3xl p-10 text-center border border-[#B3E5FC] animate-[fadeIn_0.5s_ease-out_0.8s_both]">
                        <h2 className="text-2xl font-bold text-[#01579B] mb-4">Get In Touch</h2>
                        <p className="text-gray-700 mb-6">Have questions or need support? Our team is always here to help you.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:support@caremateplus.com" className="bg-white text-[#0277BD] px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                                support@caremateplus.com
                            </a>
                            <a href="tel:+1234567890" className="bg-[#0277BD] text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all hover:bg-[#01579B]">
                                +1 (234) 567-890
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUsPage;
