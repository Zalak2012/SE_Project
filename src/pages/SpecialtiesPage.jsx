import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SpecialtiesPage = () => {
    const specialties = [
        {
            id: 'cardiology',
            name: 'Cardiology',
            icon: '❤️',
            desc: 'Expert care for your heart and cardiovascular system.',
            detailedDesc: 'Our board-certified cardiologists use state-of-the-art diagnostic tools to provide comprehensive care for all heart conditions.'
        },
        {
            id: 'dermatology',
            name: 'Dermatology',
            icon: '✨',
            desc: 'Comprehensive skin, hair, and nail treatments.',
            detailedDesc: 'From acne treatments to skin cancer screenings, our dermatologists provide personalized care for your skin health.'
        },
        {
            id: 'neurology',
            name: 'Neurology',
            icon: '🧠',
            desc: 'Advanced care for brain and nervous system disorders.',
            detailedDesc: 'Specialized treatment for migraines, epilepsy, neuropathy, and other complex neurological conditions.'
        },
        {
            id: 'orthopedics',
            name: 'Orthopedics',
            icon: '🦴',
            desc: 'Specialized treatment for bones, joints, and muscles.',
            detailedDesc: 'Get back in motion with our expert orthopedic surgeons treating sports injuries, arthritis, and joint replacements.'
        },
        {
            id: 'general-physician',
            name: 'General Physician',
            icon: '👨‍⚕️',
            desc: 'Primary care and routine check-ups for overall health.',
            detailedDesc: 'Your first point of contact for health concerns, providing preventive care and managing chronic illnesses.'
        },
        {
            id: 'pediatrics',
            name: 'Pediatrics',
            icon: '👶',
            desc: 'Dedicated healthcare for infants, children, and adolescents.',
            detailedDesc: 'Compassionate pediatric care focusing on your child\'s physical, mental, and social health from birth to young adulthood.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Header */}
                <section className="bg-gradient-to-r from-[#01579B] to-[#0277BD] text-white py-16">
                    <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-[fadeIn_0.5s_ease-out]">Medical Specialties</h1>
                        <p className="text-[#B3E5FC] text-lg md:text-xl max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                            Discover our wide range of specialized healthcare services
                        </p>
                    </div>
                </section>

                {/* Specialties Grid */}
                <section className="py-16 container mx-auto px-4 md:px-8 max-w-7xl animate-[fadeIn_0.5s_ease-out_0.4s_both]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {specialties.map((spec, index) => (
                            <div 
                                key={spec.id} 
                                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#039BE5] transition-all duration-300 group hover:-translate-y-2 flex flex-col h-full"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-16 h-16 bg-[#B3E5FC]/30 rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:bg-[#0277BD] transition-colors duration-300 group-hover:scale-110">
                                    {spec.icon}
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#01579B] transition-colors">
                                    {spec.name}
                                </h3>
                                
                                <p className="text-[#028090] font-medium mb-4">
                                    {spec.desc}
                                </p>
                                
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                                    {spec.detailedDesc}
                                </p>
                                
                                <Link 
                                    to={`/doctors?specialty=${encodeURIComponent(spec.name)}`} 
                                    className="inline-flex items-center justify-center w-full bg-[#F8FAFC] text-[#0277BD] border border-gray-200 hover:border-[#0277BD] hover:bg-[#0277BD] hover:text-white py-3 rounded-xl font-bold transition-all duration-300 mt-auto"
                                >
                                    View Doctors <span className="ml-2">→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Help section */}
                <section className="py-16 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold text-[#01579B] mb-4">Not sure which specialty you need?</h2>
                        <p className="text-gray-600 mb-8 text-lg">Use our AI Symptom Checker to get guidance on which specialist could best address your symptoms.</p>
                        <Link 
                            to="/ai-checker" 
                            className="inline-flex items-center gap-2 bg-[#00A896] hover:bg-[#028090] text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                        >
                            🤖 Try AI Symptom Checker
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default SpecialtiesPage;
