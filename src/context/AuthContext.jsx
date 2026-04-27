import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("jwt_token"));
    const [role, setRole] = useState(localStorage.getItem("userRole"));
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("currentUser") || "null"));
    
    const [showAuthToast, setShowAuthToast] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    
    // Session-based profile state (frontend-only, resets on refresh)
    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        email: "john@example.com",
        role: "Patient",
        phone: "",
        gender: "",
        avatarUrl: ""
    });
    
    const updateUserProfile = (newProfile) => {
        setUserProfile(prev => ({ ...prev, ...newProfile }));
    };

    // Session-based saved addresses (frontend-only)
    const [savedAddresses, setSavedAddresses] = useState([]);

    const addAddress = (address) => {
        const newAddress = { ...address, id: Date.now() };
        setSavedAddresses(prev => [...prev, newAddress]);
        return newAddress;
    };

    const updateAddress = (id, updatedAddress) => {
        setSavedAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, ...updatedAddress } : addr));
    };

    const removeAddress = (id) => {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
    };
    
    const navigate = useNavigate();
    const location = useLocation();

    // Ensure state stays synced if localStorage changes from another tab
    useEffect(() => {
        const handleStorageChange = () => {
            const hasToken = !!localStorage.getItem("jwt_token");
            setIsAuth(hasToken);
            setRole(localStorage.getItem("userRole"));
            setCurrentUser(JSON.parse(localStorage.getItem("currentUser") || "null"));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (user, token) => {
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        setRole(user.role);
        setCurrentUser(user);
        setIsAuth(true);
    };

    const logout = () => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("currentUser");
        
        setIsAuth(false);
        setRole(null);
        setCurrentUser(null);
        navigate('/');
    };

    const handleProtectedAction = (e, path, callback) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        if (isAuth) {
            if (path) navigate(path);
            if (callback) callback();
        } else {
            setShowAuthToast(true);
            setTimeout(() => setShowAuthToast(false), 3000);
            
            // Redirect to login after showing toast
            setTimeout(() => {
                setAuthLoading(true);
                setTimeout(() => {
                    setAuthLoading(false);
                    // Pass the intended destination in state so we can return after login if desired (optional)
                    navigate('/login', { state: { from: location.pathname } });
                }, 800);
            }, 1000);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuth, role, currentUser, userProfile, updateUserProfile, savedAddresses, addAddress, updateAddress, removeAddress, login, logout, handleProtectedAction }}>
            {/* Global Auth Toast */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${showAuthToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="bg-[#01579B] text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2">
                    <span>⚠️</span> Please login to continue
                </div>
            </div>

            {/* Global Full screen loading for redirect */}
            {authLoading && (
                <div className="fixed inset-0 z-[110] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-12 h-12 border-4 border-[#B3E5FC] border-t-[#0277BD] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#01579B] font-bold text-lg mt-4">Redirecting to login...</p>
                </div>
            )}
            
            {children}
        </AuthContext.Provider>
    );
};
