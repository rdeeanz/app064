import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// API_URL removed


interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, username: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            // Decode token or fetch user profile could go here
            // For now we persist simplistic basic auth state
            const savedUsername = localStorage.getItem("username");
            if (savedUsername) {
                setUser({ username: savedUsername });
            }
            // Set default Authorization header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const login = (newToken: string, username: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", username);
        setToken(newToken);
        setUser({ username });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
