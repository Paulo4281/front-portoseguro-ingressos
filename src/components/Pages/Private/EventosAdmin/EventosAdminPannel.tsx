"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Repeat, Tag, MoreVertical, Search, ChevronDown, ChevronUp, CalendarClock, Ban, Users, Building2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEventFindAdmin } from "@/hooks/Event/useEventFindAdmint"
import { Skeleton } from "@/components/ui/skeleton"
import { Background } from "@/components/Background/Background"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TEvent } from "@/types/Event/TEvent"
import { DialogAdminChangeDateWarning } from "@/components/Dialog/DialogAdminChangeDateWarning/DialogAdminChangeDateWarning"
import { DialogAdminCancelEventWarning } from "@/components/Dialog/DialogAdminCancelEventWarning/DialogAdminCancelEventWarning"
import { DialogPasswordConfirmation } from "@/components/Dialog/DialogPasswordConfirmation/DialogPasswordConfirmation"
import { DialogAdminChangeDate } from "@/components/Dialog/DialogAdminChangeDate/DialogAdminChangeDate"
import { Pagination } from "@/components/Pagination/Pagination"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"

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

const EventosAdminPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchName, setSearchName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [changeDateDialogOpen, setChangeDateDialogOpen] = useState(false)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [changeDateFormDialogOpen, setChangeDateFormDialogOpen] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null)
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
    const [openCollapses, setOpenCollapses] = useState<Record<string, boolean>>({})

    const handleSearch = () => {
        setSearchQuery(searchName)
        setCurrentPage(1)
    }

    const offset = (currentPage - 1) * 30

    const { data: eventsData, isLoading, isError } = useEventFindAdmin({
        offset,
        name: searchQuery || undefined
    })

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
    const limit = responseData.limit || 30
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const handleOpenChangeDateDialog = (event: TEvent) => {
        setSelectedEvent(event)
        setSelectedEventId(event.id)
        setChangeDateDialogOpen(true)
    }

    const handleOpenCancelDialog = (event: TEvent) => {
        setSelectedEvent(event)
        setSelectedEventId(event.id)
        setCancelDialogOpen(true)
    }

    const toggleCollapse = (eventId: string) => {
        setOpenCollapses(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }))
    }

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
                                <Skeleton key={i} className="h-[500px] rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (isError || !events || events.length === 0) {
        return (
            <Background variant="light">
                <div className="min-h-screen pt-32 pb-16 px-4
                sm:px-6
                lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col items-center justify-start py-20">
                            <h2 className="text-2xl text-center font-bold text-psi-primary mb-2">
                                Nenhum evento encontrado
                            </h2>
                            <p className="text-base text-center text-psi-dark/60 max-w-md">
                                Não há eventos cadastrados no sistema no momento.
                            </p>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    return (
        <Background variant="light">
            <div className="min-h-screen pt-32 pb-16 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl
                        sm:text-5xl font-bold text-psi-primary mb-2">
                            Eventos - Administração
                        </h1>
                        <p className="text-base
                        sm:text-lg text-psi-dark/60 mb-6">
                            Gerencie todos os eventos cadastrados no sistema
                        </p>
                        
                        <div className="flex gap-3">
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
                    </div>

                    <div className="grid grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onChangeDate={handleOpenChangeDateDialog}
                                onCancel={handleOpenCancelDialog}
                                isCollapsed={openCollapses[event.id] || false}
                                onToggleCollapse={() => toggleCollapse(event.id)}
                            />
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
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

            <DialogAdminChangeDateWarning
                open={changeDateDialogOpen}
                onOpenChange={setChangeDateDialogOpen}
                event={selectedEvent}
                onConfirm={() => {
                    setPendingAction(() => () => {
                        setChangeDateFormDialogOpen(true)
                    })
                    setChangeDateDialogOpen(false)
                    setPasswordDialogOpen(true)
                }}
            />

            <DialogAdminCancelEventWarning
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                event={selectedEvent}
                onConfirm={() => {
                    setPendingAction(() => () => {
                        if (selectedEventId) {
                            console.log("Cancelar evento:", selectedEventId)
                        }
                    })
                    setCancelDialogOpen(false)
                    setPasswordDialogOpen(true)
                }}
            />

            <DialogPasswordConfirmation
                open={passwordDialogOpen}
                onOpenChange={setPasswordDialogOpen}
                onConfirm={async () => {
                    if (pendingAction) {
                        pendingAction()
                        setPendingAction(null)
                    }
                }}
                title="Confirmação de Segurança"
                description="Por motivos de segurança, digite sua senha para prosseguir com esta ação administrativa."
                isAdmin
            />

            <DialogAdminChangeDate
                open={changeDateFormDialogOpen}
                onOpenChange={setChangeDateFormDialogOpen}
                event={selectedEvent}
                onSuccess={() => {
                    setChangeDateFormDialogOpen(false)
                }}
            />
        </Background>
    )
}

export {
    EventosAdminPannel
}

type TEventCardProps = {
    event: TEvent
    onChangeDate: (event: TEvent) => void
    onCancel: (event: TEvent) => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

const EventCard = ({
    event,
    onChangeDate,
    onCancel,
    isCollapsed,
    onToggleCollapse
}: TEventCardProps) => {
    const isRecurrent = event.Recurrence && event.Recurrence.type !== "NONE"

    return (
        <div className="group rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
            <div className="relative h-60 w-full overflow-hidden">
                <Link href={`/ver-evento/${event.slug}`} target="_blank">
                    <img
                        src={ImageUtils.getEventImageUrl(event.image)}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    />
                </Link>
                <div className="absolute top-3 right-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg"
                            >
                                <MoreVertical className="h-4 w-4 text-psi-dark" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-2">
                            <DropdownMenuItem 
                                className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer"
                                onClick={() => onChangeDate(event)}
                            >
                                <CalendarClock className="h-4 w-4 mr-2 text-psi-primary" />
                                Alterar data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                            <DropdownMenuItem 
                                className="rounded-lg text-sm text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                onClick={() => onCancel(event)}
                            >
                                <Ban className="h-4 w-4 mr-2 text-destructive" />
                                Cancelar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-psi-dark mb-2 line-clamp-1">
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
                            {event.EventDates && event.EventDates.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    {event.EventDates.slice(0, 2).map((eventDate, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs text-psi-dark/60">
                                            <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                            <span>
                                                {formatDate(eventDate.date)}: {formatEventTime(eventDate.hourStart, eventDate.hourEnd)}
                                            </span>
                                        </div>
                                    ))}
                                    {event.EventDates.length > 2 && (
                                        <div className="text-xs text-psi-dark/60">
                                            +{event.EventDates.length - 2} {event.EventDates.length - 2 === 1 ? "data" : "datas"}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {isRecurrent && (
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

                    {event.EventBatches && event.EventBatches.length > 0 && (
                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-3">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-psi-primary shrink-0" />
                                <span className="text-sm font-semibold text-psi-dark">
                                    {event.EventBatches.length} {event.EventBatches.length === 1 ? "lote" : "lotes"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <Collapsible open={isCollapsed} onOpenChange={onToggleCollapse}>
                    <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between pt-4 border-t border-[#E4E6F0]">
                            <span className="text-sm font-medium text-psi-primary">
                                {isCollapsed ? "Ocultar detalhes" : "Ver mais detalhes"}
                            </span>
                            {isCollapsed ? (
                                <ChevronUp className="h-4 w-4 text-psi-primary" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-psi-primary" />
                            )}
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-3">
                        {event.description && (
                            <div className="text-sm text-psi-dark/70">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-psi-primary shrink-0" />
                                    <span className="font-medium text-psi-dark">Descrição</span>
                                </div>
                                <p className="line-clamp-3">{event.description.replace(/[#*`]/g, "").substring(0, 90)}...</p>
                            </div>
                        )}

                        {event.Organizer && (
                            <div className="text-sm text-psi-dark/70">
                                <div className="flex items-center gap-2 mb-2">
                                    <Building2 className="h-4 w-4 text-psi-primary shrink-0" />
                                    <span className="font-medium text-psi-dark">Organizador</span>
                                </div>
                                <p>{event.Organizer.companyName || "Organizador"}</p>
                            </div>
                        )}

                        {event.EventDates && event.EventDates.length > 0 && (
                            <div className="text-sm text-psi-dark/70">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-psi-primary shrink-0" />
                                    <span className="font-medium text-psi-dark">Todas as datas</span>
                                </div>
                                <div className="space-y-1">
                                    {event.EventDates.map((eventDate, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs">
                                            <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                            <span>
                                                {formatDate(eventDate.date)}: {formatEventTime(eventDate.hourStart, eventDate.hourEnd)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {event.EventBatches && event.EventBatches.length > 0 && (
                            <div className="text-sm text-psi-dark/70">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="h-4 w-4 text-psi-primary shrink-0" />
                                    <span className="font-medium text-psi-dark">Lotes</span>
                                </div>
                                <div className="space-y-2">
                                    {event.EventBatches.map((batch, index) => (
                                        <div key={index} className="rounded-lg border border-psi-primary/10 bg-psi-primary/5 p-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-psi-dark">{batch.name}</span>
                                                {batch.isActive && (
                                                    <span className="text-xs text-psi-primary font-semibold">Ativo</span>
                                                )}
                                            </div>
                                            {batch.price !== null && batch.price !== undefined && (
                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                    {ValueUtils.centsToCurrency(batch.price)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-psi-dark/60 pt-2 border-t border-psi-dark/5">
                            <p>ID: {event.id}</p>
                            <p>Slug: {event.slug}</p>
                            {event.createdAt && (
                                <p>Criado em: {formatDate(event.createdAt)}</p>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}
