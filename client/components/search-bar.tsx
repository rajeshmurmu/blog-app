"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
    onSearch: (query: string) => void
    isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <Input
                type="text"
                placeholder="Search by title or username..."
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
                <Search size={18} className="mr-2" />
                Search
            </Button>
        </form>
    )
}
