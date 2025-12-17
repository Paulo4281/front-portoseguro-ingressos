"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Eye, Ticket, Edit, Trash2, TrendingUp, Repeat, Tag, MoreVertical, FileSpreadsheet, BarChart3, Share2, Download, Ban, Search, Copy, TicketIcon, Sparkle, AlertCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEventFind } from "@/hooks/Event/useEventFind"
import { Skeleton } from "@/components/ui/skeleton"
import { Background } from "@/components/Background/Background"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { DialogUpdateEventWarning } from "@/components/Dialog/DialogUpdateEventWarning/DialogUpdateEventWarning"
import { DialogCancelEventWarning } from "@/components/Dialog/DialogCancelEventWarning/DialogCancelEventWarning"
import { DialogExportBuyersList } from "@/components/Dialog/DialogExportBuyersList/DialogExportBuyersList"
import { DialogPasswordConfirmation } from "@/components/Dialog/DialogPasswordConfirmation/DialogPasswordConfirmation"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { useEventDelete } from "@/hooks/Event/useEventDelete"
import { useQueryClient } from "@tanstack/react-query"
import { Toast } from "@/components/Toast/Toast"
import { Pagination } from "@/components/Pagination/Pagination"
import { EventSalesReport } from "@/components/Report/EventSalesReport"
import { useEventClickCount } from "@/hooks/EventClick/useEventClickCount"
import { SheetTicketsToOrganizer } from "@/components/Sheet/SheetTicketsToOrganizer/SheetTicketsToOrganizer"
import { useEventVerifySold } from "@/hooks/Event/useEventVerifySold"
import { useEventSoldInValue } from "@/hooks/Event/useEventSoldInValue"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { useRouter } from "next/navigation"

type TEventWithStats = TEvent & {
    isActive: boolean
    views: number
    sales: number
    revenue: number
}

const mockStats = {
    views: 1250,
    sales: 45,
    revenue: 2250
}

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

    const activeBatch = batches.find(batch => batch.isActive)

    return activeBatch || null
}

const MeusEventosPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchName, setSearchName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const [salesReportOpen, setSalesReportOpen] = useState(false)
    const [exportBuyersListOpen, setExportBuyersListOpen] = useState(false)
    const [ticketsSheetOpen, setTicketsSheetOpen] = useState(false)
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
    const [selectedEventName, setSelectedEventName] = useState<string | null>(null)
    const [selectedEventData, setSelectedEventData] = useState<TEvent | null>(null)
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

    const router = useRouter()
    const queryClient = useQueryClient()
    const { mutateAsync: deleteEvent, isPending: isDeletingEvent } = useEventDelete()
    
    const handleSearch = () => {
        setSearchQuery(searchName)
        setCurrentPage(1)
    }
    
    const offset = (currentPage - 1) * 9
    
    const { data: eventsData, isLoading, isError } = useEventFind({
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
    const limit = responseData.limit || 10
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const handleOpenUpdateDialog = (eventId: string) => {
        setSelectedEventId(eventId)
        setUpdateDialogOpen(true)
    }

    const handleOpenExportBuyersList = (eventId: string, eventData: TEvent) => {
        setSelectedEventId(eventId)
        setSelectedEventData(eventData)
        setExportBuyersListOpen(true)
    }

    const handleOpenSalesReport = (eventId: string, eventName: string) => {
        setSelectedEventId(eventId)
        setSelectedEventName(eventName)
        setSalesReportOpen(true)
    }

    const handleOpenCancelDialog = (eventId: string) => {
        setSelectedEventId(eventId)
        setCancelDialogOpen(true)
    }

    const handleOpenTicketsSheet = (eventId: string) => {
        setSelectedEventId(eventId)
        setTicketsSheetOpen(true)
    }

    const handleOpenDeleteDialog = (eventId: string, eventName: string) => {
        setSelectedEventId(eventId)
        setSelectedEventName(eventName)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedEventId) return

        try {
            const response = await deleteEvent(selectedEventId)
            
            if (response?.success) {
                Toast.success("Evento excluído com sucesso!")
                queryClient.invalidateQueries({ queryKey: ["events", "user"] })
                setDeleteDialogOpen(false)
                setSelectedEventId(null)
                setSelectedEventName(null)
            } else {
                Toast.error("Erro ao excluir evento. Tente novamente.")
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Erro ao excluir evento. Tente novamente."
            Toast.error(errorMessage)
        }
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
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-[400px] rounded-2xl" />
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
                            <div className="mb-6">
                                <Sparkle className="h-12 w-12 text-psi-primary/40" aria-label="Sem eventos" />
                            </div>
                            <h2 className="text-2xl text-center font-bold text-psi-primary mb-2">
                                Nenhum evento cadastrado ainda
                            </h2>
                            <p className="text-base text-center text-psi-dark/60 max-w-md mb-6">
                                Você ainda não possui eventos registrados na plataforma.
                                Quando cadastrar um evento, ele aparecerá aqui para que você possa acompanhar cada detalhe com facilidade e controle total.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => router.push("/eventos/criar")}
                                aria-label="Publicar meu primeiro evento"
                                type="button"
                            >
                                Publicar meu primeiro evento
                            </Button>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    const eventsWithStats: TEventWithStats[] = events.map((event) => ({
        ...event,
        isActive: true,
        views: mockStats.views,
        sales: 0,
        revenue: 0
    }))

    return (
        <Background variant="light">
            <div className="min-h-screen pt-32 pb-16 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl
                        sm:text-5xl font-bold text-psi-primary mb-2">
                            Meus Eventos
                        </h1>
                        <p className="text-base
                        sm:text-lg text-psi-dark/60 mb-6">
                            Gerencie seus eventos e acompanhe o desempenho
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
                        {eventsWithStats.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleOpenUpdateDialog}
                                onExportBuyers={handleOpenExportBuyersList}
                                onSalesReport={handleOpenSalesReport}
                                onCancel={handleOpenCancelDialog}
                                onTickets={handleOpenTicketsSheet}
                                onDelete={handleOpenDeleteDialog}
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

            <DialogUpdateEventWarning
                open={updateDialogOpen}
                onOpenChange={setUpdateDialogOpen}
                onConfirm={() => {
                    setPendingAction(() => () => {
                        if (selectedEventId) {
                            window.location.href = `/eventos/atualizar?id=${selectedEventId}`
                        }
                    })
                    setUpdateDialogOpen(false)
                    setPasswordDialogOpen(true)
                }}
            />

            {/* <DialogCancelEventWarning
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                onConfirm={() => {
                    setPendingAction(() => () => {
                        if (selectedEventId) {
                            console.log("Cancelar evento:", selectedEventId)
                        }
                    })
                    setCancelDialogOpen(false)
                    setPasswordDialogOpen(true)
                }}
            /> */}

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
                description="Por motivos de segurança, digite sua senha para prosseguir com esta ação."
            />

            {selectedEventId && (
                <EventSalesReport
                    eventId={selectedEventId}
                    eventName={selectedEventName || undefined}
                    open={salesReportOpen}
                    onOpenChange={setSalesReportOpen}
                />
            )}

            {selectedEventId && (
                <DialogExportBuyersList
                    open={exportBuyersListOpen}
                    onOpenChange={setExportBuyersListOpen}
                    eventId={selectedEventId}
                    eventName={selectedEventName || undefined}
                    eventData={selectedEventData as TEvent}
                />
            )}

            {selectedEventId && (
                <SheetTicketsToOrganizer
                    open={ticketsSheetOpen}
                    onOpenChange={setTicketsSheetOpen}
                    eventId={selectedEventId}
                />
            )}

            <DialogConfirm
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Excluir Evento"
                description={`Tem certeza que deseja excluir o evento "${selectedEventName}"? Esta ação é irreversível e não poderá ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={isDeletingEvent}
                variant="destructive"
            />
        </Background>
    )
}

export {
    MeusEventosPannel
}

type TEventCardProps = {
    event: TEventWithStats
    onEdit: (eventId: string) => void
    onExportBuyers: (eventId: string, eventData: TEvent) => void
    onSalesReport: (eventId: string, eventName: string) => void
    onCancel: (eventId: string) => void
    onTickets: (eventId: string) => void
    onDelete: (eventId: string, eventName: string) => void
}

const EventCard = ({
    event,
    onEdit,
    onExportBuyers,
    onSalesReport,
    onCancel,
    onTickets,
    onDelete
}: TEventCardProps) => {
    const {
        data: clickCountData,
        isLoading: isLoadingClickCount
    } = useEventClickCount(event.id, !!event.id)

    const {
        data: verifySoldData,
        isLoading: isLoadingVerifySold
    } = useEventVerifySold(event.id)

    const {
        data: soldInValueData,
        isLoading: isLoadingSoldInValue
    } = useEventSoldInValue(event.id)

    const totalClicks = clickCountData?.data ?? 0

    const totalSales = verifySoldData?.data?.reduce((sum, item) => sum + (item.sold || 0), 0) ?? 0

    const totalRevenue = soldInValueData?.data?.value ?? 0

    return (
        <div
            className="group rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
        >
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
                                onClick={() => onEdit(event.id)}
                                disabled={event.isCancelled}
                            >
                                <Edit className="h-4 w-4 mr-2 text-psi-primary" />
                                Editar evento
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                            <DropdownMenuItem 
                                className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer"
                                onClick={() => onExportBuyers(event.id, event)}
                                disabled={event.isCancelled}
                            >
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-psi-primary" />
                                Gerar lista de compradores
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer"
                                onClick={() => onTickets(event.id)}
                            >
                                <TicketIcon className="h-4 w-4 mr-2 text-psi-primary" />
                                Ingressos
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer"
                                onClick={() => onSalesReport(event.id, event.name)}
                                disabled={event.isCancelled}
                            >
                                <BarChart3 className="h-4 w-4 mr-2 text-psi-primary" />
                                Relatório de Vendas e Estatísticas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                            <DropdownMenuItem className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer" disabled={event.isCancelled}>
                                <Share2 className="h-4 w-4 mr-2 text-psi-primary" />
                                Compartilhar evento
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                            {
                                event.isCancelled && (
                                    <DropdownMenuItem 
                                        className="rounded-lg text-sm text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                        onClick={() => onDelete(event.id, event.name)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                        Excluir evento
                                    </DropdownMenuItem>
                                )
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-psi-dark line-clamp-1">
                            {event.name}
                        </h3>
                        {event.isCancelled && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Cancelado
                            </span>
                        )}
                        {event.isPostponed && !event.isCancelled && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Adiado
                            </span>
                        )}
                    </div>
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
                                    {event.EventDates.map((eventDate, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs text-psi-dark/60">
                                            <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                            <span>
                                                {formatDate(eventDate.date)}: {formatEventTime(eventDate.hourStart, eventDate.hourEnd)}
                                            </span>
                                        </div>
                                    ))}
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

                    {(() => {
                        const activeBatch = getActiveBatch(event.EventBatches)
                        if (!activeBatch) return null
                        
                        return (
                            <div className="rounded-xl border flex items-center border-psi-primary/20 bg-psi-primary/5 p-3">
                                <div className="flex items-center gap-2 ">
                                    <Tag className="h-4 w-4 text-psi-primary shrink-0" />
                                    <span className="text-sm font-semibold text-psi-dark">
                                        Lote Atual: {activeBatch.name}
                                    </span>
                                </div>
                                {/* <div className="flex items-center justify-between text-xs">
                                    <span className="text-psi-dark/70">
                                        Disponível: <span className="font-semibold text-psi-dark">{activeBatch.tickets}</span>
                                    </span>
                                </div> */}
                            </div>
                        )
                    })()}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E4E6F0]">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-psi-dark/60 mb-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="text-xs">Cliques</span>
                        </div>
                        {isLoadingClickCount ? (
                            <Skeleton className="h-6 w-12 mx-auto" />
                        ) : (
                            <p className="text-lg font-bold text-psi-dark">{totalClicks}</p>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-psi-dark/60 mb-1">
                            <Ticket className="h-3.5 w-3.5" />
                            <span className="text-xs">Vendas</span>
                        </div>
                        {isLoadingVerifySold ? (
                            <Skeleton className="h-6 w-12 mx-auto" />
                        ) : (
                            <p className="text-lg font-bold text-psi-dark">{totalSales}</p>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-psi-dark/60 mb-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-xs">Receita</span>
                        </div>
                        {isLoadingSoldInValue ? (
                            <Skeleton className="h-6 w-16 mx-auto" />
                        ) : (
                            <p className="text-lg font-bold text-psi-primary">{ValueUtils.centsToCurrency(totalRevenue)}</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
