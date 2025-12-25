"use client"

import { useState, useEffect, useRef } from "react"
import { Search as SearchIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEventSearch } from "@/hooks/Event/useEventSearch"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type TSearchEventProps = {
    className?: string
    placeholder?: string
    menuMode?: boolean
}

const SearchEvent = ({
    className,
    placeholder = "Buscar por eventos, artistas ou locais",
    menuMode = false
}: TSearchEventProps) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    const { data, isLoading } = useEventSearch({
        query: debouncedQuery,
        enabled: debouncedQuery.length > 0
    })

    const events = data?.data || []

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 2000)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        setIsOpen(searchQuery.length > 0 && events.length > 0)
    }, [searchQuery, events])

    const handleClear = () => {
        setSearchQuery("")
        setDebouncedQuery("")
        setIsOpen(false)
    }

    return (
        <div ref={searchRef} className={cn("relative w-full", className)}>
            <div className={cn(
                `w-full border ${ menuMode ? "" : "bg-white/80" } shadow-lg shadow-black/5 backdrop-blur`,
                menuMode 
                    ? "rounded-xl border-white/70 p-2" 
                    : "rounded-[40px] border-white/70 p-4"
            )}>
                <div className={cn(
                    "flex items-center",
                    menuMode ? "gap-2" : "flex-col gap-3 md:flex-row md:items-center"
                )}>
                    <label className={cn(
                        "flex flex-1 items-center gap-2 border border-transparent bg-[#F3F4FB] text-psi-dark transition-all focus-within:border-psi-primary/30 focus-within:bg-white/90",
                        menuMode
                            ? "rounded-lg px-3 py-2"
                            : "rounded-[32px] px-5 py-3"
                    )}>
                        <SearchIcon className={cn(
                            "text-psi-primary shrink-0",
                            menuMode ? "h-4 w-4" : "h-5 w-5"
                        )} />
                        <Input
                            type="search"
                            placeholder={menuMode ? "Buscar eventos..." : placeholder}
                            aria-label="Buscar eventos"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setIsOpen(true)
                            }}
                            onFocus={() => {
                                if (searchQuery.length > 0 && events.length > 0) {
                                    setIsOpen(true)
                                }
                            }}
                            className={cn(
                                "h-auto border-0 bg-transparent p-0 text-psi-dark placeholder:text-psi-dark/40 focus-visible:ring-0 focus-visible:ring-offset-0",
                                menuMode ? "text-sm" : "text-base"
                            )}
                        />
                    </label>

                    {!menuMode && (
                        <Button 
                            type="button" 
                            size="lg" 
                            variant="primary" 
                            className="w-full md:w-auto"
                            onClick={() => {
                                if (searchQuery.length > 0) {
                                    window.location.href = `/ver-eventos?search=${encodeURIComponent(searchQuery)}`
                                }
                            }}
                        >
                            Buscar agora
                        </Button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className={cn(
                    "absolute bg-white/95 backdrop-blur-md shadow-xl shadow-black/10 z-50 overflow-y-auto",
                    menuMode
                        ? "top-full left-0 right-0 mt-1.5 rounded-xl border border-white/70 max-h-[400px] w-[400px]"
                        : "top-full left-0 right-0 mt-2 rounded-2xl border border-white/70 max-h-[500px]"
                )}>
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : events.length > 0 ? (
                        <div className={menuMode ? "p-1.5" : "p-2"}>
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/ver-evento/${event.slug}`}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl hover:bg-psi-primary/5 transition-colors group",
                                        menuMode ? "p-2" : "p-3"
                                    )}
                                    onClick={() => {
                                        setIsOpen(false)
                                        setSearchQuery("")
                                    }}
                                >
                                    <div className={cn(
                                        "relative rounded-lg overflow-hidden shrink-0 border border-psi-primary/10",
                                        menuMode ? "h-12 w-12" : "h-16 w-16"
                                    )}>
                                        <img
                                            src={ImageUtils.getEventImageUrl(event.image)}
                                            alt={event.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-medium text-psi-dark group-hover:text-psi-primary transition-colors truncate",
                                            menuMode ? "text-sm" : "text-base"
                                        )}>
                                            {event.name}
                                        </h3>
                                        {!menuMode && (
                                            <p className="text-xs text-psi-dark/60">
                                                Ver detalhes do evento
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : debouncedQuery.length > 0 && !isLoading ? (
                        <div className={menuMode ? "p-4 text-center" : "p-8 text-center"}>
                            <p className={cn(
                                "text-psi-dark/60",
                                menuMode ? "text-sm" : "text-base"
                            )}>
                                Nenhum evento encontrado para &quot;{debouncedQuery}&quot;
                            </p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export {
    SearchEvent
}
