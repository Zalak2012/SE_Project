import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const AICheckerPage = () => {
    const { isAuth, handleProtectedAction } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello! I am the CareMate AI Symptom Checker. I can help you understand your symptoms better and suggest what type of specialist you might need to see. How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        
        // Smart Access Control
        if (!isAuth) {
            handleProtectedAction(e);
            return;
        }

        if (input.trim() === '') return;

        setMessages(prev => [...prev, { id: prev.length + 1, sender: 'user', text: input }]);
        setInput('');

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: prev.length + 1, 
                sender: 'ai', 
                text: "I've noted your symptoms. Based on what you've described, I would recommend consulting a General Physician or scheduling an appointment for a preliminary checkup. Would you like me to help you find a doctor?" 
            }]);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 md:px-8 max-w-4xl py-12 flex flex-col items-center">
                <div className="w-full text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#01579B] mb-3">AI Symptom Checker</h1>
                    <p className="text-gray-600">Quickly analyze your symptoms to get actionable healthcare guidance.</p>
                </div>

                <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-[600px] animate-[fadeIn_0.5s_ease-out_both]">
                    
                    {/* Chat Messages Area */}
                    <div className="flex-grow p-6 overflow-y-auto bg-[#F8FAFC]">
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-[#028090] text-white rounded-br-none shadow-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                        {msg.sender === 'ai' && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl">🤖</span>
                                                <span className="font-bold text-xs text-[#00A896]">CareMate AI</span>
                                            </div>
                                        )}
                                        <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Non-Auth Warning Modal Overlay */}
                    {!isAuth && (
                        <div className="bg-[#E6F4EA] border-y border-[#00A896]/20 py-3 px-6 text-center shadow-sm">
                            <p className="text-sm font-semibold text-[#00A896] flex items-center justify-center gap-2">
                                <span>🔒</span> Login required to use AI Symptom Checker
                            </p>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 relative">
                        <form onSubmit={handleSend} className="relative flex items-center gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={!isAuth}
                                placeholder={isAuth ? "Describe your symptoms..." : "Please log in to chat"}
                                className={`flex-grow px-6 py-4 rounded-full border bg-gray-50 focus:outline-none transition-colors ${!isAuth ? 'cursor-not-allowed opacity-60 border-gray-200' : 'border-gray-200 focus:border-[#028090] focus:ring-1 focus:ring-[#028090]'}`}
                            />
                            <button
                                type="submit"
                                disabled={!isAuth || (!input.trim() && isAuth)}
                                onClick={!isAuth ? handleProtectedAction : undefined}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isAuth && input.trim() ? 'bg-[#0277BD] hover:bg-[#01579B] text-white shadow-md hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AICheckerPage;
