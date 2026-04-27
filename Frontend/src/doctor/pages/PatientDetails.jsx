import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('history');
    const [loading, setLoading] = useState(true);
    
    const [records, setRecords] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    
    const [isAddRecordModal, setIsAddRecordModal] = useState(false);
    const [isAddPrescriptionModal, setIsAddPrescriptionModal] = useState(false);
    
    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const [pRes, rRes, prRes] = await Promise.all([
                apiFetch(`/api/users/${id}`),
                apiFetch(`/api/medical-records/patient/${id}`),
                apiFetch(`/api/prescriptions/patient/${id}`)
            ]);

            if (pRes.ok) setPatient(await pRes.json());
            if (rRes.ok) setRecords(await rRes.json());
            if (prRes.ok) setPrescriptions(await prRes.json());
        } catch (err) {
            console.error("Patient data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchPatientData();
    }, [id]);

    const handleAddRecord = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = {
            patientId: id,
            title: fd.get('title'),
            condition: fd.get('condition'),
            description: fd.get('description'),
            status: fd.get('status')
        };
        
        try {
            const res = await apiFetch("/api/medical-records", {
                method: "POST",
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setIsAddRecordModal(false);
                fetchPatientData(); // Refresh list
            }
        } catch (err) {
            console.error("Record creation error:", err);
        }
    };

    const handleAddPrescription = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = {
            patientId: id,
            medicineName: fd.get('medicine'),
            dosage: fd.get('dosage'),
            notes: fd.get('notes')
        };
        
        try {
            const res = await apiFetch("/api/prescriptions", {
                method: "POST",
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setIsAddPrescriptionModal(false);
                fetchPatientData(); // Refresh list
            }
        } catch (err) {
            console.error("Prescription creation error:", err);
        }
    };

    if (loading || !patient) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
            <p className="text-gray-500 font-medium italic">Synchronizing patient metrics...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out_both] pb-12">
            <button 
                onClick={() => navigate('/doctor/patients')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#028090] font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Patients
            </button>

            {/* Patient Header */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#01579B] to-[#028090] rounded-2xl text-white flex items-center justify-center font-bold text-4xl shadow-sm shrink-0">
                    {patient.name?.charAt(0) || "P"}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-black text-gray-800">{patient.name}</h2>
                    <p className="text-gray-500 font-medium">{patient.email}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsAddRecordModal(true)}
                        className="bg-white border border-[#028090] text-[#028090] hover:bg-[#028090] hover:text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Record
                    </button>
                    <button 
                        onClick={() => setIsAddPrescriptionModal(true)}
                        className="bg-[#028090] hover:bg-[#01579B] text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Prescription
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 font-bold text-sm">
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-6 relative transition-colors ${activeTab === 'history' ? 'text-[#028090]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Medical History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#028090] shadow-[0_0_8px_#028090]" />}
                </button>
                <button 
                    onClick={() => setActiveTab('prescriptions')}
                    className={`pb-4 px-6 relative transition-colors ${activeTab === 'prescriptions' ? 'text-[#028090]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Prescriptions
                    {activeTab === 'prescriptions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#028090] shadow-[0_0_8px_#028090]" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
                {activeTab === 'history' && (
                    records.length > 0 ? records.map(record => (
                        <div key={record._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{record.title}</h3>
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-purple-100">{record.condition}</span>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${record.status === 'Recovered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    {record.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{record.description}</p>
                            <p className="text-xs text-gray-400 font-semibold mt-4">
                                {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    )) : <p className="text-center text-gray-500 py-8">No medical history records found.</p>
                )}

                {activeTab === 'prescriptions' && (
                    prescriptions.length > 0 ? prescriptions.map(pres => (
                        <div key={pres._id} className="bg-white rounded-2xl p-5 border border-indigo-50 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl shrink-0">💊</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800">{pres.medicineName}</h3>
                                <p className="text-sm font-semibold text-[#028090] mt-0.5">{pres.dosage}</p>
                                <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100">{pres.notes}</p>
                                <p className="text-xs text-gray-400 font-semibold mt-3">
                                    {new Date(pres.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-500 py-8">No active prescriptions found.</p>
                )}
            </div>

            {/* Modals */}
            {isAddRecordModal && (
                <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <form onSubmit={handleAddRecord} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">Add Medical Record</h3>
                            <button type="button" onClick={() => setIsAddRecordModal(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input name="title" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]" placeholder="e.g. General Consultation" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                                <input name="condition" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]" placeholder="e.g. Hypertension" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea name="description" required rows="3" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]" placeholder="Observation notes..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select name="status" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]">
                                    <option value="Active">Active</option>
                                    <option value="Monitored">Monitored</option>
                                    <option value="Recovered">Recovered</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAddRecordModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 bg-[#028090] text-white font-bold rounded-xl shadow-sm hover:bg-[#01579B] transition-colors">Save Record</button>
                        </div>
                    </form>
                </div>
            )}

            {isAddPrescriptionModal && (
                <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <form onSubmit={handleAddPrescription} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-lg">Add Prescription</h3>
                            <button type="button" onClick={() => setIsAddPrescriptionModal(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Medicine Name</label>
                                <input name="medicine" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]" placeholder="e.g. Amoxicillin" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Dosage</label>
                                <input name="dosage" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]" placeholder="e.g. 500mg - Twice daily" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Notes / Instructions</label>
                                <textarea name="notes" rows="2" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#028090]" placeholder="e.g. Take after meals." />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAddPrescriptionModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 bg-[#028090] text-white font-bold rounded-xl shadow-sm hover:bg-[#01579B] transition-colors">Add Prescription</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PatientDetails;
