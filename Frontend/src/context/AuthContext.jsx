import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [initialized, setInitialized] = useState(false);
    
    const [showAuthToast, setShowAuthToast] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    // On Load: Restoration logic
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const storedRole = localStorage.getItem("role");
            
            if (token && storedUser) {
                setCurrentUser(storedUser);
                setRole(storedRole || storedUser.role);
                setIsAuth(true);
            } else {
                // If either is missing, ensure state is clear
                setIsAuth(false);
                setCurrentUser(null);
                setRole(null);
            }
        } catch (err) {
            console.error("Auth Restoration Error:", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        } finally {
            setInitialized(true);
        }
    }, []);

    const login = (data, token) => {
        // data.user should now contain the user object from backend
        const user = data.user || data; // fallback just in case
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        
        setCurrentUser(user);
        setRole(user.role);
        setIsAuth(true);
    };

    const updateUser = (updatedUser) => {
        const newUser = { ...currentUser, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(newUser));
        setCurrentUser(newUser);
        
        if (updatedUser.role) {
            setRole(updatedUser.role);
            localStorage.setItem("role", updatedUser.role);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        
        setIsAuth(false);
        setRole(null);
        setCurrentUser(null);
        navigate('/login');
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
            
            setTimeout(() => {
                setAuthLoading(true);
                setTimeout(() => {
                    setAuthLoading(false);
                    navigate('/login', { state: { from: location.pathname } });
                }, 800);
            }, 1000);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuth, role, currentUser, initialized, login, logout, updateUser, handleProtectedAction }}>
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
