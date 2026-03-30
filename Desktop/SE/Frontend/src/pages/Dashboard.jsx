import React, { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

/* ─── Intersection Observer hook for scroll-reveal ─────────────────────── */
const useInView = (threshold = 0.15) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
};

/* ─── Animated counter ───────────────────────────────────────────────────── */
const AnimatedNum = ({ target, suffix = '', duration = 1200 }) => {
    const [val, setVal] = useState(0);
    const [ref, visible] = useInView();
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const id = setInterval(() => {
            start += step;
            if (start >= target) { setVal(target); clearInterval(id); }
            else setVal(start);
        }, 16);
        return () => clearInterval(id);
    }, [visible, target, duration]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ─── Circular progress ──────────────────────────────────────────────────── */
const CircleProgress = ({ pct, size = 100, stroke = 8, color = '#00A896', label }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const [ref, visible] = useInView();
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (!visible) return;
        let v = 0;
        const id = setInterval(() => { v += 2; if (v >= pct) { setProgress(pct); clearInterval(id); } else setProgress(v); }, 12);
        return () => clearInterval(id);
    }, [visible, pct]);
    const dash = (progress / 100) * circ;
    return (
        <div ref={ref} className="flex flex-col items-center gap-2">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.05s' }} />
            </svg>
            <span className="text-xs font-bold text-gray-500 -mt-1">{label}</span>
        </div>
    );
};

/* ─── Doctor Card ────────────────────────────────────────────────────────── */
const DoctorCard = ({ name, specialty, rating, initials, color }) => (
    <div className="group shrink-0 w-56 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
        <div className={`h-24 w-full flex items-center justify-center text-3xl font-black text-white ${color}`}>
            {initials}
        </div>
        <div className="p-4">
            <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
            <p className="text-xs text-[#028090] font-semibold mt-0.5">{specialty}</p>
            <div className="flex items-center gap-1 mt-2">
                {'★★★★★'.split('').map((s, i) => (
                    <span key={i} className={`text-xs ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                ))}
                <span className="text-xs text-gray-500 font-semibold ml-1">{rating}</span>
            </div>
            <Link to="/doctors" className="mt-3 block text-center py-2 bg-[#f0fdfc] hover:bg-[#028090] hover:text-white text-[#028090] text-xs font-bold rounded-lg transition-all">
                Book Now
            </Link>
        </div>
    </div>
);

/* ─── Doctor & Admin dashboards (untouched) ──────────────────────────────── */
const DoctorDashboard = () => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-grow w-full max-w-7xl mx-auto mt-8 mb-12 animate-[fadeIn_0.5s_ease-out_both] px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#028090]/10 text-[#028090] rounded-2xl flex items-center justify-center text-3xl font-bold">🩺</div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>
                <p className="text-gray-500">Manage your appointments and patient records.</p>
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {[['📅', "Today's Appointments", '12'], ['👥', 'Total Patients', '1,204'], ['⭐', 'Average Rating', '4.9']].map(([icon, label, val]) => (
                <div key={label} className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">{icon}</span>
                    <h3 className="font-bold text-gray-800">{label}</h3>
                    <p className="text-2xl font-bold text-[#028090] mt-2">{val}</p>
                </div>
            ))}
        </div>
    </div>
);

const AdminDashboard = () => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-grow w-full max-w-7xl mx-auto mt-8 mb-12 animate-[fadeIn_0.5s_ease-out_both] px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#039BE5]/10 text-[#039BE5] rounded-2xl flex items-center justify-center text-3xl font-bold">🛡️</div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                <p className="text-gray-500">System overview and management.</p>
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
            {[['👨‍⚕️', 'Active Doctors', '156'], ['👶', 'Active Patients', '8,920'], ['💳', 'Revenue Today', '₹45,000']].map(([icon, label, val]) => (
                <div key={label} className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">{icon}</span>
                    <h3 className="font-bold text-gray-800">{label}</h3>
                    <p className="text-2xl font-bold text-[#039BE5] mt-2">{val}</p>
                </div>
            ))}
        </div>
    </div>
);

/* ─── PREMIUM PATIENT DASHBOARD ──────────────────────────────────────────── */
const PatientDashboard = ({ userName }) => {
    const navigate = useNavigate();

    // Floating blob animations via CSS keyframes injected once
    const [actionsRef, actionsVisible] = useInView();
    const [statsRef, statsVisible] = useInView();
    const [doctorsRef, doctorsVisible] = useInView();
    const [timelineRef, timelineVisible] = useInView();

    const quickActions = [
        { icon: '📅', label: 'Appointments', sub: 'View & manage', path: '/appointments', grad: 'from-blue-500 to-blue-600' },
        { icon: '🧪', label: 'Lab Tests', sub: 'Book tests', path: '/lab-tests', grad: 'from-teal-500 to-emerald-500' },
        { icon: '📂', label: 'Health Records', sub: 'Medical history', path: '/records', grad: 'from-purple-500 to-violet-600' },
        { icon: '🔍', label: 'Find Doctors', sub: 'Book a visit', path: '/doctors', grad: 'from-rose-500 to-pink-500' },
    ];

    const statCards = [
        { icon: '💓', label: 'Health Score', value: 87, suffix: '%', color: '#00A896', ringColor: 'ring-teal-100' },
        { icon: '📅', label: 'Upcoming Appts', value: 3, suffix: '', color: '#0277BD', ringColor: 'ring-blue-100' },
        { icon: '🔬', label: 'Lab Reports', value: 5, suffix: '', color: '#7C3AED', ringColor: 'ring-purple-100' },
        { icon: '💊', label: 'Active Meds', value: 2, suffix: '', color: '#DB2777', ringColor: 'ring-pink-100' },
    ];

    const featuredDoctors = [
        { name: 'Dr. Sarah Mitchell', specialty: 'Cardiologist', rating: 4.9, initials: 'SM', color: 'bg-gradient-to-br from-[#0277BD] to-[#028090]' },
        { name: 'Dr. James Wilson', specialty: 'Neurologist', rating: 4.8, initials: 'JW', color: 'bg-gradient-to-br from-[#7C3AED] to-[#9333EA]' },
        { name: 'Dr. Priya Patel', specialty: 'Dermatologist', rating: 4.7, initials: 'PP', color: 'bg-gradient-to-br from-[#DB2777] to-[#E11D48]' },
    ];

    const recentActivity = [
        { icon: '📅', title: 'Appointment booked', detail: 'Dr. Sarah Mitchell – Cardiology', date: 'Mar 18, 2026', color: 'bg-blue-100 text-blue-600' },
        { icon: '🔬', title: 'Lab test completed', detail: 'Complete Blood Count (CBC)', date: 'Mar 15, 2026', color: 'bg-teal-100 text-teal-700' },
        { icon: '👤', title: 'Profile updated', detail: 'Contact information changed', date: 'Mar 10, 2026', color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <>
            {/* ══ HERO ═══════════════════════════════════════════════════════ */}
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#01579B] via-[#0277BD] to-[#028090] text-white">
                {/* Decorative animated blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-[#00A896]/20 rounded-full animate-[pulse_8s_ease-in-out_infinite_1s]" />
                <div className="absolute top-10 left-1/3 w-40 h-40 bg-white/5 rounded-full animate-[ping_6s_ease-in-out_infinite_0.5s]" />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#00A896]/15 rounded-full animate-[pulse_5s_ease-in-out_infinite_2s]" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28 flex flex-col items-center text-center animate-[fadeIn_0.6s_ease-out_both]">
                    {/* Greeting badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-[slideUp_0.5s_ease-out_0.1s_both]">
                        <span className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
                        Your personal health dashboard
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight animate-[slideUp_0.5s_ease-out_0.2s_both]">
                        Welcome back, <span className="text-[#80DEEA]">{userName}</span> 👋
                    </h1>
                    <p className="text-lg md:text-xl text-white/75 max-w-2xl mb-10 animate-[slideUp_0.5s_ease-out_0.3s_both]">
                        Here's your health overview for today. Stay on top of your wellbeing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-[slideUp_0.5s_ease-out_0.4s_both]">
                        <Link to="/doctors"
                            className="group bg-white text-[#01579B] hover:bg-[#00A896] hover:text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                            <span className="text-xl group-hover:animate-bounce">🩺</span> Find a Doctor
                        </Link>
                        <Link to="/ai-checker"
                            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2">
                            <span className="text-xl group-hover:animate-spin">🤖</span> AI Symptom Checker
                        </Link>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" className="fill-gray-50 w-full">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
                    </svg>
                </div>
            </div>

            {/* ══ QUICK ACTIONS ══════════════════════════════════════════════ */}
            <div ref={actionsRef} className={`w-full max-w-7xl mx-auto px-4 md:px-8 -mt-4 pb-8 transition-all duration-700 ${actionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((a, i) => (
                        <Link key={a.path} to={a.path}
                            style={{ transitionDelay: `${i * 80}ms` }}
                            className={`group relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col gap-3 ${actionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            {/* Gradient glow on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${a.grad} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.grad} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                {a.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#01579B] transition-colors">{a.label}</h3>
                                <p className="text-xs text-gray-400 font-medium">{a.sub}</p>
                            </div>
                            <div className="text-[#028090] text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Go <span>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ══ HEALTH SUMMARY ══════════════════════════════════════════════ */}
            <div ref={statsRef} className={`w-full max-w-7xl mx-auto px-4 md:px-8 py-8 transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#0277BD] to-[#028090] rounded-full inline-block" />
                    Health Summary
                </h2>

                <div className="grid lg:grid-cols-5 gap-5">

                    {/* ── LEFT: Big Health Score Card ── */}
                    <div className={`lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#01579B] via-[#0277BD] to-[#028090] text-white p-8 flex flex-col justify-between min-h-[260px] shadow-xl transition-all duration-700 ${statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        {/* decorative circles */}
                        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#00A896]/30 rounded-full" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">💓</div>
                                <span className="text-sm font-bold text-white/80 uppercase tracking-widest">Health Score</span>
                            </div>

                            {/* Score with large ring */}
                            <div className="flex items-center gap-6">
                                <div className="relative w-28 h-28 shrink-0">
                                    <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#00FFD1" strokeWidth="10"
                                            strokeDasharray={`${statsVisible ? (87 / 100) * 263.9 : 0} 263.9`}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dasharray 1.2s ease-out 0.3s' }} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-black leading-none">
                                            <AnimatedNum target={87} suffix="%" />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-4xl font-black mb-1">Good</p>
                                    <p className="text-white/70 text-sm font-medium leading-relaxed">Your health is in good shape. Keep it up!</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom tip */}
                        <div className="relative z-10 mt-6 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3">
                            <span className="text-xl">💡</span>
                            <p className="text-xs font-semibold text-white/85">Stay hydrated and complete your next check-up.</p>
                        </div>
                    </div>

                    {/* ── RIGHT: Metric Cards with Progress Bars ── */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: '📅', label: 'Upcoming Appointments', value: 3, max: 10, unit: 'scheduled',
                                grad: 'from-blue-500 to-cyan-500', bar: 'bg-gradient-to-r from-blue-400 to-cyan-400',
                                bg: 'bg-blue-50', text: 'text-blue-600', pct: 30
                            },
                            {
                                icon: '🔬', label: 'Lab Reports Ready', value: 5, max: 8, unit: 'available',
                                grad: 'from-violet-500 to-purple-600', bar: 'bg-gradient-to-r from-violet-400 to-purple-500',
                                bg: 'bg-violet-50', text: 'text-violet-600', pct: 62
                            },
                            {
                                icon: '💊', label: 'Active Medications', value: 2, max: 5, unit: 'ongoing',
                                grad: 'from-rose-500 to-pink-500', bar: 'bg-gradient-to-r from-rose-400 to-pink-400',
                                bg: 'bg-rose-50', text: 'text-rose-600', pct: 40
                            },
                            {
                                icon: '🏃', label: 'Wellness Goals', value: 68, max: 100, unit: '% complete',
                                grad: 'from-emerald-500 to-teal-500', bar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
                                bg: 'bg-emerald-50', text: 'text-emerald-700', pct: 68
                            },
                        ].map((m, i) => (
                            <div key={m.label}
                                style={{ transitionDelay: `${i * 80 + 100}ms` }}
                                className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center text-xl`}>{m.icon}</div>
                                    <span className={`text-2xl font-black ${m.text}`}>
                                        <AnimatedNum target={m.value} suffix={m.unit === '% complete' ? '%' : ''} />
                                    </span>
                                </div>
                                {/* Label */}
                                <p className="text-sm font-bold text-gray-800 mb-1">{m.label}</p>
                                <p className="text-[11px] text-gray-400 font-medium mb-3">{m.unit}</p>
                                {/* Progress bar */}
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${m.bar} transition-all duration-1000`}
                                        style={{ width: statsVisible ? `${m.pct}%` : '0%', transitionDelay: `${i * 80 + 300}ms` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ FEATURED DOCTORS ════════════════════════════════════════════ */}
            <div ref={doctorsRef} className={`w-full max-w-7xl mx-auto px-4 md:px-8 py-8 transition-all duration-700 ${doctorsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gradient-to-b from-[#7C3AED] to-[#9333EA] rounded-full inline-block" />
                        Featured Doctors
                    </h2>
                    <Link to="/doctors" className="text-sm font-bold text-[#028090] hover:text-[#01579B] transition-colors flex items-center gap-1">
                        View all →
                    </Link>
                </div>
                <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                    {featuredDoctors.map((doc) => (
                        <div key={doc.name} className="snap-start">
                            <DoctorCard {...doc} />
                        </div>
                    ))}
                    {/* CTA card */}
                    <Link to="/doctors" className="snap-start group shrink-0 w-56 bg-gradient-to-br from-[#01579B] to-[#028090] rounded-2xl border border-transparent shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 text-white">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🔍</div>
                        <p className="font-bold text-center text-sm">Find More Doctors</p>
                        <p className="text-xs text-white/70 text-center">200+ specialists near you</p>
                    </Link>
                </div>
            </div>

            {/* ══ UPCOMING APPOINTMENT PREVIEW ════════════════════════════════ */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Appointment card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><span>📅</span> Upcoming Appointment</h3>
                            <Link to="/appointments" className="text-xs font-bold text-[#028090] hover:underline">View all →</Link>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#0277BD] text-white flex items-center justify-center font-black shrink-0">SJ</div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-sm">Dr. Sarah Jenkins</p>
                                <p className="text-xs text-[#028090] font-semibold">Cardiologist</p>
                                <p className="text-xs text-gray-500 mt-1">📆 Oct 24, 2026 &nbsp;•&nbsp; 10:00 AM</p>
                            </div>
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Upcoming</span>
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                            <p className="text-sm text-gray-400 font-medium">No more upcoming appointments</p>
                        </div>
                    </div>

                    {/* Latest prescription */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><span>💊</span> Active Prescriptions</h3>
                            <Link to="/records" className="text-xs font-bold text-[#028090] hover:underline">View all →</Link>
                        </div>
                        {[
                            { name: 'Amlodipine', dose: '5mg', freq: 'Once daily (Morning)', color: 'bg-purple-50 text-purple-700 border-purple-100' },
                            { name: 'Metformin', dose: '500mg', freq: 'Twice daily (After food)', color: 'bg-teal-50 text-teal-700 border-teal-100' },
                        ].map(m => (
                            <div key={m.name} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between mb-3 last:mb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-sm">💊</div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                                        <p className="text-xs text-gray-500">{m.freq}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${m.color}`}>{m.dose}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ RECENT ACTIVITY (TIMELINE) ══════════════════════════════════ */}
            <div ref={timelineRef} className={`w-full max-w-7xl mx-auto px-4 md:px-8 py-8 pb-16 transition-all duration-700 ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#DB2777] to-[#9333EA] rounded-full inline-block" />
                    Recent Activity
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
                        <div className="space-y-6">
                            {recentActivity.map((a, i) => (
                                <div key={i}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                    className={`relative flex items-start gap-5 group transition-all duration-500 ${timelineVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    {/* Timeline dot */}
                                    <div className={`relative z-10 w-10 h-10 rounded-full ${a.color} flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                        {a.icon}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1.5">
                                        <p className="font-bold text-gray-900 text-sm group-hover:text-[#01579B] transition-colors">{a.title}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{a.detail}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 font-semibold shrink-0 pt-1.5">{a.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ─── Root Dashboard component ───────────────────────────────────────────── */
const Dashboard = () => {
    const { role } = useParams();
    const { isAuth, role: currentRole, userProfile } = useAuth();

    const userName = userProfile?.name || 'there';

    if (!isAuth) return <Navigate to="/login" replace />;
    if (role && currentRole && role !== currentRole) return <Navigate to={`/dashboard/${currentRole}`} replace />;

    const renderContent = () => {
        switch (role) {
            case 'doctor': return <DoctorDashboard />;
            case 'admin': return <AdminDashboard />;
            case 'patient':
            default: return <PatientDashboard userName={userName} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
