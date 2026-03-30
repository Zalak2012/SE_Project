import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const DoctorProfile = () => {
    const { id } = useParams();
    const { handleProtectedAction } = useAuth();
    
    // In a real app, you would fetch doctor data based on ID
    // Using static data for the frontend mockup
    const doctor = {
        name: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        experience: 15,
        rating: 4.9,
        reviews: 124,
        location: "HeartCare Center, NY",
        hours: "Mon-Fri, 9am - 5pm",
        fee: 1500,
        availableToday: true,
        verified: true,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        about: "Dr. Sarah Jenkins is a board-certified Cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. She specializes in preventive cardiology, echocardiography, and heart failure management. She is dedicated to providing compassionate, patient-centered care and utilizing the latest medical advancements.",
        education: [
            "M.D., Harvard Medical School",
            "Residency in Internal Medicine, Johns Hopkins Hospital",
            "Fellowship in Cardiovascular Disease, Mayo Clinic"
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 md:px-8 max-w-4xl py-12">
                {/* Back Link */}
                <Link to="/doctors" className="inline-flex items-center text-[#0277BD] font-medium hover:text-[#01579B] transition-colors mb-6">
                    <span className="mr-2">←</span> Back to Doctors
                </Link>

                <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden animate-[fadeIn_0.5s_ease-out_both]">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-[#B3E5FC] to-[#0277BD]/30 w-full relative"></div>

                    <div className="px-8 pb-10">
                        {/* Avatar & Name */}
                        <div className="flex flex-col sm:flex-row gap-6 relative -mt-16 mb-8">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0 bg-white relative">
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                {doctor.verified && (
                                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                                        <div className="bg-[#00A896] text-white text-[12px] w-6 h-6 flex items-center justify-center rounded-full font-bold">
                                            ✓
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-16 sm:pt-2 flex-grow">
                                <h1 className="text-3xl font-bold text-[#01579B]">{doctor.name}</h1>
                                <p className="text-[#028090] font-medium text-lg">{doctor.specialty}</p>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex text-yellow-400 text-lg">
                                        ★★★★★
                                    </div>
                                    <span className="font-bold text-gray-700">{doctor.rating}</span>
                                    <span className="text-gray-400 text-sm">({doctor.reviews} reviews)</span>
                                </div>
                            </div>
                            
                            {/* CTA Action */}
                            <div className="sm:pt-6 flex-shrink-0">
                                <button onClick={(e) => handleProtectedAction(e, `/booking/${id || 'doc-123'}`)} className="w-full sm:w-auto bg-[#028090] hover:bg-[#00A896] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                    Book Appointment
                                </button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                            {/* Left Column (About & Education) */}
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-[#0277BD]">👤</span> About Doctor
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {doctor.about}
                                    </p>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-[#0277BD]">🎓</span> Education & Training
                                    </h2>
                                    <ul className="space-y-3">
                                        {doctor.education.map((edu, idx) => (
                                            <li key={idx} className="flex gap-3 text-gray-600">
                                                <span className="text-[#00A896] font-bold">•</span>
                                                {edu}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column (Info Cards) */}
                            <div className="space-y-4">
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Experience</p>
                                    <p className="text-lg font-bold text-gray-800">{doctor.experience}+ Years</p>
                                </div>
                                
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Consultation Fee</p>
                                    <p className="text-lg font-bold text-[#028090]">₹{doctor.fee}</p>
                                </div>
                                
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Availability</p>
                                    <p className="text-md font-medium text-gray-800 mb-2">{doctor.hours}</p>
                                    {doctor.availableToday && (
                                        <span className="inline-block bg-[#E6F4EA] text-[#00A896] text-xs font-bold px-3 py-1 rounded-full border border-[#00A896]/20">
                                            Available Today
                                        </span>
                                    )}
                                </div>
                                
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Clinic Address</p>
                                    <p className="text-md text-gray-800">{doctor.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DoctorProfile;
