import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, X, Calendar, User, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Modal Form State
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prRes, ptRes] = await Promise.all([
                apiFetch("/api/prescriptions"),
                apiFetch("/api/doctor/patients")
            ]);
            if (prRes.ok) setPrescriptions(await prRes.json());
            if (ptRes.ok) setPatients(await ptRes.json());
        } catch (err) {
            console.error("Prescriptions fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredPrescriptions = prescriptions.filter(p => 
        p.patientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingId(null);
        setSelectedPatientId('');
        setDiagnosis('');
        setNotes('');
        setMedicines([{ name: '', dosage: '', duration: '' }]);
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

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!selectedPatientId || !diagnosis.trim() || medicines.some(m => !m.name.trim())) {
            alert('Please fill all required fields');
            return;
        }

        const data = {
            patientId: selectedPatientId,
            diagnosis,
            medicines: medicines.filter(m => m.name.trim() !== ''),
            notes
        };

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/prescriptions/${editingId}` : "/api/prescriptions";
            
            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            }
        } catch (err) {
            console.error("Prescription save error:", err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#0277BD] animate-spin" />
            <p className="text-gray-500 mt-4 font-medium italic">Retrieving prescription records...</p>
        </div>
    );

    const openEditModal = (p) => {
        setEditingId(p._id);
        setSelectedPatientId(p.patientId?._id || '');
        setDiagnosis(p.diagnosis);
        setNotes(p.notes || '');
        setMedicines(p.medicines?.length > 0 ? [...p.medicines] : [{ name: '', dosage: '', duration: '' }]);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="animate-[fadeIn_0.5s_ease-out_both] max-w-[1400px] mx-auto space-y-6 pt-6">
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

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Search by patient or diagnosis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 font-medium placeholder-gray-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrescriptions.length > 0 ? (
                        filteredPrescriptions.map(p => (
                            <div key={p._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all border-b-4 border-b-[#0277BD]/20">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                    <div className="min-w-0">
                                        <h3 className="font-black text-gray-900 text-lg truncate mb-1">{p.patientId?.name || "Unknown Patient"}</h3>
                                        <p className="text-sm font-semibold text-[#0277BD] truncate">{p.diagnosis}</p>
                                    </div>
                                    <div className="text-right shrink-0 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-[#01579B] uppercase tracking-wider">{new Date(p.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex-1 mb-5 bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Pill className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Medicines</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {p.medicines?.slice(0, 3).map((med, idx) => (
                                            <li key={idx} className="flex justify-between items-start text-sm">
                                                <span className="font-bold text-gray-800">{med.name}</span>
                                                <div className="text-right">
                                                    <span className="block text-gray-500 font-medium text-xs">{med.dosage}</span>
                                                    <span className="block text-emerald-600 font-bold text-[10px] uppercase mt-0.5">{med.duration}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={() => openEditModal(p)}
                                    className="w-full bg-white border-2 border-gray-100 hover:border-[#0277BD] text-gray-600 hover:text-[#0277BD] p-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                                >
                                    Modify Prescription
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out] backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]">
                        <div className="px-6 md:px-8 py-5 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Modify Prescription' : 'New Prescription'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold">×</button>
                        </div>

                        <div className="px-6 md:px-8 py-6 overflow-y-auto flex-1 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Patient</label>
                                    <select 
                                        value={selectedPatientId}
                                        onChange={e => setSelectedPatientId(e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0277BD] font-medium"
                                    >
                                        <option value="">Choose a patient...</option>
                                        {patients.map(pt => (
                                            <option key={pt._id} value={pt._id}>{pt.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Diagnosis</label>
                                    <input 
                                        type="text" 
                                        value={diagnosis}
                                        onChange={e => setDiagnosis(e.target.value)}
                                        placeholder="e.g. Seasonal Allergy"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0277BD] font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Medications</label>
                                    <button onClick={handleAddMedicine} className="text-xs font-bold text-[#0277BD] hover:underline">+ Add Row</button>
                                </div>
                                <div className="space-y-3">
                                    {medicines.map((med, index) => (
                                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <input 
                                                placeholder="Medicine" 
                                                value={med.name} 
                                                onChange={e => handleMedicineChange(index, 'name', e.target.value)}
                                                className="flex-1 border-none bg-transparent focus:ring-0 text-sm font-bold placeholder-gray-400"
                                            />
                                            <input 
                                                placeholder="Dosage" 
                                                value={med.dosage} 
                                                onChange={e => handleMedicineChange(index, 'dosage', e.target.value)}
                                                className="w-24 border-none bg-transparent focus:ring-0 text-sm font-medium placeholder-gray-400"
                                            />
                                            <button onClick={() => handleRemoveMedicine(index)} className="text-red-400 hover:text-red-600 font-bold px-2">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-200 rounded-xl transition-all">Cancel</button>
                            <button onClick={handleSave} className="bg-[#0277BD] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#01579B] transition-all shadow-md">
                                {editingId ? 'Update' : 'Generate'} Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Prescriptions;
