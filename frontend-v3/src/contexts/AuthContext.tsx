import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { login as apiLogin } from "@/lib/api"

interface User {
    username: string
    role: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem("access_token")
        const storedUser = localStorage.getItem("user")
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem("access_token")
                localStorage.removeItem("user")
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (username: string, password: string) => {
        const data = await apiLogin(username, password)
        localStorage.setItem("access_token", data.access_token)
        const userData: User = { username, role: "admin" }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
