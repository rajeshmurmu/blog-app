"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, token, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        router.push("/")
        setMobileMenuOpen(false)
    }

    const isActive = (path: string) => pathname === path

    const navLinks = [
        { href: "/", label: "Home" },
        ...(token
            ? [
                { href: "/profile/my-posts", label: "My Posts" },
                { href: "/create", label: "Create Post" },
            ]
            : []),
    ]

    return (
        <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="font-bold text-xl text-primary">
                        BlogSpace
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {token && user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-medium">{user.name}</div>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/auth/login">Login</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/auth/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {token && user && <span className="text-sm font-medium">{user?.name}</span>}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 border-t border-border space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2 rounded-lg transition-colors ${isActive(link.href) ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {token && user ? (
                            <Button variant="outline" className="w-full mt-2 bg-transparent" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <div className="flex gap-2 mt-2">
                                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                                    <Link href="/auth/login">Login</Link>
                                </Button>
                                <Button className="flex-1" asChild>
                                    <Link href="/auth/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
