"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Repeat, Tag, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { useEventFindPublic } from "@/hooks/Event/useEventFindPublic"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { Skeleton } from "@/components/ui/skeleton"
import { Background } from "@/components/Background/Background"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { EventCategoryIconHandler } from "@/utils/Helpers/EventCategoryIconHandler/EventCategoryIconHandler"
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import type { TEventCategoryEvent } from "@/types/Event/TEventCategoryEvent"
import type { TEventDate } from "@/types/Event/TEventDate"
import { Pagination } from "@/components/Pagination/Pagination"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSearchParamsHook } from "@/hooks/useSearchParams"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const VerEventosPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchName, setSearchName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    
    const handleSearch = () => {
        setSearchQuery(searchName)
        setCurrentPage(1)
    }

    const searchParams = useSearchParamsHook<{ categoryId: string }>(["categoryId"])

    useEffect(() => {
        if (searchParams.categoryId) {
            setSelectedCategoryId(searchParams.categoryId)
        } else {
            setSelectedCategoryId(null)
        }
    }, [searchParams.categoryId])

    const handleCategorySelect = (categoryId: string | null) => {
        setSelectedCategoryId(categoryId)
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchName("")
        setSearchQuery("")
        setSelectedCategoryId(null)
        setCurrentPage(1)
    }
    
    const offset = (currentPage - 1) * 9
    
    const { data: eventsData, isLoading, isError } = useEventFindPublic({
        offset,
        name: searchQuery || undefined,
        categoryId: selectedCategoryId || undefined
    })

    const { data: eventCategoriesData } = useEventCategoryFind()
    
    const events = useMemo(() => {
        if (!eventsData?.data) return []
        const nestedData = (eventsData.data as any)?.data
        if (Array.isArray(nestedData)) {
            return nestedData
        }
        if (Array.isArray(eventsData.data)) {
            return eventsData.data
        }
        return []
    }, [eventsData])
    
    const responseData = (eventsData?.data as any) || {}
    const totalItems = responseData.total || 0
    const limit = responseData.limit || 10
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const categories = useMemo(() => {
        if (eventCategoriesData?.data && Array.isArray(eventCategoriesData.data)) {
            return [...eventCategoriesData.data].sort((a, b) => 
                a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
            )
        }
        return []
    }, [eventCategoriesData])

    const formatDate = (dateString?: string | null) => {
        return formatEventDate(dateString, "DD MMM YYYY")
    }

    const formatRecurrence = (recurrence: TEvent["Recurrence"]) => {
        if (!recurrence || recurrence.type === "NONE") return null

        const recurrenceLabels = {
            DAILY: "Diário",
            WEEKLY: "Semanal",
            MONTHLY: "Mensal"
        }

        const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

        let label = recurrenceLabels[recurrence.type]

        if (recurrence.type === "WEEKLY" && recurrence.RecurrenceDays && recurrence.RecurrenceDays.length > 0) {
            const days = recurrence.RecurrenceDays.map(day => dayLabels[day.day]).join(", ")
            label = `${label} (${days})`
        }

        if (recurrence.endDate) {
            const endDate = formatDate(recurrence.endDate)
            label = `${label} até ${endDate}`
        }

        return label
    }

    const getDateRange = (dates: TEvent["EventDates"]) => {
        if (!dates || dates.length === 0) return formatDate()

        const sortedDates = [...dates].sort((a, b) => 
            getDateOrderValue(a?.date) - getDateOrderValue(b?.date)
        )

        const firstDate = formatEventDate(sortedDates[0]?.date, "DD [de] MMMM [de] YYYY")
        const lastDate = formatEventDate(sortedDates[sortedDates.length - 1]?.date, "DD [de] MMMM [de] YYYY")

        if (dates.length === 1) {
            return firstDate
        }

        return `${firstDate} - ${lastDate}`
    }

    const getActiveBatch = (batches: TEvent["EventBatches"]): TEventBatch | null => {
        if (!batches || batches.length === 0) return null

        const now = new Date()
        const activeBatch = batches.find(batch => {
            const startDate = new Date(batch.startDate)
            const endDate = batch.endDate ? new Date(batch.endDate) : null
            
            const isAfterStart = now >= startDate
            const isBeforeEnd = !endDate || now <= endDate
            
            return batch.isActive && isAfterStart && isBeforeEnd
        })

        return activeBatch || null
    }

    const hasActiveFilters = searchQuery || selectedCategoryId

    if (isLoading) {
        return (
            <Background variant="light">
                <div className="min-h-screen pt-32 pb-16 px-4
                sm:px-6
                lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <Skeleton className="h-10 w-64 mb-2" />
                            <Skeleton className="h-6 w-96" />
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-[400px] rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </Background>
        )
    }


    return (
        <Background variant="hero">
            <div className="min-h-screen pt-32 pb-16 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl
                        sm:text-5xl font-bold text-psi-primary mb-2">
                            Todos os Eventos
                        </h1>
                        <p className="text-base
                        sm:text-lg text-psi-dark/60 mb-6">
                            Explore eventos incríveis em Porto Seguro
                        </p>
                        
                        <div className="flex flex-col
                        sm:flex-row gap-3 mb-6">
                            <div className="flex gap-3 flex-1">
                                <Input
                                    placeholder="Pesquisar por nome do evento..."
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch()
                                        }
                                    }}
                                    icon={Search}
                                    className="w-full bg-psi-light"
                                />
                                <Button
                                    variant="primary"
                                    onClick={handleSearch}
                                    className="shrink-0"
                                >
                                    Pesquisar
                                </Button>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="shrink-0"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Limpar filtros
                                </Button>
                            )}
                        </div>

                        {categories.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-medium text-psi-dark/70 mb-3">Filtrar por categoria:</p>
                                
                                <div className="block
                                min-[821px]:hidden">
                                    <Select
                                        value={selectedCategoryId || "all"}
                                        onValueChange={(value) => handleCategorySelect(value === "all" ? null : value)}
                                    >
                                        <SelectTrigger className="w-full bg-white border border-[#E4E6F0] text-psi-dark/70">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Todas
                                            </SelectItem>
                                            {categories.map((category) => {
                                                const Icon = EventCategoryIconHandler(category.name)
                                                return (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="h-4 w-4" />
                                                            <span>{category.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="hidden
                                min-[821px]:flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleCategorySelect(null)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200",
                                            !selectedCategoryId
                                                ? "bg-psi-primary text-white shadow-md"
                                                : "bg-white border border-[#E4E6F0] text-psi-dark/70 hover:bg-psi-light"
                                        )}
                                    >
                                        Todas
                                    </button>
                                    {categories.map((category) => {
                                        const Icon = EventCategoryIconHandler(category.name)
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategorySelect(category.id)}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 flex items-center gap-2",
                                                    selectedCategoryId === category.id
                                                        ? "bg-psi-primary text-white shadow-md"
                                                        : "bg-white border border-[#E4E6F0] text-psi-dark/70 hover:bg-psi-light"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {category.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {isError || !events || events.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-lg text-psi-dark/60">Nenhum evento encontrado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3 gap-6">
                            {events.map((event: TEvent) => {
                            const activeBatch = getActiveBatch(event.EventBatches)
                            
                            return (
                                <Link
                                    key={event.id}
                                    href={`/ver-evento/${event.slug}`}
                                    className="group rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
                                >
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <img
                                            src={ImageUtils.getEventImageUrl(event.image)}
                                            alt={event.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {event.EventCategoryEvents && event.EventCategoryEvents.length > 0 && (
                                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                                {event.EventCategoryEvents.slice(0, 2).map((categoryEvent: TEventCategoryEvent) => {
                                                    const category = categories.find(c => c.id === categoryEvent.categoryId)
                                                    if (!category) return null
                                                    const Icon = EventCategoryIconHandler(category.name)
                                                    return (
                                                        <Badge
                                                            key={categoryEvent.categoryId}
                                                            variant="secondary"
                                                            className="bg-white/90 backdrop-blur-sm text-psi-dark border-0 shadow-md"
                                                        >
                                                            <Icon className="h-3 w-3 mr-1" />
                                                            {category.name}
                                                        </Badge>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-psi-dark mb-2 line-clamp-2">
                                                {event.name}
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2 text-sm text-psi-dark/70">
                                                <Calendar className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-psi-dark mb-1">
                                                        {getDateRange(event.EventDates)}
                                                    </div>
                                                    {event.EventDates && event.EventDates.length > 1 && (
                                                        <div className="space-y-1 mt-2">
                                                            {event.EventDates.slice(0, 3).map((eventDate: TEventDate, index: number) => (
                                                                <div key={index} className="flex items-center gap-2 text-xs text-psi-dark/60">
                                                                    <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                                                    <span>
                                                                        {formatDate(eventDate.date)}: {formatEventTime(eventDate.hourStart, eventDate.hourEnd)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {event.EventDates.length > 3 && (
                                                                <div className="text-xs text-psi-primary font-medium">
                                                                    +{event.EventDates.length - 3} datas
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {event.EventDates && event.EventDates.length === 1 && (
                                                        <div className="flex items-center gap-2 text-xs text-psi-dark/60 mt-1">
                                                            <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                                            <span>
                                                                {formatEventTime(event.EventDates[0].hourStart, event.EventDates[0].hourEnd)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {event.Recurrence && event.Recurrence.type !== "NONE" && (
                                                <div className="flex items-center gap-2 text-sm text-psi-primary">
                                                    <Repeat className="h-4 w-4 shrink-0" />
                                                    <span className="font-medium">{formatRecurrence(event.Recurrence)}</span>
                                                </div>
                                            )}

                                            {event.location && (
                                                <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                    <MapPin className="h-4 w-4 text-psi-primary shrink-0" />
                                                    <span className="line-clamp-1">{event.location}</span>
                                                </div>
                                            )}

                                            {activeBatch && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Tag className="h-4 w-4 text-psi-primary shrink-0" />
                                                    <span className="text-sm font-semibold text-psi-dark">
                                                        {activeBatch.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                        </div>
                    )}
                    
                    {totalPages > 1 && events && events.length > 0 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Background>
    )
}

export {
    VerEventosPannel
}
