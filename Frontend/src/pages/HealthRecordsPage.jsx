import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// ─── Static seed data ────────────────────────────────────────────────────────
const SEED_CONDITIONS = [
    { id: 1, condition: 'Type 2 Diabetes', diagnosedDate: 'Jan 2020', status: 'Active', icon: '🩸', notes: 'Managed with Metformin 500mg twice daily.' },
    { id: 2, condition: 'Hypertension', diagnosedDate: 'Mar 2019', status: 'Active', icon: '💓', notes: 'Diet-controlled + Amlodipine 5mg.' },
    { id: 3, condition: 'Seasonal Allergy', diagnosedDate: 'Apr 2022', status: 'Recovered', icon: '🤧', notes: 'Resolved with antihistamine course.' },
];

const SEED_PRESCRIPTIONS = [
    {
        id: 1, doctor: 'Dr. Sarah Mitchell', specialty: 'Cardiologist', date: 'Mar 15, 2026',
        medicines: [
            { name: 'Amlodipine', dose: '5mg', freq: 'Once daily (Morning)' },
            { name: 'Aspirin', dose: '75mg', freq: 'Once daily (After food)' },
        ]
    },
    {
        id: 2, doctor: 'Dr. James Wilson', specialty: 'Endocrinologist', date: 'Feb 10, 2026',
        medicines: [
            { name: 'Metformin', dose: '500mg', freq: 'Twice daily (After food)' },
            { name: 'Vitamin B12', dose: '1000mcg', freq: 'Once daily' },
        ]
    },
];

const SEED_REPORTS = [
    { id: 1, name: 'Complete Blood Count (CBC)', date: 'Mar 18, 2026', status: 'Completed', lab: 'CityLab Diagnostics' },
    { id: 2, name: 'HbA1c', date: 'Feb 12, 2026', status: 'Completed', lab: 'HealthPlus Labs' },
    { id: 3, name: 'Lipid Panel', date: 'Jan 05, 2026', status: 'Pending', lab: 'QuickTest Centre' },
];

// ─── Helper components ────────────────────────────────────────────────────────
const EmptyState = ({ icon, title, subtitle, ctaLabel, onCta }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">{icon}</div>
        <p className="text-base font-bold text-gray-600">{title}</p>
        <p className="text-sm text-gray-400 max-w-xs">{subtitle}</p>
        {ctaLabel && (
            <button onClick={onCta} className="mt-2 px-6 py-2.5 bg-[#028090] text-white font-bold rounded-xl text-sm hover:bg-[#00A896] transition-colors shadow-md">
                {ctaLabel}
            </button>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-amber-50 text-amber-700 border-amber-200',
        Recovered: 'bg-green-50 text-green-700 border-green-200',
        Completed: 'bg-green-50 text-green-700 border-green-200',
        Pending: 'bg-blue-50 text-blue-600 border-blue-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {status}
        </span>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const HealthRecordsPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'history');
    const { currentUser } = useAuth();
    const [conditions, setConditions] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reports] = useState(SEED_REPORTS);
    const [documents, setDocuments] = useState([]);
    const [expandedPrescription, setExpandedPrescription] = useState(null);
    const [toast, setToast] = useState('');
    const fileInputRef = useRef(null);

        useEffect(() => {
        if (!currentUser) return;
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const id = currentUser.userId || currentUser._id;
                const [rRes, pRes] = await Promise.all([
                    apiFetch(`/api/medical-records/patient/${id}`),
                    apiFetch(`/api/prescriptions/patient/${id}`)
                ]);
                if (rRes.ok) setConditions(await rRes.json());
                if (pRes.ok) setPrescriptions(await pRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [currentUser]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newDocs = files.map(f => ({
            id: Date.now() + Math.random(),
            name: f.name,
            size: (f.size / 1024).toFixed(1) + ' KB',
            type: f.type,
            uploadedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            url: URL.createObjectURL(f),
        }));
        setDocuments(prev => [...newDocs, ...prev]);
        showToast(`✅ ${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
        e.target.value = '';
    };

    const handleDeleteDoc = (id) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
        showToast('🗑️ Document removed');
    };

    // Summary stats
    const stats = [
        { label: 'Active Conditions', value: conditions.filter(c => c.status === 'Active').length, icon: '💓', color: 'bg-red-50 text-red-600' },
        { label: 'Total Reports', value: reports.length, icon: '🔬', color: 'bg-blue-50 text-blue-600' },
        { label: 'Prescriptions', value: prescriptions.length, icon: '💊', color: 'bg-purple-50 text-purple-600' },
        { label: 'Documents', value: documents.length, icon: '📄', color: 'bg-green-50 text-green-600' },
    ];

    const tabs = [
        { id: 'history', label: 'Medical History', icon: '🏥' },
        { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
        { id: 'reports', label: 'Lab Reports', icon: '🔬' },
        { id: 'documents', label: 'Documents', icon: '📄' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col w-full">
            <Navbar />

            {/* Toast */}
            <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 ${toast ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-100 font-bold text-gray-800">{toast}</div>
            </div>

            <main className="flex-grow flex flex-col items-center p-4 py-10 w-full max-w-5xl mx-auto space-y-8">

                {/* ── PAGE HEADER ── */}
                <header className="w-full space-y-2 animate-[fadeIn_0.4s_ease-out_both]">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Health Records</h1>
                    <p className="text-gray-500 font-medium text-lg">View and manage your medical history and reports.</p>
                </header>

                {/* ── SUMMARY STAT CARDS ── */}
                <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 animate-[slideUp_0.4s_ease-out_both]">
                    {stats.map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                                <p className="text-xs text-gray-500 font-semibold leading-tight">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── TABS ── */}
                <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[slideUp_0.5s_ease-out_both]">

                    {/* Tab bar */}
                    <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'border-[#028090] text-[#028090] bg-[#f0fdfc]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-6 md:p-8 min-h-[300px]">

                        {/* ══ MEDICAL HISTORY ══ */}
                        {activeTab === 'history' && (
                            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out_both]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Medical History</h2>
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">{conditions.length} condition{conditions.length !== 1 ? 's' : ''}</span>
                                </div>
                                {conditions.length === 0 ? (
                                    <EmptyState icon="🏥" title="No conditions recorded" subtitle="Your medical history will appear here." />
                                ) : (
                                    conditions.map(c => (
                                        <div key={c._id || c.id} className="group flex items-start gap-5 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl shrink-0">{c.icon || '🏥'}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                                    <h3 className="font-bold text-gray-900 text-base group-hover:text-[#01579B] transition-colors">{c.title || c.condition}</h3>
                                                    <StatusBadge status={c.status} />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 font-semibold">Date: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : c.diagnosedDate}</p>
                                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{c.description || c.notes}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* ══ PRESCRIPTIONS ══ */}
                        {activeTab === 'prescriptions' && (
                            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out_both]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Prescriptions</h2>
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">{prescriptions.length} total</span>
                                </div>
                                {prescriptions.length === 0 ? (
                                    <EmptyState icon="💊" title="No prescriptions yet" subtitle="Your prescriptions from doctors will appear here." />
                                ) : (
                                    prescriptions.map(p => (
                                        <div key={p._id || p.id} className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                            {/* Header */}
                                            <button
                                                onClick={() => setExpandedPrescription(expandedPrescription === (p._id || p.id) ? null : (p._id || p.id))}
                                                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm shrink-0">
                                                        {p.doctorId?.name || "Doctor".split(' ').slice(1).map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="font-bold text-gray-900 text-sm">{p.doctorId?.name || "Doctor"}</h3>
                                                        <p className="text-xs text-gray-500">{p.doctorId?.specialty || p.doctorId?.specialization || "Specialist"} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Date"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-[#028090] bg-[#f0fdfc] px-2.5 py-1 rounded-full border border-[#028090]/20">
                                                        {p.medicines?.length > 0 ? `${p.medicines.length} medicine${p.medicines.length > 1 ? 's' : ''}` : '1 medicine'}
                                                    </span>
                                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedPrescription === (p._id || p.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </button>

                                            {/* Medicines list */}
                                            {expandedPrescription === (p._id || p.id) && (
                                                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-3 animate-[fadeIn_0.2s_ease-out_both]">
                                                                                        {(p.medicines || []).length > 0 ? (
                                                            p.medicines.map((med, idx) => (
                                                                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 mb-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-sm">💊</div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-900 text-sm">{med.name}</p>
                                                                            <p className="text-xs text-gray-500">{p.notes}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-sm font-black text-[#028090] bg-[#f0fdfc] px-3 py-1.5 rounded-lg border border-[#028090]/20">{med.dosage || med.dose}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-sm">💊</div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 text-sm">{p.medicineName || "Unknown Medicine"}</p>
                                                                        <p className="text-xs text-gray-500">{p.notes}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="text-sm font-black text-[#028090] bg-[#f0fdfc] px-3 py-1.5 rounded-lg border border-[#028090]/20">{p.dosage || "N/A"}</span>
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* ══ LAB REPORTS ══ */}
                        {activeTab === 'reports' && (
                            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out_both]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Lab Reports</h2>
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">{reports.length} reports</span>
                                </div>
                                {reports.length === 0 ? (
                                    <EmptyState icon="🔬" title="No lab reports yet" subtitle="Reports from booked lab tests will appear here." />
                                ) : (
                                    reports.map(r => (
                                        <div key={r.id} className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all flex-wrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">🔬</div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#01579B] transition-colors">{r.name}</h3>
                                                    <p className="text-xs text-gray-400 mt-0.5">{r.lab} • {r.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StatusBadge status={r.status} />
                                                {r.status === 'Completed' && (
                                                    <button
                                                        onClick={() => showToast('📥 Report download started')}
                                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#028090] bg-[#f0fdfc] hover:bg-[#028090] hover:text-white border border-[#028090]/20 rounded-xl transition-all"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        Download
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* ══ DOCUMENTS ══ */}
                        {activeTab === 'documents' && (
                            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_both]">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">{documents.length} file{documents.length !== 1 ? 's' : ''}</span>
                                </div>

                                {/* Upload area */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-gray-200 hover:border-[#028090] hover:bg-[#f0fdfc] transition-all rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-[#e0f7f5] flex items-center justify-center text-3xl mb-3 transition-colors">📤</div>
                                    <p className="font-bold text-gray-600 group-hover:text-[#028090] transition-colors text-sm">Click to upload files</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10MB each</p>
                                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
                                </div>

                                {/* File list */}
                                {documents.length === 0 ? (
                                    <EmptyState icon="📁" title="No documents uploaded yet" subtitle="Upload prescriptions, reports, or medical certificates." ctaLabel="Upload Records" onCta={() => fileInputRef.current?.click()} />
                                ) : (
                                    <div className="space-y-3">
                                        {documents.map(doc => {
                                            const isPDF = doc.type === 'application/pdf' || doc.name.endsWith('.pdf');
                                            return (
                                                <div key={doc.id} className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors flex-wrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isPDF ? 'bg-red-50' : 'bg-blue-50'}`}>
                                                            {isPDF ? '📕' : '🖼️'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm truncate max-w-[200px] md:max-w-xs">{doc.name}</p>
                                                            <p className="text-xs text-gray-400">{doc.size} • {doc.uploadedAt}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a href={doc.url} download={doc.name}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#028090] bg-[#f0fdfc] hover:bg-[#028090] hover:text-white border border-[#028090]/20 rounded-lg transition-all"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                            Download
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteDoc(doc.id)}
                                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default HealthRecordsPage;
