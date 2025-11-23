"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import {
    Pagination as PaginationRoot,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TPaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

const PaginationComponent = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}: TPaginationProps) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = []
        
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("ellipsis")
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push("ellipsis")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <PaginationRoot className={cn("w-full", className)}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                                onPageChange(currentPage - 1)
                            }
                        }}
                        className={cn(
                            "cursor-pointer",
                            currentPage === 1 && "pointer-events-none opacity-50"
                        )}
                    />
                </PaginationItem>

                {pageNumbers.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault()
                                    onPageChange(page)
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) {
                                onPageChange(currentPage + 1)
                            }
                        }}
                        className={cn(
                            "cursor-pointer",
                            currentPage === totalPages && "pointer-events-none opacity-50"
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </PaginationRoot>
    )
}

export {
    PaginationComponent as Pagination
}
