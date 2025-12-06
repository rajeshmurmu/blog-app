"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
    onNextPage: () => void
    onPrevPage: () => void
    isLoading?: boolean
}

export function Pagination({
    currentPage,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    isLoading = false,
}: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <Button onClick={onPrevPage} disabled={!hasPrevPage || isLoading} variant="outline">
                <ChevronLeft size={18} className="mr-2" />
                Previous
            </Button>

            <span className="text-sm font-medium min-w-fit">Page {currentPage}</span>

            <Button onClick={onNextPage} disabled={!hasNextPage || isLoading} variant="outline">
                Next
                <ChevronRight size={18} className="ml-2" />
            </Button>
        </div>
    )
}
