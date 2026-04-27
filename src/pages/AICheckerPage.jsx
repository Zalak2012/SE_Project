import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// Doctor data (reused from FindDoctors.jsx pattern)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_DOCTORS = [
    {
        id: 1,
        name: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        experience: 15,
        rating: 4.9,
        reviews: 124,
        location: "HeartCare Center, NY",
        availableToday: true,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 2,
        name: "Dr. Marcus Thorne",
        specialty: "Neurologist",
        experience: 12,
        rating: 4.8,
        reviews: 98,
        location: "Neuro Health Clinic",
        availableToday: false,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 3,
        name: "Dr. Emily Chen",
        specialty: "Pediatrician",
        experience: 8,
        rating: 4.9,
        reviews: 215,
        location: "KidsFirst Hospital",
        availableToday: true,
        image: "https://images.unsplash.com/photo-1594824436998-058b23c28bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        specialty: "Dermatologist",
        experience: 20,
        rating: 4.7,
        reviews: 156,
        location: "Skin Perfect Clinic",
        availableToday: false,
        image: "https://images.unsplash.com/photo-1537368910025-702800faa86b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 5,
        name: "Dr. Robert Patel",
        specialty: "Orthopedic Surgeon",
        experience: 18,
        rating: 4.9,
        reviews: 342,
        location: "City General Hospital",
        availableToday: true,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 6,
        name: "Dr. Lisa Wong",
        specialty: "General Physician",
        experience: 10,
        rating: 4.8,
        reviews: 412,
        location: "Family Health Center",
        availableToday: true,
        image: "https://images.unsplash.com/photo-1594824436998-058b23c28bc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 7,
        name: "Dr. Aisha Rahman",
        specialty: "Pulmonologist",
        experience: 11,
        rating: 4.7,
        reviews: 189,
        location: "Breath Well Clinic",
        availableToday: true,
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 8,
        name: "Dr. Kevin Scott",
        specialty: "Gastroenterologist",
        experience: 14,
        rating: 4.6,
        reviews: 203,
        location: "DigestCare Center",
        availableToday: false,
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
        id: 9,
        name: "Dr. Priya Sharma",
        specialty: "ENT Specialist",
        experience: 9,
        rating: 4.8,
        reviews: 177,
        location: "ClearSense Clinic",
        availableToday: true,
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Symptom → Specialty Mapping
// ─────────────────────────────────────────────────────────────────────────────
const SYMPTOM_MAP = [
    {
        keywords: ['fever', 'temperature', 'chills', 'sweating', 'cold', 'flu', 'fatigue', 'weakness', 'body ache', 'faint', 'dizzy', 'dizziness', 'tired'],
        specialties: ['General Physician'],
        response: "Based on your symptoms, you seem to be experiencing signs of a general illness like fever or flu. I strongly recommend visiting a **General Physician** for proper evaluation. Please do not self-medicate.",
    },
    {
        keywords: ['headache', 'migraine', 'head pain', 'head ache', 'brain', 'memory', 'numbness', 'seizure', 'epilepsy', 'nerve', 'neurological', 'confusion'],
        specialties: ['Neurologist'],
        response: "Your symptoms may indicate a neurological concern such as migraines or nerve-related issues. I recommend consulting a **Neurologist** for a thorough evaluation. Early diagnosis is key.",
    },
    {
        keywords: ['chest pain', 'heart', 'palpitation', 'shortness of breath', 'breathlessness', 'chest tightness', 'cardiac', 'pulse', 'irregular heartbeat', 'heart attack'],
        specialties: ['Cardiologist'],
        response: "⚠️ Your symptoms may indicate a cardiac concern. Chest pain and related symptoms should be taken seriously. Please consult a **Cardiologist** immediately. If symptoms are severe, visit an emergency room.",
    },
    {
        keywords: ['cough', 'breathing', 'asthma', 'lung', 'respiratory', 'wheezing', 'phlegm', 'mucus', 'bronchitis', 'pneumonia', 'inhaler', 'oxygen'],
        specialties: ['Pulmonologist'],
        response: "Your symptoms suggest a possible respiratory or lung condition. A **Pulmonologist** can help diagnose and treat conditions like asthma, bronchitis, or other breathing disorders.",
    },
    {
        keywords: ['skin', 'rash', 'acne', 'itch', 'allergy', 'eczema', 'psoriasis', 'dermatitis', 'hives', 'blister', 'pimple', 'pigmentation', 'hair loss', 'nail'],
        specialties: ['Dermatologist'],
        response: "Your symptoms point to a skin-related condition. A **Dermatologist** is the right specialist to diagnose and treat concerns like rashes, acne, eczema, or other skin disorders.",
    },
    {
        keywords: ['stomach', 'abdomen', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating', 'gas', 'acid', 'heartburn', 'indigestion', 'bowel', 'gastric', 'ulcer', 'stomach pain', 'abdominal'],
        specialties: ['Gastroenterologist'],
        response: "Your digestive complaints might require specialist attention. A **Gastroenterologist** specializes in stomach, intestinal, and digestive disorders and can provide accurate diagnosis and treatment.",
    },
    {
        keywords: ['child', 'baby', 'infant', 'toddler', 'kid', 'pediatric', 'growth', 'vaccination', 'immunization', 'newborn', 'children'],
        specialties: ['Pediatrician'],
        response: "For concerns related to children's health, growth, or development, a **Pediatrician** is the ideal specialist. They're trained to handle all aspects of child healthcare.",
    },
    {
        keywords: ['joint', 'bone', 'fracture', 'muscle', 'back pain', 'knee', 'shoulder', 'neck pain', 'arthritis', 'spine', 'ortho', 'ligament', 'tendon', 'swelling'],
        specialties: ['Orthopedic Surgeon'],
        response: "Your symptoms indicate a possible musculoskeletal issue. An **Orthopedic Surgeon** specializes in bones, joints, muscles, and related injuries. I recommend scheduling a consultation.",
    },
    {
        keywords: ['ear', 'nose', 'throat', 'ent', 'sinus', 'hearing', 'tonsil', 'cold', 'nasal', 'snoring', 'voice', 'hoarse', 'loss of smell', 'taste'],
        specialties: ['ENT Specialist'],
        response: "Your symptoms suggest an ear, nose, or throat concern. An **ENT Specialist** can accurately diagnose and treat sinusitis, hearing loss, tonsillitis, and related conditions.",
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI Logic — pure function, no API calls
// ─────────────────────────────────────────────────────────────────────────────
function getAIResponse(userInput) {
    const lower = userInput.toLowerCase();

    for (const rule of SYMPTOM_MAP) {
        if (rule.keywords.some((kw) => lower.includes(kw))) {
            const suggestedDoctors = ALL_DOCTORS.filter((doc) =>
                rule.specialties.includes(doc.specialty)
            );
            return { type: 'symptom', text: rule.response, doctors: suggestedDoctors };
        }
    }

    return {
        type: 'unrelated',
        text: "Sorry, I can only help with **health-related symptoms**. Please describe any physical symptoms you're experiencing and I'll suggest the right specialist for you! 🩺",
        doctors: [],
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper to render markdown-lite bold (**text**)
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkdown(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Doctor Suggestion Card
// ─────────────────────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, navigate }) => (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#B3E5FC]/60 shadow-sm hover:shadow-md hover:border-[#028090]/40 transition-all duration-200 group">
        <img
            src={doctor.image}
            alt={doctor.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
        />
        <div className="flex-grow min-w-0">
            <p className="font-bold text-[#01579B] text-sm truncate group-hover:text-[#0277BD] transition-colors">{doctor.name}</p>
            <p className="text-[#028090] text-xs font-medium">{doctor.specialty}</p>
            <div className="flex items-center gap-1 mt-0.5">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold text-gray-700">{doctor.rating}</span>
                <span className="text-xs text-gray-400">({doctor.reviews})</span>
                {doctor.availableToday && (
                    <span className="ml-1 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Today</span>
                )}
            </div>
        </div>
        <button
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            className="shrink-0 text-xs font-bold px-3 py-2 rounded-lg bg-[#E1F5FE] text-[#0277BD] hover:bg-[#0277BD] hover:text-white transition-all duration-200 whitespace-nowrap"
        >
            View Profile
        </button>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Typing Indicator
// ─────────────────────────────────────────────────────────────────────────────
const TypingIndicator = () => (
    <div className="flex justify-start">
        <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🤖</span>
                <span className="font-bold text-xs text-[#00A896]">CareMate AI</span>
            </div>
            <div className="flex items-center gap-1.5 py-1">
                <span className="w-2 h-2 bg-[#028090] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-[#028090] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-[#028090] rounded-full animate-bounce" />
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Suggested Symptom Quick-pickers
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_SYMPTOMS = ['Fever', 'Headache', 'Chest Pain', 'Cough', 'Skin Rash', 'Stomach Pain', 'Joint Pain', 'Sore Throat'];

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
const AICheckerPage = () => {
    const navigate = useNavigate();
    const { isAuth, handleProtectedAction } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'ai',
            text: 'Hello! I\'m the **CareMate AI Symptom Checker** 🩺\n\nDescribe your symptoms and I\'ll suggest the right specialist for you. I can help with:\n• Fever, cold, fatigue\n• Headache, chest pain\n• Skin issues, stomach pain\n• And much more!\n\n⚠️ I\'ll only respond to health-related symptoms.',
            doctors: [],
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = (text) => {
        if (!text.trim()) return;

        if (!isAuth) {
            handleProtectedAction();
            return;
        }

        const userMsg = { id: Date.now(), sender: 'user', text: text.trim(), doctors: [] };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const aiResult = getAIResponse(text);
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: aiResult.text,
                    doctors: aiResult.doctors,
                    type: aiResult.type,
                },
            ]);
        }, 1400 + Math.random() * 600);
    };

    const handleSend = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleQuickSymptom = (symptom) => {
        if (!isAuth) { handleProtectedAction(); return; }
        sendMessage(symptom);
    };

    const handleClearChat = () => {
        setMessages([
            {
                id: Date.now(),
                sender: 'ai',
                text: 'Chat cleared! I\'m ready to help you again. Describe your symptoms and I\'ll suggest the right specialist. 😊',
                doctors: [],
            },
        ]);
    };

    // split multiline AI text into paragraphs
    const renderAIText = (text) => {
        return text.split('\n').map((line, i) => (
            <span key={i} className="block leading-relaxed">
                {renderMarkdown(line)}
            </span>
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#EBF5FF] to-[#F8FAFC] font-sans text-gray-800 flex flex-col">
            <Navbar />

            {/* ── Page Hero ────────────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-[#01579B] via-[#0277BD] to-[#0288D1] text-white py-10 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/25">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        AI-Powered · Frontend Only · No Diagnosis
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">AI Symptom Checker</h1>
                    <p className="text-[#B3E5FC] text-base md:text-lg max-w-xl mx-auto">
                        Describe your symptoms and instantly get matched with the right medical specialist.
                    </p>
                </div>
            </section>

            <main className="flex-grow container mx-auto px-4 md:px-6 max-w-4xl py-8 flex flex-col gap-5">

                {/* ── Quick Symptom Chips ─────────────────────────────── */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 text-center">Quick Symptom Shortcuts</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {QUICK_SYMPTOMS.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleQuickSymptom(s)}
                                className="px-4 py-1.5 text-sm font-semibold rounded-full border-2 border-[#B3E5FC] bg-white text-[#0277BD] hover:bg-[#0277BD] hover:text-white hover:border-[#0277BD] transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Chat Card ────────────────────────────────────────── */}
                <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: '580px' }}>

                    {/* Chat Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#01579B] to-[#0277BD] text-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shadow-inner">🤖</div>
                            <div>
                                <p className="font-bold text-sm leading-none">CareMate AI</p>
                                <p className="text-[#B3E5FC] text-xs mt-0.5">Symptom Checker • Always Online</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearChat}
                            title="Clear Chat"
                            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 border border-white/20"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto px-5 py-5 bg-[#F8FAFC] space-y-5 scroll-smooth">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeInUp_0.35s_ease-out_both]`}
                            >
                                <div className={`max-w-[82%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                    {/* Bubble */}
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-[#028090] to-[#0277BD] text-white rounded-br-none'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.sender === 'ai' && (
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <span className="text-base">🤖</span>
                                                <span className="font-bold text-xs text-[#00A896]">CareMate AI</span>
                                                {msg.type === 'unrelated' && (
                                                    <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full ml-1">Off-topic</span>
                                                )}
                                                {msg.type === 'symptom' && (
                                                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full ml-1">Health Query</span>
                                                )}
                                            </div>
                                        )}
                                        <div className={msg.sender === 'ai' ? 'text-gray-800' : 'text-white'}>
                                            {renderAIText(msg.text)}
                                        </div>
                                    </div>

                                    {/* Doctor Suggestions */}
                                    {msg.sender === 'ai' && msg.doctors && msg.doctors.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 px-1">
                                                <span className="text-[#028090]">👨‍⚕️</span>
                                                Recommended Specialists
                                            </p>
                                            {msg.doctors.map((doc) => (
                                                <DoctorCard key={doc.id} doctor={doc} navigate={navigate} />
                                            ))}
                                            <button
                                                onClick={() => navigate('/doctors')}
                                                className="w-full mt-1 text-xs font-bold text-[#0277BD] bg-[#E1F5FE] hover:bg-[#0277BD] hover:text-white py-2.5 rounded-xl transition-all duration-200 border border-[#B3E5FC]"
                                            >
                                                View All Doctors →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && <TypingIndicator />}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Auth Warning Banner */}
                    {!isAuth && (
                        <div className="bg-amber-50 border-y border-amber-200 py-2.5 px-5 text-center shrink-0">
                            <p className="text-sm font-semibold text-amber-700 flex items-center justify-center gap-2">
                                <span>🔒</span>
                                Please <button onClick={handleProtectedAction} className="underline font-bold hover:text-amber-900 transition-colors">log in</button> to use the AI Symptom Checker
                            </p>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="px-4 py-3.5 bg-white border-t border-gray-100 shrink-0">
                        <form onSubmit={handleSend} className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                id="symptom-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={!isAuth || isTyping}
                                placeholder={
                                    !isAuth
                                        ? 'Please log in to chat...'
                                        : isTyping
                                        ? 'AI is responding...'
                                        : 'Describe your symptoms (e.g. "I have a fever and headache")'
                                }
                                className={`flex-grow px-5 py-3.5 rounded-full border text-sm focus:outline-none transition-all ${
                                    !isAuth || isTyping
                                        ? 'cursor-not-allowed opacity-60 bg-gray-50 border-gray-200'
                                        : 'bg-gray-50 border-gray-200 focus:border-[#028090] focus:ring-2 focus:ring-[#028090]/20'
                                }`}
                            />
                            <button
                                type="submit"
                                id="symptom-send-btn"
                                disabled={!isAuth || isTyping || !input.trim()}
                                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                                    isAuth && input.trim() && !isTyping
                                        ? 'bg-gradient-to-br from-[#028090] to-[#0277BD] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                        <p className="text-center text-[10px] text-gray-400 mt-2">
                            ⚕️ CareMate AI does not provide diagnoses. Always consult a qualified doctor.
                        </p>
                    </div>
                </div>

                {/* ── Info Cards ──────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1 pb-4">
                    {[
                        { icon: '🎯', title: 'Smart Symptom Detection', desc: 'Identifies health symptoms and maps them to the right specialist.' },
                        { icon: '👨‍⚕️', title: 'Doctor Suggestions', desc: 'Instantly shows relevant doctors from our verified network.' },
                        { icon: '🔒', title: 'Privacy First', desc: 'No data is stored. All analysis happens in your browser.' },
                    ].map((card) => (
                        <div key={card.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow duration-200">
                            <span className="text-2xl shrink-0">{card.icon}</span>
                            <div>
                                <p className="font-bold text-gray-800 text-sm mb-1">{card.title}</p>
                                <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />

            {/* ── Keyframe Animations (inline style) ──────────────────── */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AICheckerPage;
