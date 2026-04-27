import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Pencil, X, Plus, Trash2, Save, MapPin, Clock, IndianRupee, Briefcase, GraduationCap, User as UserIcon } from 'lucide-react';

const DoctorProfilePage = () => {
    const { doctorProfile, updateDoctorProfile } = useData();
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [form, setForm] = useState({});

    const startEditing = () => {
        setForm({
            about: doctorProfile.about,
            experience: doctorProfile.experience,
            fee: doctorProfile.fee,
            availabilityDays: doctorProfile.availability.days,
            availabilityTime: doctorProfile.availability.time,
            address: doctorProfile.address,
            education: doctorProfile.education.map(e => ({ ...e })),
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = () => {
        updateDoctorProfile({
            about: form.about,
            experience: Number(form.experience),
            fee: Number(form.fee),
            availability: { days: form.availabilityDays, time: form.availabilityTime },
            address: form.address,
            education: form.education.filter(e => e.degree.trim() || e.institute.trim()),
        });
        setIsEditing(false);
    };

    const handleEduChange = (index, field, value) => {
        const updated = [...form.education];
        updated[index][field] = value;
        setForm(prev => ({ ...prev, education: updated }));
    };

    const addEducation = () => {
        if (form.education.length < 5) {
            setForm(prev => ({ ...prev, education: [...prev.education, { degree: '', institute: '' }] }));
        }
    };

    const removeEducation = (index) => {
        if (form.education.length > 1) {
            setForm(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-4xl mx-auto">

            {/* Header Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-[#B3E5FC] to-[#0277BD]/30 w-full relative"></div>

                <div className="px-6 md:px-8 pb-8">
                    {/* Avatar & Name Row */}
                    <div className="flex flex-col sm:flex-row gap-5 relative -mt-14 mb-6">
                        <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0 bg-white relative">
                            <img src={doctorProfile.image} alt={doctorProfile.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <div className="bg-[#00A896] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                    ✓
                                </div>
                            </div>
                        </div>

                        <div className="pt-14 sm:pt-2 flex-grow min-w-0">
                            <h1 className="text-2xl font-bold text-[#01579B]">{doctorProfile.name}</h1>
                            <p className="text-[#028090] font-medium">{doctorProfile.specialty}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                <span className="font-bold text-gray-700 text-sm">{doctorProfile.rating}</span>
                                <span className="text-gray-400 text-xs">({doctorProfile.reviews} reviews)</span>
                            </div>
                        </div>

                        {/* Edit / Save / Cancel Buttons */}
                        <div className="sm:pt-4 flex-shrink-0 flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={cancelEditing}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-[#0277BD] hover:bg-[#01579B] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        <Save className="w-4 h-4" /> Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={startEditing}
                                    className="bg-[#0277BD] hover:bg-[#01579B] text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
                                >
                                    <Pencil className="w-4 h-4" /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6 border-t border-gray-100 pt-6">

                        {/* Left Column: About & Education */}
                        <div className="md:col-span-2 space-y-6">

                            {/* About */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="text-[#0277BD]"><UserIcon className="w-5 h-5" /></span> About Doctor
                                </h2>
                                {isEditing ? (
                                    <textarea
                                        rows="4"
                                        value={form.about}
                                        onChange={e => setForm(prev => ({ ...prev, about: e.target.value }))}
                                        className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#0277BD] focus:ring-1 focus:ring-[#0277BD] resize-none leading-relaxed"
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm leading-relaxed">{doctorProfile.about}</p>
                                )}
                            </div>

                            {/* Education */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <span className="text-[#0277BD]"><GraduationCap className="w-5 h-5" /></span> Education & Training
                                    </h2>
                                    {isEditing && form.education.length < 5 && (
                                        <button onClick={addEducation} className="text-xs font-bold text-[#0277BD] hover:underline">
                                            + Add
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-2.5">
                                        {form.education.map((edu, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                <input
                                                    type="text"
                                                    placeholder="Degree"
                                                    value={edu.degree}
                                                    onChange={e => handleEduChange(idx, 'degree', e.target.value)}
                                                    className="flex-1 border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Institute"
                                                    value={edu.institute}
                                                    onChange={e => handleEduChange(idx, 'institute', e.target.value)}
                                                    className="flex-1 border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                                />
                                                <button
                                                    onClick={() => removeEducation(idx)}
                                                    className={`p-1.5 rounded transition-colors ${form.education.length > 1 ? 'text-red-400 hover:bg-red-50 hover:text-red-500' : 'text-gray-300 cursor-not-allowed'}`}
                                                    disabled={form.education.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ul className="space-y-2.5">
                                        {doctorProfile.education.map((edu, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-gray-600">
                                                <span className="text-[#00A896] font-bold mt-0.5">•</span>
                                                <span><span className="font-semibold text-gray-800">{edu.degree}</span>, {edu.institute}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Info Cards */}
                        <div className="space-y-4">

                            {/* Experience */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5" /> Experience
                                </p>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="number"
                                            value={form.experience}
                                            onChange={e => setForm(prev => ({ ...prev, experience: e.target.value }))}
                                            className="w-20 border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                        />
                                        <span className="text-sm text-gray-500 font-medium">Years</span>
                                    </div>
                                ) : (
                                    <p className="text-base font-bold text-gray-800">{doctorProfile.experience}+ Years</p>
                                )}
                            </div>

                            {/* Consultation Fee */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <IndianRupee className="w-3.5 h-3.5" /> Consultation Fee
                                </p>
                                {isEditing ? (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-sm font-bold text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={form.fee}
                                            onChange={e => setForm(prev => ({ ...prev, fee: e.target.value }))}
                                            className="w-24 border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-base font-bold text-[#028090]">₹{doctorProfile.fee}</p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Availability
                                </p>
                                {isEditing ? (
                                    <div className="space-y-2 mt-1">
                                        <input
                                            type="text"
                                            placeholder="Days (e.g. Mon-Fri)"
                                            value={form.availabilityDays}
                                            onChange={e => setForm(prev => ({ ...prev, availabilityDays: e.target.value }))}
                                            className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Time (e.g. 9 AM – 5 PM)"
                                            value={form.availabilityTime}
                                            onChange={e => setForm(prev => ({ ...prev, availabilityTime: e.target.value }))}
                                            className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-gray-800">{doctorProfile.availability.days}, {doctorProfile.availability.time}</p>
                                        <span className="inline-block mt-1.5 bg-[#E6F4EA] text-[#00A896] text-xs font-bold px-3 py-1 rounded-full border border-[#00A896]/20">
                                            Available Today
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Clinic Address */}
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" /> Clinic Address
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={form.address}
                                        onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD] mt-1"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-800">{doctorProfile.address}</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
