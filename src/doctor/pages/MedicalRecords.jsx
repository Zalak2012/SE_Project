import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, FileText, ChevronRight, CheckCircle, Clock, X } from 'lucide-react';

const MedicalRecords = () => {
    const { medicalRecords } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);

    const filteredRecords = medicalRecords.filter(record => 
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-[1400px] mx-auto space-y-6">
                {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Medical Records</h1>
                    <p className="text-gray-500 font-medium mt-1">View and manage patient medical history and reports</p>
                </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400 ml-2" />
                <input 
                    type="text" 
                    placeholder="Search by patient name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 font-medium placeholder-gray-400"
                />
            </div>

            {/* RECORDS LIST */}
            <div className="space-y-4">
                {filteredRecords.length > 0 ? (
                    filteredRecords.map(record => (
                        <div key={record.id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            
                            {/* LEFT: Patient & Condition */}
                            <div className="flex items-center gap-4 w-full md:w-1/3 shrink-0">
                                <div className="w-14 h-14 rounded-full bg-[#f0f9ff] text-[#0ea5e9] flex items-center justify-center font-bold text-xl border border-[#bae6fd]">
                                    {record.initials}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-900 text-lg truncate">{record.patientName}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-semibold text-gray-500 truncate">{record.condition}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CENTER: Desc & Date */}
                            <div className="w-full md:w-1/3 text-left md:px-4 border-l-0 md:border-l border-gray-100">
                                <p className="text-sm font-bold text-gray-800 mb-1">{record.date}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">{record.description}</p>
                            </div>

                            {/* RIGHT: Status & Action */}
                            <div className="w-full md:w-1/4 flex items-center justify-between md:justify-end gap-4 shrink-0 mt-2 md:mt-0">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                    record.status === 'Resolved' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                                        : 'bg-orange-50 text-orange-700 border-orange-200/50'
                                }`}>
                                    {record.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
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

            {/* View Details Modal */}
            {selectedRecord && (
                <div className="fixed top-16 inset-x-0 bottom-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-xl w-[90%] max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden shadow-xl animate-[slideUp_0.3s_ease-out]">
                        
                        {/* Modal Header */}
                        <div className="px-6 md:px-8 pt-6 pb-4 flex justify-between items-center bg-white border-b border-gray-50">
                            <h2 className="text-xl font-bold text-[#1f2937]">Medical Record Details</h2>
                            <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 md:px-8 py-5 overflow-y-auto flex-1 custom-scrollbar space-y-5 flex flex-col">
                            
                            {/* Patient Info Header */}
                            <div className="flex items-center gap-4 p-4 bg-[#f0f9ff] rounded-lg border border-[#bae6fd]">
                                <div className="w-12 h-12 rounded-full bg-white text-[#0ea5e9] flex items-center justify-center font-bold text-xl shadow-sm">
                                    {selectedRecord.initials}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{selectedRecord.patientName}</h3>
                                    <p className="text-sm font-semibold text-gray-500 mt-0.5">Recorded on {selectedRecord.date}</p>
                                </div>
                            </div>
                            
                            {/* Record Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Condition / Diagnosis</h4>
                                    <p className="font-bold text-gray-800 text-sm md:text-base">{selectedRecord.condition}</p>
                                </div>
                                <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 flex flex-col justify-center">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Current Status</h4>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border w-fit ${
                                        selectedRecord.status === 'Resolved' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                                            : 'bg-orange-50 text-orange-700 border-orange-200/50'
                                    }`}>
                                        {selectedRecord.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                        {selectedRecord.status}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 mt-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Clinical Description & Notes</h4>
                                <p className="text-gray-700 text-sm font-medium leading-relaxed">{selectedRecord.description}</p>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 md:px-8 py-4 bg-white border-t border-gray-50 flex justify-end shrink-0">
                            <button 
                                onClick={() => setSelectedRecord(null)}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 text-sm font-bold rounded-lg transition-colors"
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
