import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const FindDoctors = () => {
    const navigate = useNavigate();
    const { handleProtectedAction } = useAuth();
    // Sample Doctor Data
    const doctors = [
        {
            id: 1,
            name: "Dr. Sarah Jenkins",
            specialty: "Cardiologist",
            experience: 15,
            rating: 4.9,
            reviews: 124,
            location: "HeartCare Center, NY",
            hours: "Mon-Fri, 9am - 5pm",
            fee: 1500,
            availableToday: true,
            videoConsult: true,
            verified: true,
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            id: 2,
            name: "Dr. Marcus Thorne",
            specialty: "Neurologist",
            experience: 12,
            rating: 4.8,
            reviews: 98,
            location: "Neuro Health Clinic",
            hours: "Tue-Sat, 10am - 6pm",
            fee: 2000,
            availableToday: false,
            videoConsult: true,
            verified: true,
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            id: 3,
            name: "Dr. Emily Chen",
            specialty: "Pediatrician",
            experience: 8,
            rating: 4.9,
            reviews: 215,
            location: "KidsFirst Hospital",
            hours: "Mon-Sat, 8am - 4pm",
            fee: 1000,
            availableToday: true,
            videoConsult: false,
            verified: true,
            image: "https://images.unsplash.com/photo-1594824436998-058b23c28bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            id: 4,
            name: "Dr. James Wilson",
            specialty: "Dermatologist",
            experience: 20,
            rating: 4.7,
            reviews: 156,
            location: "Skin Perfect Clinic",
            hours: "Mon-Wed, 10am - 7pm",
            fee: 1800,
            availableToday: false,
            videoConsult: true,
            verified: true,
            image: "https://images.unsplash.com/photo-1537368910025-702800faa86b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            id: 5,
            name: "Dr. Robert Patel",
            specialty: "Orthopedic Surgeon",
            experience: 18,
            rating: 4.9,
            reviews: 342,
            location: "City General Hospital",
            hours: "Thu-Sun, 9am - 5pm",
            fee: 2500,
            availableToday: true,
            videoConsult: true,
            verified: true,
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
            id: 6,
            name: "Dr. Lisa Wong",
            specialty: "General Physician",
            experience: 10,
            rating: 4.8,
            reviews: 412,
            location: "Family Health Center",
            hours: "Mon-Fri, 8am - 8pm",
            fee: 800,
            availableToday: true,
            videoConsult: true,
            verified: true,
            image: "https://images.unsplash.com/photo-1594824436998-058b23c28bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        }
    ];

    const [search, setSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [specialty, setSpecialty] = useState('');
    const [minRating, setMinRating] = useState(0);
    const [expRange, setExpRange] = useState(0);
    const [priceRange, setPriceRange] = useState(500);
    const [availability, setAvailability] = useState('Anytime');
    const [verifiedOnly, setVerifiedOnly] = useState(false);

    // View state
    const [viewMode, setViewMode] = useState('grid');

    // Applied Filters state (updates only on "Apply Filters")
    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        specialty: '',
        minRating: 0,
        expRange: 0,
        priceRange: 3000,
        availability: 'Anytime',
        verifiedOnly: false,
    });

    const handleApplyFilters = () => {
        setAppliedFilters({
            search,
            specialty,
            minRating,
            expRange: Number(expRange),
            priceRange: Number(priceRange),
            availability,
            verifiedOnly,
        });
    };

    const handleResetFilters = () => {
        setSearch('');
        setSpecialty('');
        setMinRating(0);
        setExpRange(0);
        setPriceRange(3000);
        setAvailability('Anytime');
        setVerifiedOnly(false);
        setAppliedFilters({
            search: '',
            specialty: '',
            minRating: 0,
            expRange: 0,
            priceRange: 3000,
            availability: 'Anytime',
            verifiedOnly: false,
        });
    };

    // Derived State
    const filteredDoctors = doctors.filter(doctor => {
        if (appliedFilters.search && !doctor.name.toLowerCase().includes(appliedFilters.search.toLowerCase())) return false;
        if (appliedFilters.specialty && doctor.specialty !== appliedFilters.specialty) return false;
        if (doctor.rating < appliedFilters.minRating) return false;
        if (doctor.experience < appliedFilters.expRange) return false;
        if (doctor.fee > appliedFilters.priceRange) return false;
        if (appliedFilters.verifiedOnly && !doctor.verified) return false;
        if (appliedFilters.availability === 'Available Today' && !doctor.availableToday) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Header / Navbar */}
            <Navbar />

            {/* Find Doctors Page */}

            {/* Page Header */}
            <section className="bg-gradient-to-r from-[#01579B] to-[#0277BD] text-white py-16">
                <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-[fadeIn_0.5s_ease-out]">Find Your Doctor</h1>
                    <p className="text-[#B3E5FC] text-lg md:text-xl max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                        Browse through our network of verified healthcare specialists
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12 animate-[fadeIn_0.5s_ease-out_0.4s_both]">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Panel */}
                    <aside className="w-full lg:w-[360px] shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 sticky top-24 border border-gray-100 min-h-[700px]">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h2 className="text-xl font-bold text-[#01579B]">Filters</h2>
                                <button onClick={handleResetFilters} className="text-sm text-[#028090] hover:text-[#00A896] font-medium transition-colors">Reset All</button>
                            </div>

                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Search Doctors</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Name or keyword..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5] text-sm transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Specialization */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                                    <select
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#039BE5] focus:ring-1 focus:ring-[#039BE5] text-sm text-gray-700 bg-white"
                                    >
                                        <option value="">All Specialties</option>
                                        <option value="Cardiologist">Cardiologist</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Orthopedic">Orthopedic Surgeon</option>
                                    </select>
                                </div>

                                {/* Minimum Rating */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                onClick={() => setMinRating(star)}
                                                className={`text-xl transition-colors ${minRating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <span className="text-sm text-gray-500 ml-2">& Up</span>
                                    </div>
                                </div>

                                {/* Experience Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">Experience</label>
                                        <span className="text-xs font-bold text-[#028090]">{expRange}+ Years</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        value={expRange}
                                        onChange={(e) => setExpRange(e.target.value)}
                                        className="w-full accent-[#028090]"
                                    />
                                </div>

                                {/* Consultation Fee Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">Consultation Fee</label>
                                        <span className="text-xs font-bold text-[#028090]">Up to ₹{priceRange}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        step="10"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full accent-[#028090]"
                                    />
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                                    <select
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#039BE5] bg-white text-sm text-gray-700"
                                    >
                                        <option>Anytime</option>
                                        <option>Available Today</option>
                                        <option>Available Tomorrow</option>
                                        <option>This Week</option>
                                    </select>
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={verifiedOnly}
                                            onChange={(e) => setVerifiedOnly(e.target.checked)}
                                            className="w-4 h-4 rounded text-[#028090] focus:ring-[#028090] accent-[#028090]"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-[#028090] transition-colors">Verified Doctors Only</span>
                                    </label>
                                </div>

                                <button
                                    onClick={handleApplyFilters}
                                    className="w-full bg-[#028090] hover:bg-[#00A896] text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-105 mt-6"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Doctors Grid */}
                    <div className="w-full flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            {/* Doctors Found Count */}
                            <p className="text-gray-600 font-medium">
                                <span className="font-bold text-[#01579B]">{filteredDoctors.length}</span> doctors found
                            </p>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* View Mode Toggle */}
                                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#E1F5FE] text-[#0277BD]' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="Grid View"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#E1F5FE] text-[#0277BD]' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="List View"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Doctors Grid View / List View */}
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-6"}>
                            {filteredDoctors.map((doctor, index) => (
                                /* Doctor Card */
                                <div
                                    key={doctor.id}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className={`cursor-pointer animate-[fadeIn_0.5s_ease-out_both] bg-white rounded-2xl shadow-md border border-gray-50 p-6 hover:shadow-xl hover:border-[#B3E5FC] transition-all duration-300 group ${viewMode === 'grid' ? 'flex flex-col h-full hover:scale-[1.03] hover:-translate-y-1.5' : 'flex flex-col sm:flex-row gap-8 items-center hover:scale-[1.01] hover:-translate-x-1'}`}
                                >

                                    <div className={`flex gap-4 items-start ${viewMode === 'grid' ? 'mb-4' : 'w-full sm:w-1/3'}`}>
                                        <div className="relative w-20 h-20 shrink-0">
                                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" />
                                            {doctor.verified && (
                                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 shadow-sm">
                                                    <div className="bg-[#00A896] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold" title="Verified Doctor">
                                                        ✓
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-bold text-[#01579B] group-hover:text-[#039BE5] transition-colors">{doctor.name}</h3>
                                            <p className="text-[#028090] font-medium text-sm mb-1">{doctor.specialty}</p>
                                            <div className="flex items-center gap-1 text-sm">
                                                <span className="text-yellow-400">★</span>
                                                <span className="font-bold text-gray-700">{doctor.rating}</span>
                                                <span className="text-gray-400">({doctor.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`space-y-2 ${viewMode === 'grid' ? 'mb-6 flex-grow' : 'w-full sm:w-1/3'}`}>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="text-[#039BE5]">🏥</span> {doctor.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="text-[#039BE5]">🎓</span> {doctor.experience} Years Experience
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="text-[#039BE5]">🕒</span> {doctor.hours}
                                        </div>
                                    </div>

                                    <div className={`flex flex-col ${viewMode === 'grid' ? 'mt-auto' : 'w-full sm:w-1/3'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="text-[#039BE5]">💲</span> <span className="font-bold text-[#028090]">₹{doctor.fee}</span> Consultation Fee
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {doctor.availableToday && (
                                                <span className="bg-[#E6F4EA] text-[#00A896] text-xs font-bold px-3 py-1 rounded-full border border-[#00A896]/20">
                                                    Available Today
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-4 pt-6 mt-auto">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); navigate(`/doctors/${doctor.id}`); }} 
                                                className="flex-1 bg-white border-2 border-[#028090] text-[#028090] hover:bg-gray-50 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 mb-0.5"
                                            >
                                                View Profile
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleProtectedAction(e, `/booking/${doctor.id}`); }} 
                                                className="flex-1 bg-[#028090] hover:bg-[#00A896] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 mb-0.5"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Preview Modal */}
            {selectedDoctor && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
                    onClick={() => setSelectedDoctor(null)}
                >
                    <div 
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-[scaleIn_0.3s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedDoctor(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        
                        <div className="flex flex-col items-center flex-grow text-center">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md mb-4 border-2 border-white ring-4 ring-[#E1F5FE]">
                                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#01579B] mt-2">{selectedDoctor.name}</h2>
                            <p className="text-[#028090] font-medium text-md mb-4">{selectedDoctor.specialty}</p>
                            
                            <div className="flex items-center gap-2 mb-6 bg-[#F8FAFC] px-5 py-2.5 rounded-full border border-gray-100 shadow-sm">
                                <span className="text-yellow-400 text-lg leading-none">★</span>
                                <span className="font-bold text-gray-700 leading-none">{selectedDoctor.rating}</span>
                                <span className="text-gray-400 text-sm leading-none">({selectedDoctor.reviews})</span>
                                <span className="text-gray-300 mx-1 leading-none">|</span>
                                <span className="text-gray-600 font-medium text-sm leading-none">{selectedDoctor.experience} Yrs Exp.</span>
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md">
                                Dr. {selectedDoctor.name.split(' ').pop()} is a highly rated {selectedDoctor.specialty.toLowerCase()} dedicated to providing exceptional care. With over {selectedDoctor.experience} years of clinical experience, they specialize in offering comprehensive and patient-centered treatments.
                            </p>
                            
                            <div className="w-full flex gap-3">
                                <button 
                                    onClick={() => navigate(`/doctors/${selectedDoctor.id}`)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gray-50 text-[#0277BD] border border-gray-200 hover:border-[#0277BD] hover:bg-[#E1F5FE] transition-colors"
                                >
                                    View Full Profile
                                </button>
                                <button 
                                    onClick={(e) => handleProtectedAction(e, `/booking/${selectedDoctor.id}`)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-[#028090] hover:bg-[#00A896] text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Section (Minimal copy for routing pages) */}
            <Footer />
        </div>
    );
};

export default FindDoctors;
