"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "./apiClient"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

interface User {
    _id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    token: object | null
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<object | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load token from localStorage on mount
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        const refreshToken = localStorage.getItem("refreshToken")
        const storedToken = { accessToken, refreshToken }
        const storedUser = localStorage.getItem("authUser")

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])


    const login = async (email: string, password: string) => {
        try {
            const response = await loginUser({ email, password })

            if (response.status !== 200 || !response.data?.user) {
                setUser(null)
                setToken(null)
                throw new Error("Login failed")
                return false
            }

            const { accessToken, refreshToken, user: newUser } = response.data
            setToken(accessToken)
            setUser(newUser)
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
            localStorage.setItem("authUser", JSON.stringify(newUser))

            return true
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const message = error.response.data.error || "Login failed"
                toast.error(message)
            } else {
                toast.error("Login failed")
            }
            throw new Error("Login failed", { cause: error })
        }
    }

    const register = async (name: string, email: string, password: string, confirmPassword: string) => {
        try {
            const response = await registerUser({ name, email, password, confirmPassword })

            if (response.status === 201 || response.status === 200) {
                await login(email, password)

            }

        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const message = error.response.data.error || "Registration failed"
                toast.error(message)
            } else {
                toast.error("Registration failed")
            }
            throw new Error("Registration failed", { cause: error })

        }

    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
