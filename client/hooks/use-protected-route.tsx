"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useProtectedRoute() {
    const { user, token, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if ((!token || !user) && !isLoading) {
            router.push("/auth/login")
        }
    }, [token, user, router, isLoading])

    return { isAuthenticated: !!token && !!user }
}
