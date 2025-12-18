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
import { formatEventDate } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { Pagination } from "@/components/Pagination/Pagination"
import { DialogViewCustomer } from "./DialogViewCustomer/DialogViewCustomer"
import { DialogCancelTicketWarning } from "./DialogCancelTicketWarning/DialogCancelTicketWarning"
import type { TTicketToOrganizer } from "@/types/Ticket/TTicket"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"

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
    const [selectedTicket, setSelectedTicket] = useState<TTicketToOrganizer | null>(null)
    const [viewCustomerOpen, setViewCustomerOpen] = useState(false)
    const [cancelTicketOpen, setCancelTicketOpen] = useState(false)

    const limit = 30
    const offset = (currentPage - 1) * limit

    const { data, isLoading, isError } = useTicketFindToOrganizer({
        eventId,
        offset,
        limit,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        enabled: open && !!eventId
    })

    const tickets = useMemo(() => {
        if (!data?.data?.data) return []
        return data.data.data
    }, [data])

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

    const handleViewCustomer = (ticket: TTicketToOrganizer) => {
        setSelectedTicket(ticket)
        setViewCustomerOpen(true)
    }

    const handleCancelTicket = (ticket: TTicketToOrganizer) => {
        setSelectedTicket(ticket)
        setCancelTicketOpen(true)
    }

    const handleCancelTicketConfirm = () => {
        if (selectedTicket) {
            console.log("Cancelar ingresso:", selectedTicket.id)
        }
        setCancelTicketOpen(false)
        setSelectedTicket(null)
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
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full
                                sm:w-[200px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos os status</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                                    <SelectItem value="USED">Utilizado</SelectItem>
                                    <SelectItem value="REFUNDED">Reembolsado</SelectItem>
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
                            ) : isError || tickets.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-psi-dark/60">
                                        {isError 
                                            ? "Erro ao carregar ingressos" 
                                            : "Nenhum ingresso encontrado"}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-psi-dark/10">
                                    {tickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="p-4 hover:bg-psi-primary/5 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-psi-dark truncate">
                                                                {ticket.customer.name}
                                                            </h4>
                                                            <p className="text-sm text-psi-dark/60 truncate">
                                                                {ticket.customer.email}
                                                            </p>
                                                            {ticket.customer.phone && (
                                                                <p className="text-xs text-psi-dark/50">
                                                                    {ticket.customer.phone}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${statusColors[ticket.status] || "bg-gray-100 text-gray-800"}`}>
                                                            {statusLabels[ticket.status] || ticket.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-psi-dark/70">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">Tipo:</span>
                                                            <span>{ticket.ticketType.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">Valor:</span>
                                                            <span className="text-psi-primary font-semibold">
                                                                {ValueUtils.centsToCurrency(ticket.price)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">Comprado em:</span>
                                                            <span>
                                                                {DateUtils.formatDate(ticket.createdAt, "DD/MM/YYYY [às] HH:mm")}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {ticket.validationInfo && (
                                                        <div className="mt-3 flex items-start gap-2 text-xs text-psi-dark/70">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-px" />
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-psi-dark">Validação</p>
                                                                <p className="wrap-break-word">{formatValidationAudit(ticket)}</p>
                                                            </div>
                                                        </div>
                                                    )}
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
                                                            onClick={() => handleViewCustomer(ticket)}
                                                        >
                                                            <User className="h-4 w-4 mr-2 text-psi-dark" />
                                                            Visualizar cliente
                                                        </DropdownMenuItem>
                                                        {ticket.status === "CONFIRMED" && (
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-destructive"
                                                                onClick={() => handleCancelTicket(ticket)}
                                                            >
                                                                <Ban className="h-4 w-4 mr-2 text-destructive" />
                                                                Cancelar ingresso
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
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
                    />
                    <DialogCancelTicketWarning
                        open={cancelTicketOpen}
                        onOpenChange={setCancelTicketOpen}
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
