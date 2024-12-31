import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    email: string | null;
    login: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken');
        const storedEmail = localStorage.getItem('email');

        if (token && storedEmail) {
            setIsLoggedIn(true);
            setEmail(storedEmail);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const login = (email: string) => {
        setIsLoggedIn(true);
        setEmail(email);
        localStorage.setItem('email', email);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setEmail(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('email');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };
