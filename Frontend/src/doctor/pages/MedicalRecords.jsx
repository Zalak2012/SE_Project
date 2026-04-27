import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronRight, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const MedicalRecords = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const res = await apiFetch("/api/medical-records");
            if (res.ok) {
                setMedicalRecords(await res.json());
            }
        } catch (err) {
            console.error("Records fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const filteredRecords = medicalRecords.filter(record => 
        record.patientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name) => {
        if (!name) return "??";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#028090] animate-spin" />
            <p className="text-gray-500 mt-4 font-medium italic">Loading medical database...</p>
        </div>
    );

    return (
        <>
            <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-[1400px] mx-auto space-y-6 pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Medical Records</h1>
                        <p className="text-gray-500 font-medium mt-1">View and manage patient medical history and reports</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Search by patient name or title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 font-medium placeholder-gray-400"
                    />
                </div>

                <div className="space-y-4">
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map(record => (
                            <div key={record._id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-[#f0f9ff] text-[#0ea5e9] flex items-center justify-center font-bold text-xl border border-[#bae6fd]">
                                        {getInitials(record.patientId?.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 text-lg truncate">{record.patientId?.name || "Unknown Patient"}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm font-semibold text-gray-500 truncate">{record.title}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/3 text-left md:px-4 border-l-0 md:border-l border-gray-100">
                                    <p className="text-sm font-bold text-gray-800 mb-1">{new Date(record.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2">{record.description}</p>
                                </div>

                                <div className="w-full md:w-1/4 flex items-center justify-between md:justify-end gap-4 shrink-0 mt-2 md:mt-0">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                        record.status === 'Recovered' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                                            : 'bg-orange-50 text-orange-700 border-orange-200/50'
                                    }`}>
                                        {record.status === 'Recovered' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                        {record.status}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedRecord(record)}
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">No Records Found</h3>
                            <p className="text-gray-500 font-medium">Could not find any medical records matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedRecord && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]">
                        <div className="px-6 md:px-8 py-5 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Record Details</h2>
                            <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold">×</button>
                        </div>

                        <div className="px-6 md:px-8 py-6 overflow-y-auto flex-1 space-y-6">
                            <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl shadow-sm border border-blue-200">
                                    {getInitials(selectedRecord.patientId?.name)}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg">{selectedRecord.patientId?.name || "Patient"}</h3>
                                    <p className="text-sm font-bold text-blue-600 mt-0.5 uppercase tracking-wider">Condition: {selectedRecord.condition}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Clinical Description</h4>
                                <p className="text-gray-700 font-medium leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">{selectedRecord.description}</p>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedRecord(null)}
                                className="bg-[#1f2937] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#111827] transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicalRecords;
