import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Pill, Plus, Search, X, Calendar, User } from 'lucide-react';

const Prescriptions = () => {
    const { prescriptions, addPrescription, updatePrescription } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Modal Form State
    const [patientName, setPatientName] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);

    const filteredPrescriptions = prescriptions.filter(p => 
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingId(null);
        setPatientName('');
        setDiagnosis('');
        setNotes('');
        setMedicines([{ name: '', dosage: '', duration: '' }]);
        setIsModalOpen(true);
    };

    const openEditModal = (prescription) => {
        setEditingId(prescription.id);
        setPatientName(prescription.patientName);
        setDiagnosis(prescription.diagnosis);
        setNotes(prescription.notes || '');
        setMedicines(prescription.medicines.length > 0 ? [...prescription.medicines] : [{ name: '', dosage: '', duration: '' }]);
        setIsModalOpen(true);
    };

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMeds = [...medicines];
        newMeds[index][field] = value;
        setMedicines(newMeds);
    };

    const handleRemoveMedicine = (index) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((_, i) => i !== index));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (!patientName.trim() || !diagnosis.trim() || medicines.some(m => !m.name.trim())) {
            alert('Please fill all required fields');
            return;
        }

        const newPrescriptionData = {
            patientName,
            diagnosis,
            medicines: medicines.filter(m => m.name.trim() !== ''),
            notes
        };

        if (editingId) {
            updatePrescription(editingId, newPrescriptionData);
        } else {
            newPrescriptionData.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            addPrescription(newPrescriptionData);
        }
        
        // Reset form
        setPatientName('');
        setDiagnosis('');
        setNotes('');
        setMedicines([{ name: '', dosage: '', duration: '' }]);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-[1400px] mx-auto space-y-6">
                
                {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Prescriptions</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and create prescriptions for patients</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-[#0277BD] hover:bg-[#01579B] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                    <Plus className="w-5 h-5" /> Create Prescription
                </button>
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

            {/* PRESCRIPTIONS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map(p => (
                        <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all">
                            
                            {/* TOP: Patient & Date */}
                            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                <div className="min-w-0">
                                    <h3 className="font-black text-gray-900 text-lg truncate mb-1">{p.patientName}</h3>
                                    <p className="text-sm font-semibold text-[#0277BD] truncate">{p.diagnosis}</p>
                                </div>
                                <div className="text-right shrink-0 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                    <p className="text-xs font-bold text-[#01579B] uppercase tracking-wider">{p.date}</p>
                                </div>
                            </div>

                            {/* MIDDLE: Medicines Preview */}
                            <div className="flex-1 mb-5 bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Pill className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prescribed Specs</span>
                                </div>
                                <ul className="space-y-3">
                                    {p.medicines.slice(0, 3).map((med, idx) => (
                                        <li key={idx} className="flex justify-between items-start text-sm">
                                            <span className="font-bold text-gray-800">{med.name}</span>
                                            <div className="text-right">
                                                <span className="block text-gray-500 font-medium text-xs">{med.dosage}</span>
                                                <span className="block text-emerald-600 font-bold text-[10px] uppercase mt-0.5">{med.duration}</span>
                                            </div>
                                        </li>
                                    ))}
                                    {p.medicines.length > 3 && (
                                        <li className="text-xs font-bold text-[#0277BD] pt-2">
                                            + {p.medicines.length - 3} more medicines
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* BOTTOM: Action */}
                            <button 
                                onClick={() => openEditModal(p)}
                                className="w-full bg-white border-2 border-gray-100 hover:border-[#0277BD] text-gray-600 hover:text-[#0277BD] p-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                            >
                                View / Edit
                            </button>

                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Pill className="w-8 h-8 text-[#0277BD]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">No Prescriptions Found</h3>
                        <p className="text-gray-500 font-medium">Could not find any prescriptions matching your search.</p>
                    </div>
                )}
            </div>
        </div>

            {/* CREATE MODAL */}
            {isModalOpen && (
                <div className="fixed top-16 inset-x-0 bottom-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-xl w-[90%] max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden shadow-xl animate-[slideUp_0.3s_ease-out]">
                        
                        {/* Modal Header */}
                        <div className="px-6 md:px-8 pt-6 pb-4 flex justify-between items-center bg-white border-b border-gray-50">
                            <h2 className="text-xl font-bold text-[#1f2937]">{editingId ? 'Edit Prescription' : 'New Prescription'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 md:px-8 py-5 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Patient Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select 
                                            value={patientName}
                                            onChange={e => setPatientName(e.target.value)}
                                            className="w-full border border-gray-200 bg-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0277BD] focus:ring-1 focus:ring-[#0277BD] font-medium text-gray-800 appearance-none"
                                        >
                                            <option value="" disabled>Select patient...</option>
                                            <option value="John Doe">John Doe</option>
                                            <option value="Emma Wilson">Emma Wilson</option>
                                            <option value="David Chen">David Chen</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Diagnosis</label>
                                    <input 
                                        type="text" 
                                        value={diagnosis}
                                        onChange={e => setDiagnosis(e.target.value)}
                                        placeholder="e.g. Hypertension"
                                        className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0277BD] focus:ring-1 focus:ring-[#0277BD] font-medium text-gray-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Medicines</label>
                                    <button onClick={handleAddMedicine} className="text-xs font-bold text-[#0277BD] hover:underline transition-colors">
                                        + Add Medicine
                                    </button>
                                </div>
                                
                                <div className="space-y-2.5">
                                    {medicines.map((med, index) => (
                                        <div key={index} className="flex flex-row items-center gap-2 md:gap-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                                            <div className="w-[40%]">
                                                <input 
                                                    type="text" placeholder="Medicine Name" 
                                                    value={med.name} onChange={e => handleMedicineChange(index, 'name', e.target.value)}
                                                    className="w-full border border-gray-200 bg-white rounded flex-1 px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                                />
                                            </div>
                                            <div className="w-[30%]">
                                                <input 
                                                    type="text" placeholder="Dosage" 
                                                    value={med.dosage} onChange={e => handleMedicineChange(index, 'dosage', e.target.value)}
                                                    className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                                />
                                            </div>
                                            <div className="w-[20%]">
                                                <input 
                                                    type="text" placeholder="Duration" 
                                                    value={med.duration} onChange={e => handleMedicineChange(index, 'duration', e.target.value)}
                                                    className="w-full border border-gray-200 bg-white rounded px-3 py-1.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0277BD]"
                                                />
                                            </div>
                                            <div className="flex-shrink-0 flex items-center justify-center">
                                                <button 
                                                    onClick={() => handleRemoveMedicine(index)}
                                                    className={`p-1.5 rounded transition-colors ${medicines.length > 1 ? 'text-red-400 hover:bg-red-50 hover:text-red-500' : 'text-gray-300 cursor-not-allowed'}`}
                                                    disabled={medicines.length === 1}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Additional Notes</label>
                                <textarea 
                                    rows="2" 
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Add any specific instructions for the patient..."
                                    className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0277BD] focus:ring-1 focus:ring-[#0277BD] font-medium text-gray-800 resize-none"
                                ></textarea>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 md:px-8 py-4 bg-white border-t border-gray-50 flex justify-end gap-3 shrink-0">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 font-bold hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="bg-[#0277BD] hover:bg-[#01579B] text-white px-5 py-2 text-sm font-bold rounded-lg transition-colors"
                            >
                                Save Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Prescriptions;
