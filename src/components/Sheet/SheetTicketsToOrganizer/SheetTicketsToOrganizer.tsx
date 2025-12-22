"use client"

import { useState, useMemo } from "react"
import { Search, X, MoreVertical, User, Ban, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTicketFindToOrganizer } from "@/hooks/Ticket/useTicketFindToOrganizer"
import { Skeleton } from "@/components/ui/skeleton"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { Pagination } from "@/components/Pagination/Pagination"
import { DialogViewCustomer } from "./DialogViewCustomer/DialogViewCustomer"
import { DialogCancelTicketWarning } from "./DialogCancelTicketWarning/DialogCancelTicketWarning"
import { useTicketOrganizerRequestRefund } from "@/hooks/Ticket/useTicketOrganizerRequestRefund"
import { Toast } from "@/components/Toast/Toast"
import type { TTicketToOrganizer } from "@/types/Ticket/TTicket"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { ticketCancelledByConfig, refundStatusConfig } from "@/components/Pages/Private/AdmPagamentos/AdmPagamentosPannel"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ExternalLink, Calendar, Clock } from "lucide-react"
import { useEventFindByIdUser } from "@/hooks/Event/useEventFindByIdUser"

type TSheetTicketsToOrganizerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    eventId: string
}

const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    USED: "Utilizado",
    PARTIALLY_USED: "Utilizado parcialmente",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
    REFUND_REQUESTED: "Estorno solicitado",
    OVERDUE: "Vencido",
    EXPIRED: "Expirado",
    FAILED: "Falhou",
}

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    CONFIRMED: "bg-green-50 text-green-600 border-green-200",
    USED: "bg-blue-50 text-blue-600 border-blue-200",
    PARTIALLY_USED: "bg-yellow-50 text-yellow-600 border-yellow-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
    REFUNDED: "bg-gray-50 text-gray-600 border-gray-200",
    REFUND_REQUESTED: "bg-amber-50 text-amber-600 border-amber-200",
    OVERDUE: "bg-gray-50 text-gray-600 border-gray-200",
    EXPIRED: "bg-gray-50 text-gray-600 border-gray-200",
    FAILED: "bg-red-50 text-red-600 border-red-200",
}

const SheetTicketsToOrganizer = ({
    open,
    onOpenChange,
    eventId
}: TSheetTicketsToOrganizerProps) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [eventDateIdFilter, setEventDateIdFilter] = useState<string>("ALL")
    const [selectedTicket, setSelectedTicket] = useState<TTicketToOrganizer | null>(null)
    const [selectedTicketsForDialog, setSelectedTicketsForDialog] = useState<TTicketToOrganizer[]>([])
    const [viewCustomerOpen, setViewCustomerOpen] = useState(false)
    const [cancelTicketOpen, setCancelTicketOpen] = useState(false)

    const limit = 30
    const offset = (currentPage - 1) * limit

    const { data: eventData } = useEventFindByIdUser(eventId)

    const eventDates = useMemo(() => {
        if (!eventData?.data?.EventDates) return []
        return [...eventData.data.EventDates].sort((a, b) => {
            if (!a.date || !b.date) return 0
            return getDateOrderValue(a.date) - getDateOrderValue(b.date)
        })
    }, [eventData])

    const { data, isLoading, isError } = useTicketFindToOrganizer({
        eventId,
        offset,
        limit,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        eventDateId: eventDateIdFilter !== "ALL" ? eventDateIdFilter : undefined,
        enabled: open && !!eventId
    })

    const { mutateAsync: requestRefund, isPending: isRequestingRefund } = useTicketOrganizerRequestRefund()

    const tickets = useMemo(() => {
        if (!data?.data?.data) return []
        return data.data.data
    }, [data])

    const groupedTickets = useMemo(() => {
        const groups: Record<string, TTicketToOrganizer[]> = {}
        
        tickets.forEach((ticket) => {
            const groupKey = ticket.payment?.id || ticket.payment?.code || `no-payment-${ticket.customer.id}-${ticket.id}`
            
            if (!groups[groupKey]) {
                groups[groupKey] = []
            }
            
            groups[groupKey].push(ticket)
        })
        
        return Object.values(groups).map(group => ({
            tickets: group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            customer: group[0].customer,
            payment: group[0].payment,
            purchaseDate: group[0].payment?.paidAt || group[0].createdAt
        }))
    }, [tickets])

    const total = useMemo(() => {
        return data?.data?.total || 0
    }, [data])

    const totalPages = useMemo(() => {
        return total > 0 ? Math.ceil(total / limit) : 0
    }, [total, limit])

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const handleEventDateChange = (value: string) => {
        setEventDateIdFilter(value)
        setCurrentPage(1)
    }

    const handleViewCustomer = (ticket: TTicketToOrganizer, allTickets?: TTicketToOrganizer[]) => {
        setSelectedTicket(ticket)
        setViewCustomerOpen(true)
        if (allTickets) {
            setSelectedTicketsForDialog(allTickets)
        } else {
            setSelectedTicketsForDialog([ticket])
        }
    }

    const handleCancelTicket = (ticket: TTicketToOrganizer) => {
        setSelectedTicket(ticket)
        setCancelTicketOpen(true)
    }

    const handleCancelTicketConfirm = async (reason: string) => {
        if (!selectedTicket) {
            return
        }

        try {
            const response = await requestRefund({
                ticketId: selectedTicket.id,
                reason: reason
            })

            if (response?.success && response?.data) {
                if (response.data.refunded) {
                    Toast.success("Ingresso cancelado e reembolso solicitado com sucesso!")
                    setSelectedTicket(null)
                    setCancelTicketOpen(false)
                } else {
                    const errorReason = response.data.reason || "Não foi possível processar o cancelamento"
                    Toast.error(errorReason)
                }
            } else {
                Toast.error("Erro ao processar o cancelamento")
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao processar o cancelamento"
            Toast.error(errorMessage)
        }
    }

    const formatValidationAudit = (ticket: TTicketToOrganizer) => {
        const info = ticket.validationInfo
        if (!info) {
            return null
        }

        const validatedAt = info.validatedAt ? DateUtils.formatDate(info.validatedAt, "DD/MM/YYYY [às] HH:mm") : "-"
        const by = info.validatedByOrganizer ? "Organizador" : "Equipe"
        const methodLabel = info.method === "qr-scan"
            ? "Câmera"
            : info.method === "qr-image"
                ? "Foto"
                : info.method === "button"
                    ? "Botão"
                    : null

        const parts: string[] = [`${by} • ${validatedAt}`]
        if (methodLabel) {
            parts.push(`Método: ${methodLabel}`)
        }
        if (!info.validatedByOrganizer) {
            if (info.name) parts.push(`Nome: ${info.name}`)
            if (info.location) parts.push(`Local: ${info.location}`)
            if (info.ip) parts.push(`IP: ${info.ip}`)
            if (info.code) parts.push(`Código: ${info.code}`)
        }

        return parts.join(" • ")
    }

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent 
                    side="right" 
                    className="w-[90vw] sm:w-[90vw] overflow-y-auto"
                >
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold text-psi-primary">
                            Ingressos Vendidos
                        </SheetTitle>
                        <SheetDescription>
                            Gerencie e visualize todos os ingressos vendidos para este evento
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6 mx-6">
                        <div className="flex flex-col gap-3
                        sm:flex-row">
                            <div className="flex-1">
                                <Input
                                    placeholder="Pesquisar por nome, email ou telefone..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    icon={Search}
                                    className="w-full"
                                />
                            </div>
                            {eventDates.length > 0 && (
                                <Select value={eventDateIdFilter} onValueChange={handleEventDateChange}>
                                    <SelectTrigger className="w-full
                                    sm:w-[200px]">
                                        <SelectValue placeholder="Filtrar por data" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Todas as datas</SelectItem>
                                        {eventDates.map((eventDate) => (
                                            <SelectItem key={eventDate.id} value={eventDate.id}>
                                                {eventDate.date ? formatEventDate(eventDate.date, "DD/MM/YYYY") : "Sem data"}
                                                {eventDate.hourStart && ` - ${formatEventTime(eventDate.hourStart, eventDate.hourEnd)}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full
                                sm:w-[200px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos os status</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                                    <SelectItem value="USED">Utilizado</SelectItem>
                                    <SelectItem value="REFUND_REQUESTED">Estorno solicitado</SelectItem>
                                    <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-lg border border-psi-primary/20 bg-white">
                            {isLoading ? (
                                <div className="p-4 space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-20 w-full" />
                                    ))}
                                </div>
                            ) : isError || groupedTickets.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-psi-dark/60">
                                        {isError 
                                            ? "Erro ao carregar ingressos" 
                                            : "Nenhum ingresso encontrado"}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-psi-dark/10">
                                    {groupedTickets.map((group) => {
                                        const isMultipleTickets = group.tickets.length > 1
                                        const totalValue = group.tickets.reduce((sum, t) => sum + (t.price || 0), 0)
                                        
                                        return (
                                            <div
                                                key={`group-${group.payment?.id || group.payment?.code || `no-payment-${group.customer.id}`}`}
                                                className="p-4 hover:bg-psi-primary/5 transition-colors"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-semibold text-psi-dark truncate">
                                                                            {group.customer.name}
                                                                        </h4>
                                                                        {isMultipleTickets && (
                                                                            <Badge className="bg-psi-primary/10 text-psi-primary border-psi-primary/20">
                                                                                {group.tickets.length} ingressos
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-psi-dark/60 truncate">
                                                                        {group.customer.email}
                                                                    </p>
                                                                    {group.customer.phone && (
                                                                        <p className="text-xs text-psi-dark/50">
                                                                            {group.customer.phone}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs text-psi-dark/50 mt-1">
                                                                        Comprado em {DateUtils.formatDate(group.purchaseDate, "DD/MM/YYYY [às] HH:mm")}
                                                                    </p>
                                                                    {group.payment && (
                                                                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                                                                            <Badge variant="outline" className="text-psi-dark/70 border-psi-dark/20">
                                                                                {group.payment.method === "PIX" ? "PIX" : "Cartão de Crédito"}
                                                                            </Badge>
                                                                            <span className="text-psi-dark/60">
                                                                                Código: <span className="font-mono font-semibold">{group.payment.code}</span>
                                                                            </span>
                                                                            {group.payment.status && (
                                                                                <Badge 
                                                                                    className={
                                                                                        group.payment.status === "CONFIRMED" || group.payment.status === "RECEIVED"
                                                                                            ? "bg-green-50 text-green-600 border-green-200"
                                                                                            : group.payment.status === "PENDING"
                                                                                            ? "bg-amber-50 text-amber-600 border-amber-200"
                                                                                            : group.payment.status === "REFUNDED" || group.payment.status === "REFUND_REQUESTED"
                                                                                            ? "bg-red-50 text-red-600 border-red-200"
                                                                                            : "bg-gray-50 text-gray-600 border-gray-200"
                                                                                    }
                                                                                >
                                                                                    {group.payment.status === "CONFIRMED" ? "Confirmado" :
                                                                                     group.payment.status === "RECEIVED" ? "Recebido" :
                                                                                     group.payment.status === "PENDING" ? "Pendente" :
                                                                                     group.payment.status === "REFUNDED" ? "Reembolsado" :
                                                                                     group.payment.status === "REFUND_REQUESTED" ? "Estorno solicitado" :
                                                                                     group.payment.status}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {isMultipleTickets && (
                                                                        <p className="text-sm text-psi-primary font-semibold mt-1">
                                                                            Total: {ValueUtils.centsToCurrency(totalValue)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 shrink-0"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56">
                                                                <DropdownMenuItem
                                                                    className="cursor-pointer"
                                                                    onClick={() => handleViewCustomer(group.tickets[0], group.tickets)}
                                                                >
                                                                    <User className="h-4 w-4 text-psi-dark" />
                                                                    Visualizar cliente
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="space-y-3 pl-4 border-l-2 border-psi-primary/20">
                                                        {group.tickets.map((ticket, ticketIndex) => (
                                                            <div
                                                                key={ticket.id}
                                                                className="rounded-lg border border-psi-primary/10 bg-white/50 p-3 space-y-2"
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="text-xs font-medium text-psi-dark/70">
                                                                                Ingresso {ticketIndex + 1}
                                                                            </span>
                                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusColors[ticket.status] || "bg-gray-100 text-gray-800"}`}>
                                                                                {statusLabels[ticket.status] || ticket.status}
                                                                            </span>
                                                                            {ticket.cancelledBy && (
                                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusColors[ticket.cancelledBy] || "bg-gray-100 text-gray-800"}`}>
                                                                                    {ticketCancelledByConfig[ticket.cancelledBy]?.label || ticket.cancelledBy}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        
                                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-psi-dark/70">
                                                                            {ticket.ticketType?.name && (
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="font-medium">Tipo:</span>
                                                                                    <span>{ticket.ticketType.name}</span>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-center gap-1">
                                                                                <span className="font-medium">Valor:</span>
                                                                                <span className="text-psi-primary font-semibold">
                                                                                    {ValueUtils.centsToCurrency(ticket.price)}
                                                                                </span>
                                                                            </div>
                                                                            {ticket.code && (
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="font-medium">Código:</span>
                                                                                    <span className="font-mono text-psi-dark">{ticket.code}</span>
                                                                                </div>
                                                                            )}
                                                                            {ticket.eventDate?.date && (
                                                                                <div className="flex items-center gap-1">
                                                                                    <Calendar className="h-3 w-3 text-psi-primary shrink-0" />
                                                                                    <span className="font-medium">Data:</span>
                                                                                    <span>
                                                                                        {formatEventDate(ticket.eventDate.date, "DD/MM/YYYY")}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {ticket.cancelledAt && (
                                                                            <p className="text-xs text-psi-dark/50 mt-2">
                                                                                Cancelado em: {DateUtils.formatDate(ticket.cancelledAt, "DD/MM/YYYY [às] HH:mm")}
                                                                            </p>
                                                                        )}

                                                                        {ticket.validationInfo && (
                                                                            <div className="mt-2 flex items-start gap-2 text-xs text-psi-dark/70">
                                                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-px" />
                                                                                <div className="min-w-0">
                                                                                    <p className="font-semibold text-psi-dark">Validação</p>
                                                                                    <p className="wrap-break-word">{formatValidationAudit(ticket)}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {(ticket.refundStatus || ticket.refundedAt || ticket.refundReason) && (
                                                                            <div className="mt-3 pt-3 border-t border-psi-primary/20 space-y-2">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                    <AlertTriangle className="h-3.5 w-3.5 text-purple-600" />
                                                                                    Informações de Estorno Parcial
                                                                                </div>
                                                                                <div className="grid gap-2
                                                                                sm:grid-cols-2">
                                                                                    {ticket.refundStatus && (
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/60 mb-1">Status do reembolso</p>
                                                                                            <Badge className={refundStatusConfig[ticket.refundStatus]?.badgeClass || "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                                                {refundStatusConfig[ticket.refundStatus]?.label || ticket.refundStatus}
                                                                                            </Badge>
                                                                                        </div>
                                                                                    )}
                                                                                    {ticket.refundedBy && (
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/60 mb-1">Solicitado por</p>
                                                                                            <p className="text-xs font-semibold text-psi-dark font-mono">
                                                                                                {ticket.refundedBy}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                                    {ticket.refundedAt && (
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/60 mb-1">Concluído em</p>
                                                                                            <p className="text-xs font-semibold text-psi-dark">
                                                                                                {DateUtils.formatDate(ticket.refundedAt, "DD/MM/YYYY [às] HH:mm")}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                                    {ticket.refundEndToEndIndentifier && (
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/60 mb-1">ID de end to end</p>
                                                                                            <p className="text-xs font-semibold text-psi-dark">
                                                                                                {ticket.refundEndToEndIndentifier}
                                                                                            </p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                {ticket.refundReason && (
                                                                                    <div>
                                                                                        <p className="text-xs text-psi-dark/60 mb-1">Motivo do reembolso</p>
                                                                                        <p className="text-xs text-psi-dark/70 whitespace-pre-line">
                                                                                            {ticket.refundReason}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                {ticket.refundReceiptUrl && (
                                                                                    <div>
                                                                                        <a
                                                                                            href={ticket.refundReceiptUrl}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="inline-flex items-center gap-1 text-xs text-psi-primary hover:text-psi-primary/80"
                                                                                        >
                                                                                            Ver recibo do reembolso
                                                                                            <ExternalLink className="h-3 w-3" />
                                                                                        </a>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-7 w-7 p-0 shrink-0"
                                                                            >
                                                                                <MoreVertical className="h-3.5 w-3.5" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-56">
                                                                            {ticket.status === "CONFIRMED" && (
                                                                                <DropdownMenuItem
                                                                                    className="cursor-pointer text-destructive"
                                                                                    onClick={() => handleCancelTicket(ticket)}
                                                                                >
                                                                                    <Ban className="h-4 w-4 text-destructive" />
                                                                                    Cancelar ingresso
                                                                                </DropdownMenuItem>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center pt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}

                        <div className="pt-4 border-t border-psi-dark/10 mb-6">
                            <div className="flex items-center justify-between text-sm text-psi-dark/70">
                                <span>
                                    Total de ingressos: <strong className="text-psi-dark">{total}</strong>
                                </span>
                                <span>
                                    Página {currentPage} de {totalPages}
                                </span>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {selectedTicket && (
                <>
                    <DialogViewCustomer
                        open={viewCustomerOpen}
                        onOpenChange={setViewCustomerOpen}
                        ticket={selectedTicket}
                        tickets={selectedTicketsForDialog}
                    />
                    <DialogCancelTicketWarning
                        open={cancelTicketOpen}
                        onOpenChange={(open) => {
                            setCancelTicketOpen(open)
                            if (!open) {
                                setSelectedTicket(null)
                            }
                        }}
                        onConfirm={handleCancelTicketConfirm}
                        ticket={selectedTicket}
                    />
                </>
            )}
        </>
    )
}

export {
    SheetTicketsToOrganizer
}
