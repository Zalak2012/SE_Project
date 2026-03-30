// mockApi.js - Simulates a real backend API for CareMatePlus

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDb = () => JSON.parse(localStorage.getItem('mock_db_users') || '[]');
const saveDb = (users) => localStorage.setItem('mock_db_users', JSON.stringify(users));

export const apiSignup = async (userData) => {
    await delay(800);
    const users = getDb();
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("User with this email already exists.");
    }
    
    // Create new user record
    const user = {
        userId: 'u_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'patient',
        passwordHash: btoa(userData.password), // Mock hash
        createdAt: new Date().toISOString(),
        phone: '',
        gender: '',
        avatarUrl: ''
    };
    
    users.push(user);
    saveDb(users);
    
    const token = `mock_jwt_${user.userId}_${Date.now()}`;
    
    return { 
        token, 
        user: { 
            userId: user.userId, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        } 
    };
};

export const apiLogin = async (email, password) => {
    await delay(800);
    const users = getDb();
    
    // Validate credentials
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password));
    
    if (!user) {
        throw new Error("Invalid email or password.");
    }
    
    const token = `mock_jwt_${user.userId}_${Date.now()}`;
    
    return { 
        token, 
        user: { 
            userId: user.userId, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        } 
    };
};

export const apiGetProfile = async (token) => {
    await delay(600);
    
    if (!token || !token.startsWith('mock_jwt_')) {
        throw new Error("Unauthorized access. Invalid token.");
    }
    
    const userId = token.split('_')[2];
    const users = getDb();
    const user = users.find(u => u.userId === userId);
    
    if (!user) {
        throw new Error("User profile not found.");
    }
    
    // Return only safely exposed profile fields
    return {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        gender: user.gender || "",
        avatarUrl: user.avatarUrl || ""
    };
};

export const apiUpdateProfile = async (token, updateData) => {
    await delay(800);
    
    if (!token || !token.startsWith('mock_jwt_')) {
        throw new Error("Unauthorized access. Invalid token.");
    }
    
    const userId = token.split('_')[2];
    const users = getDb();
    const userIndex = users.findIndex(u => u.userId === userId);
    
    if (userIndex === -1) {
        throw new Error("User profile not found.");
    }
    
    // Explicitly restrict changes to mutable fields only
    users[userIndex] = {
        ...users[userIndex],
        phone: updateData.phone !== undefined ? updateData.phone : users[userIndex].phone,
        gender: updateData.gender !== undefined ? updateData.gender : users[userIndex].gender,
        avatarUrl: updateData.avatarUrl !== undefined ? updateData.avatarUrl : users[userIndex].avatarUrl
    };
    
    saveDb(users);
    
    return { 
        success: true, 
        message: "Profile updated successfully." 
    };
};
