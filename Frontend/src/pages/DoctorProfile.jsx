import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { getImageUrl } from '../utils/getImageUrl';


const DoctorProfile = () => {
    const { id } = useParams();
    const { handleProtectedAction } = useAuth();
    
    const [doctor, setDoctor] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    React.useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const res = await apiFetch(`/api/doctors/${id}`);
                if (res.ok) {
                    setDoctor(await res.json());
                } else {
                    setError("Doctor not found.");
                }
            } catch (err) {
                console.error("Fetch doctor error:", err);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDoctor();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#028090] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Footer />
        </div>
    );

    if (error || !doctor) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <span className="text-5xl mb-4">⚠️</span>
                <p className="text-xl font-bold">{error || "Doctor not found."}</p>
                <Link to="/doctors" className="mt-4 text-[#0277BD] underline font-bold">Back to Doctors</Link>
            </div>
            <Footer />
        </div>
    );


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
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0 bg-white relative flex items-center justify-center">
                                <img 
                                    src={getImageUrl(doctor.image)} 
                                    alt={doctor.name} 
                                    onError={(e) => { e.target.src = "/default-doctor.png"; }}
                                    className="w-full h-full object-cover" 
                                />
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
                                <p className="text-[#028090] font-medium text-lg">{doctor.specialization || "General Physician"}</p>
                                
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex text-yellow-400 text-lg">
                                        ★★★★★
                                    </div>
                                    <span className="font-bold text-gray-700">{doctor.rating || 5.0}</span>
                                    <span className="text-gray-400 text-sm">({doctor.patientsCount || 0} reviews)</span>
                                </div>
                            </div>
                            
                            {/* CTA Action */}
                            <div className="sm:pt-6 flex-shrink-0">
                                <button onClick={(e) => handleProtectedAction(e, `/booking/${doctor._id}`)} className="w-full sm:w-auto bg-[#028090] hover:bg-[#00A896] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
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
                                        {doctor.bio || "No biography available."}
                                    </p>
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-[#0277BD]">🎓</span> Education & Training
                                    </h2>
                                    <ul className="space-y-3">
                                        {(doctor.education || "MBBS - B.J. Medical College, Ahmedabad\nMD - Government Medical College, Gandhinagar\nClinical Practice - Gujarat Medical Council").split('\n').map((edu, idx) => (
                                            <li key={idx} className="flex gap-3 text-gray-600">
                                                <span className="text-[#00A896] font-bold">•</span>
                                                {edu.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>

                            {/* Right Column (Info Cards) */}
                            <div className="space-y-4">
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Experience</p>
                                    <p className="text-lg font-bold text-gray-800">{doctor.experience || 5}+ Years</p>
                                </div>
                                
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Consultation Fee</p>
                                    <p className="text-lg font-bold text-[#028090]">₹{doctor.consultationFee || 500}</p>
                                </div>
                                
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Availability</p>
                                    <p className="text-md font-medium text-gray-800 mb-2">{doctor.availability || "Mon-Fri, 9 AM – 5 PM"}</p>
                                    <span className="inline-block bg-[#E6F4EA] text-[#00A896] text-xs font-bold px-3 py-1 rounded-full border border-[#00A896]/20">
                                        Available Today
                                    </span>
                                </div>
                                
                                <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-semibold text-gray-500 mb-1">Clinic Address</p>
                                    <p className="text-md text-gray-800">{doctor.hospital || doctor.location || "Sector 21, Gandhinagar, Gujarat"}</p>
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
