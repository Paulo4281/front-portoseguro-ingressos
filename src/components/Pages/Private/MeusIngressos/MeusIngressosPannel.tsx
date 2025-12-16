"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Ticket, QrCode, Copy, Share2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Eye, EyeOff, FileText, Loader2, Check, AlertTriangle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { TicketService } from "@/services/Ticket/TicketService"
import { Toast } from "@/components/Toast/Toast"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useTicketFindByUserId } from "@/hooks/Ticket/useTicketFindByUserId"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TTicket } from "@/types/Ticket/TTicket"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type TStatusConfig = {
    label: string
    description: string
    badgeClass: string
}

const statusConfig: Record<TTicket["status"], TStatusConfig> = {
    PENDING: {
        label: "Pagamento pendente",
        description: "Assim que o pagamento for confirmado enviaremos o QR Code definitivo.",
        badgeClass: "border border-psi-tertiary/90 bg-psi-tertiary/60 text-psi-dark"
    },
    CONFIRMED: {
        label: "Confirmado",
        description: "Ingresso confirmado. Apresente o QR Code no dia do evento.",
        badgeClass: "border border-emerald-200 bg-emerald-50 text-emerald-600"
    },
    CANCELLED: {
        label: "Cancelado",
        description: "Esse ingresso foi cancelado e não pode ser utilizado.",
        badgeClass: "border border-rose-200 bg-rose-50 text-rose-600"
    },
    REFUNDED: {
        label: "Estornado",
        description: "Este ingresso foi estornado e o valor foi devolvido.",
        badgeClass: "border border-amber-200 bg-amber-50 text-amber-600"
    },
    REFUND_REQUESTED: {
        label: "Estorno solicitado",
        description: "Estorno solicitado.",
        badgeClass: "border border-psi-tertiary/90 bg-psi-tertiary/60 text-psi-dark"
    },
    OVERDUE: {
        label: "Vencido",
        description: "A compra não foi paga e venceu.",
        badgeClass: "border border-psi-dark/20 bg-psi-dark/10 text-psi-dark/60"
    },
    USED: {
        label: "Utilizado",
        description: "Ingresso já validado no acesso ao evento.",
        badgeClass: "border border-psi-primary/30 bg-psi-primary/10 text-psi-primary"
    },
    PARTIALLY_USED: {
        label: "Utilizado parcialmente",
        description: "Ingresso já validado no acesso ao evento, mas parte do ingresso foi utilizada em outro dia.",
        badgeClass: "border border-psi-primary/30 bg-psi-primary/10 text-psi-primary"
    },
    EXPIRED: {
        label: "Expirado",
        description: "Ingresso não utilizado e já expirou.",
        badgeClass: "border border-psi-dark/10 bg-psi-dark/5 text-psi-dark/70"
    },
    FAILED: {
        label: "Falha",
        description: "A compra não foi realizada com sucesso.",
        badgeClass: "border border-psi-dark/10 bg-psi-dark/5 text-psi-dark/70"
    }
}

const recurrenceDayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

const refundStatusConfig: Record<string, { label: string; badgeClass: string }> = {
    PENDING: {
        label: "Pendente",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    DONE: {
        label: "Concluído",
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    CANCELLED: {
        label: "Cancelado",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    AWAITING_CRITICAL_ACTION_AUTHORIZATION: {
        label: "Aguardando autorização crítica",
        badgeClass: "bg-orange-50 text-orange-600 border-orange-200"
    },
    AWAITING_CUSTOMER_EXTERNAL_AUTHORIZATION: {
        label: "Aguardando autorização do cliente",
        badgeClass: "bg-blue-50 text-blue-600 border-blue-200"
    }
}

const getEventSchedule = (ticket: TTicket) => {
    if (ticket.TicketDates && ticket.TicketDates.length > 0) {
        const sortedDates = [...ticket.TicketDates]
            .filter(td => td.EventDate)
            .sort((a, b) => {
                const dateA = a.EventDate?.date ? getDateOrderValue(a.EventDate.date) : 0
                const dateB = b.EventDate?.date ? getDateOrderValue(b.EventDate.date) : 0
                return dateA - dateB
            })
        
        if (sortedDates.length > 0) {
            const firstDate = sortedDates[0].EventDate
            if (firstDate) {
                return {
                    dateLabel: formatEventDate(firstDate.date, "DD [de] MMMM [de] YYYY"),
                    timeLabel: formatEventTime(firstDate.hourStart, firstDate.hourEnd)
                }
            }
        }
    }

    if (ticket.Event.EventDates && ticket.Event.EventDates.length > 0) {
        const sortedDates = [...ticket.Event.EventDates].sort((a, b) =>
            getDateOrderValue(a?.date) - getDateOrderValue(b?.date)
        )
        const nextDate = sortedDates[0]

        return {
            dateLabel: formatEventDate(nextDate?.date, "DD [de] MMMM [de] YYYY"),
            timeLabel: formatEventTime(nextDate?.hourStart, nextDate?.hourEnd)
        }
    }

    if (ticket.Event.Recurrence && ticket.Event.Recurrence.type !== "NONE") {
        const baseLabel = {
            DAILY: "Evento diário",
            WEEKLY: "Evento semanal",
            MONTHLY: "Evento mensal"
        }[ticket.Event.Recurrence.type]

        let detailLabel = baseLabel

        if (ticket.Event.Recurrence.type === "WEEKLY" && ticket.Event.Recurrence.RecurrenceDays?.length) {
            const days = ticket.Event.Recurrence.RecurrenceDays
                .map((day) => recurrenceDayLabels[day.day] || `Dia ${day.day}`)
                .join(", ")
            detailLabel = `${baseLabel} (${days})`
        }

        if (ticket.Event.Recurrence.type === "MONTHLY" && ticket.Event.Recurrence.RecurrenceDays?.length) {
            const days = ticket.Event.Recurrence.RecurrenceDays
                .map((day) => `Dia ${day.day}`)
                .join(", ")
            detailLabel = `${baseLabel} (${days})`
        }

        const timeLabel = formatEventTime(ticket.Event.Recurrence.hourStart, ticket.Event.Recurrence.hourEnd)

        return {
            dateLabel: detailLabel,
            timeLabel
        }
    }

    return {
        dateLabel: formatEventDate(undefined),
        timeLabel: formatEventTime()
    }
}

const formatPurchaseDate = (date: string) => {
    return DateUtils.formatDate(date, "DD/MM/YYYY")
}

const MeusIngressosPannel = () => {
    const { user, isAuthenticated } = useAuthStore()
    const userId = user?.id || ""
    const { data: ticketsData, isLoading, isError } = useTicketFindByUserId()
    const [visibleQRCodes, setVisibleQRCodes] = useState<Record<string, boolean>>({})
    const [qrCodeData, setQrCodeData] = useState<Record<string, string>>({})
    const [loadingQRCodes, setLoadingQRCodes] = useState<Record<string, boolean>>({})
    const [pixPaymentDialogOpen, setPixPaymentDialogOpen] = useState(false)
    const [selectedTicketForPix, setSelectedTicketForPix] = useState<TTicket | null>(null)
    const [copiedPayload, setCopiedPayload] = useState(false)
    const [qrCodeZoomOpen, setQrCodeZoomOpen] = useState(false)
    const [selectedTicketForZoom, setSelectedTicketForZoom] = useState<TTicket | null>(null)

    const [tickets, setTickets] = useState<TTicket[]>([])

    useEffect(() => {
        if (ticketsData?.success && ticketsData?.data) {
            setTickets(ticketsData?.data)
        }
    }, [ticketsData])

    // const tickets = (data?.data ?? []) as TTicket[]

    const orderedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [tickets])

    const stats = useMemo(() => {
        const total = tickets.length
        const confirmed = tickets.filter((ticket) => ticket.status === "CONFIRMED" || ticket.status === "USED").length
        const pending = tickets.filter((ticket) => ticket.status === "PENDING").length
        const uniqueEvents = new Set(tickets.map((ticket) => ticket.eventId)).size

        return {
            total,
            confirmed,
            pending,
            uniqueEvents
        }
    }, [tickets])

    const toggleQRCode = async (ticketId: string) => {
        const isCurrentlyVisible = visibleQRCodes[ticketId]
        
        if (isCurrentlyVisible) {
            setVisibleQRCodes(prev => ({
                ...prev,
                [ticketId]: false
            }))
            return
        }

        if (!qrCodeData[ticketId]) {
            setLoadingQRCodes(prev => ({
                ...prev,
                [ticketId]: true
            }))

            try {
                const response = await TicketService.getTicketQRCode(ticketId)
                if (response?.success && response?.data?.token) {
                    setQrCodeData(prev => ({
                        ...prev,
                        [ticketId]: response.data.token
                    }))
                    setVisibleQRCodes(prev => ({
                        ...prev,
                        [ticketId]: true
                    }))
                } else {
                    Toast.error("Erro ao carregar QR Code")
                }
            } catch (error) {
                console.error("Erro ao buscar QR Code:", error)
                Toast.error("Erro ao carregar QR Code")
            } finally {
                setLoadingQRCodes(prev => ({
                    ...prev,
                    [ticketId]: false
                }))
            }
        } else {
            setVisibleQRCodes(prev => ({
                ...prev,
                [ticketId]: true
            }))
        }
    }

    const handleShareTicket = (ticket: TTicket) => {
        const eventUrl = `${window.location.origin}/ver-evento?id=${ticket.eventId}`
        const sharePayload = {
            title: ticket.Event.name,
            text: `Vou participar de ${ticket.Event.name} em Porto Seguro. Garanta seu ingresso também!`,
            url: eventUrl
        }

        if (navigator.share) {
            navigator.share(sharePayload).catch(() => undefined)
            return
        }

        navigator.clipboard?.writeText(eventUrl)
    }


    const handleCopyCode = (ticketId: string) => {
        navigator.clipboard?.writeText(ticketId)
    }

    const handleOpenPixPayment = (ticket: TTicket) => {
        setSelectedTicketForPix(ticket)
        setPixPaymentDialogOpen(true)
        setCopiedPayload(false)
    }

    const handleCopyPayload = async (payload: string) => {
        try {
            await navigator.clipboard?.writeText(payload)
            setCopiedPayload(true)
            Toast.success("Código PIX copiado!")
            setTimeout(() => setCopiedPayload(false), 2000)
        } catch (error) {
            Toast.error("Erro ao copiar payload")
        }
    }

    const formatExpirationDate = (dateString: string) => {
        try {
            const date = new Date(dateString.replace(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/, "$1-$2-$3T$4:$5:$6"))
            return DateUtils.formatDate(date.toISOString(), "DD/MM/YYYY [às] HH:mm")
        } catch {
            return dateString
        }
    }

    if (!isAuthenticated || !user) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-16 mt-[100px]
                sm:py-20">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="flex justify-center">
                            <AlertCircle className="h-12 w-12 text-psi-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-psi-primary
                        sm:text-4xl">
                            Acesse sua conta
                        </h1>
                        <p className="text-psi-dark/70">
                            Faça login para visualizar seu histórico de compras e acompanhar o status dos seus ingressos.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link href="/login">
                                <Button variant="primary" size="lg">
                                    Fazer login
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/cadastro">
                                <Button variant="outline" size="lg">
                                    Criar conta
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (isLoading) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-16 mt-[100px]
                sm:py-20">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-6 w-80" />
                        </div>
                        <div className="grid gap-4
                        sm:grid-cols-2
                        lg:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} className="h-32 rounded-2xl" />
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((item) => (
                                <Skeleton key={item} className="h-64 rounded-3xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (isError) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-16 mt-[100px]
                sm:py-20">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <AlertCircle className="h-12 w-12 text-psi-secondary mx-auto" />
                        <h2 className="text-2xl font-semibold text-psi-dark">Não foi possível carregar seus ingressos</h2>
                        <p className="text-psi-dark/70">
                            Tente novamente mais tarde ou atualize a página.
                        </p>
                        <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
                            Tentar novamente
                        </Button>
                    </div>
                </div>
            </Background>
        )
    }

    const hasTickets = orderedTickets.length > 0

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-10 mt-[100px]
            sm:py-12">
                <div className="space-y-10">
                    <div className="space-y-3">
                        <div className="inline-flex items-center text-2xl gap-2 rounded-full border border-psi-primary/30 bg-psi-primary/10 px-4 py-1 font-medium text-psi-primary">
                            <Ticket className="size-5" />
                            Meus ingressos
                        </div>
                        <div className="space-y-2">
                            <p className="text-psi-dark/70 max-w-2xl">
                                Acompanhe o status dos seus ingressos, confirme pagamentos, acesse QR Codes e compartilhe com seus amigos.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-psi-primary/20 bg-white p-6 shadow-sm w-full max-w-7xl mx-auto">
                        <div className="flex flex-col gap-6
                        sm:flex-row
                        sm:items-center
                        sm:justify-between">
                            <div className="flex-1 flex flex-col gap-2">
                                <h2 className="text-lg font-semibold text-psi-primary">
                                    Resumo dos seus ingressos
                                </h2>
                                <p className="text-sm text-psi-dark/70">
                                    Veja o status e os detalhes dos seus ingressos comprados na plataforma.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-5
                            sm:gap-8">
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-psi-dark/60">Total</span>
                                    <span className="text-2xl font-bold text-psi-primary">{stats.total}</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-emerald-600/80">Confirmados</span>
                                    <span className="text-2xl font-bold text-emerald-600">{stats.confirmed}</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-psi-dark">Pendentes</span>
                                    <span className="text-2xl font-bold text-psi-dark">{stats.pending}</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-psi-dark/60">Eventos</span>
                                    <span className="text-2xl font-bold text-psi-dark">{stats.uniqueEvents}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!hasTickets && (
                        <div className="rounded-3xl border border-dashed border-psi-primary/30 bg-white p-10 text-center space-y-6 shadow-sm">
                            <div className="flex justify-center">
                                <ShieldCheck className="h-12 w-12 text-psi-primary" />
                            </div>
                            <h2 className="text-2xl font-semibold text-psi-dark">Você ainda não possui ingressos</h2>
                            <p className="text-psi-dark/70 max-w-2xl mx-auto">
                                Explore os eventos disponíveis em Porto Seguro e garanta ingressos exclusivos com as menores taxas da região.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Link href="/ver-eventos">
                                    <Button variant="primary" size="lg">
                                        Explorar eventos
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {hasTickets && (
                        <div className="space-y-8">
                            {orderedTickets.map((ticket) => {
                                const schedule = getEventSchedule(ticket)
                                const status = statusConfig[ticket.status]
                                const isPendingPayment = ticket.status === "PENDING"
                                const canShowQRCode = ticket.status === "CONFIRMED" || ticket.status === "USED"
                                const isQRCodeVisible = visibleQRCodes[ticket.id] || false
                                const hasForm = ticket.form && (
                                    (ticket.form.text && ticket.form.text.length > 0) ||
                                    (ticket.form.email && ticket.form.email.length > 0) ||
                                    (ticket.form.textArea && ticket.form.textArea.length > 0) ||
                                    (ticket.form.select && ticket.form.select.length > 0) ||
                                    (ticket.form.multiSelect && ticket.form.multiSelect.length > 0)
                                )
                                const hasPixQrCode = ticket.Payment?.method === "PIX" && 
                                                    ticket.Payment?.status === "PENDING" && 
                                                    ticket.Payment?.qrcodeData

                                return (
                                    <div
                                        key={ticket.id}
                                        className="relative overflow-visible rounded-3xl border border-white/40 bg-linear-to-br from-white to-psi-primary/5 p-6 shadow-lg shadow-psi-primary/5 hover:shadow-xl hover:shadow-psi-primary/20 transition-all duration-500
                                        before:content-[''] before:absolute before:top-1/2 before:-left-6 before:-translate-y-1/2 before:w-12 before:h-12 before:rounded-full before:bg-[#F4F6FB]
                                        after:content-[''] after:absolute after:top-1/2 after:-right-6 after:-translate-y-1/2 after:w-12 after:h-12 after:rounded-full after:bg-[#F4F6FB]"
                                    >
                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-4
                                            lg:flex-row
                                            lg:items-start
                                            lg:gap-6">
                                                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-psi-dark/5
                                                sm:h-64
                                                lg:h-[260px]
                                                lg:w-80
                                                lg:shrink-0">
                                                    <img
                                                        src={ImageUtils.getEventImageUrl(ticket.Event.image)}
                                                        alt={ticket.Event.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                </div>

                                                <div className="hidden lg:flex lg:w-14 lg:justify-center lg:py-4">
                                                    <div className="w-px h-full border-l border-dashed border-psi-primary/30 relative">
                                                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F4F6FB]" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-wrap items-start gap-3 justify-between">
                                                        <div className="space-y-1">
                                                            <h3 className="text-2xl font-semibold text-psi-dark">{ticket.Event.name}</h3>
                                                            <p className="text-sm text-psi-dark/60">
                                                                Comprado em {formatPurchaseDate(ticket.createdAt)}
                                                            </p>
                                                        </div>
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${status.badgeClass}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>

                                                    <div className="grid gap-4
                                                    sm:grid-cols-2">
                                                        <div className="space-y-3 rounded-2xl border border-psi-primary/20 bg-white/80 p-4 shadow-sm">
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-psi-dark">
                                                                <Calendar className="h-4 w-4 text-psi-primary" />
                                                                Data e horário
                                                            </div>
                                                            <p className="text-sm text-psi-dark">{schedule.dateLabel}</p>
                                                            {schedule.timeLabel && (
                                                                <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                                    <Clock className="h-4 w-4 text-psi-primary" />
                                                                    {schedule.timeLabel}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="space-y-3 rounded-2xl border border-psi-primary/20 bg-white/80 p-4 shadow-sm">
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-psi-dark">
                                                                <MapPin className="h-4 w-4 text-psi-primary" />
                                                                Local
                                                            </div>
                                                            <p className="text-sm text-psi-dark">
                                                                {ticket.Event.location || "Local a definir"}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/60">
                                                                QR Code validado diretamente na entrada.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-4
                                                    sm:grid-cols-3">
                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white p-4 shadow-sm space-y-1">
                                                            <p className="text-xs uppercase text-psi-dark/50 tracking-wide">Lote</p>
                                                            <p className="text-sm font-semibold text-psi-dark">
                                                                {ticket.EventBatch?.name || "Ingresso único"}
                                                            </p>
                                                            {ticket.TicketType && (
                                                                <p className="text-xs text-psi-primary font-medium mt-1">
                                                                    {ticket.TicketType.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white p-4 shadow-sm space-y-1">
                                                            <p className="text-xs uppercase text-psi-dark/50 tracking-wide">Valor pago</p>
                                                            <p className="text-2xl font-semibold text-psi-primary">
                                                                {ticket.Payment?.totalPaidByCustomer 
                                                                    ? ValueUtils.centsToCurrency(ticket.Payment.totalPaidByCustomer)
                                                                    : ValueUtils.centsToCurrency(ticket.price)
                                                                }
                                                            </p>
                                                            <p className="text-xs text-psi-dark/60">Taxas já inclusas</p>
                                                            <hr />
                                                            <p className="text-xs text-psi-dark/60">Código da compra: <span className="font-semibold text-psi-dark text-sm">{ticket.Payment?.code}</span></p>
                                                            {
                                                                ticket.Payment?.transactionReceiptUrl && (
                                                                    <Link href={ticket.Payment.transactionReceiptUrl} target="_blank" className="text-xs flex items-center gap-1 mt-2 text-psi-dark/60">
                                                                        <FileText className="h-4 w-4 text-psi-primary" />
                                                                        Ver recibo
                                                                    </Link>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white p-4 shadow-sm space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <QrCode className="h-5 w-5 text-psi-primary" />
                                                                <p className="text-xs uppercase text-psi-dark/50 tracking-wide">Código</p>
                                                            </div>
                                                            {canShowQRCode && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full"
                                                                    onClick={() => toggleQRCode(ticket.id)}
                                                                    disabled={loadingQRCodes[ticket.id]}
                                                                >
                                                                    {loadingQRCodes[ticket.id] ? (
                                                                        <>
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                            Carregando...
                                                                        </>
                                                                    ) : isQRCodeVisible ? (
                                                                        <>
                                                                            <EyeOff className="h-4 w-4 mr-2" />
                                                                            Ocultar QR Code
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Eye className="h-4 w-4 mr-2" />
                                                                            Mostrar QR Code
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                            {isQRCodeVisible && canShowQRCode && qrCodeData[ticket.id] && (
                                                                <div 
                                                                    className="flex justify-center p-4 bg-psi-light rounded-lg cursor-pointer hover:bg-psi-primary/5 transition-colors"
                                                                    onClick={() => {
                                                                        setSelectedTicketForZoom(ticket)
                                                                        setQrCodeZoomOpen(true)
                                                                    }}
                                                                    title="Clique para ampliar"
                                                                >
                                                                    <QRCodeSVG
                                                                        value={qrCodeData[ticket.id]}
                                                                        size={200}
                                                                        level="H"
                                                                        includeMargin={true}
                                                                    />
                                                                </div>
                                                            )}
                                                            <p className="text-xs text-psi-dark/60">{status.description}</p>
                                                        </div>
                                                    </div>

                                                    {hasForm && (
                                                        <div className="rounded-2xl border border-psi-primary/20 bg-white/80 p-4 shadow-sm space-y-4">
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-psi-dark">
                                                                <FileText className="h-4 w-4 text-psi-primary" />
                                                                Respostas do Formulário
                                                            </div>
                                                            <div className="space-y-3">
                                                                {ticket.form?.text && ticket.form.text.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        {ticket.form.text.map((item, index) => (
                                                                            <div key={index} className="text-sm">
                                                                                <p className="font-medium text-psi-dark/70">{item.label}</p>
                                                                                <p className="text-psi-dark">{item.answer || "-"}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {ticket.form?.email && ticket.form.email.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        {ticket.form.email.map((item, index) => (
                                                                            <div key={index} className="text-sm">
                                                                                <p className="font-medium text-psi-dark/70">{item.label}</p>
                                                                                <p className="text-psi-dark">{item.answer || "-"}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {ticket.form?.textArea && ticket.form.textArea.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        {ticket.form.textArea.map((item, index) => (
                                                                            <div key={index} className="text-sm">
                                                                                <p className="font-medium text-psi-dark/70">{item.label}</p>
                                                                                <p className="text-psi-dark whitespace-pre-wrap">{item.answer || "-"}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {ticket.form?.select && ticket.form.select.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        {ticket.form.select.map((item, index) => (
                                                                            <div key={index} className="text-sm">
                                                                                <p className="font-medium text-psi-dark/70">{item.label}</p>
                                                                                <p className="text-psi-dark">{item.answer || "-"}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {ticket.form?.multiSelect && ticket.form.multiSelect.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        {ticket.form.multiSelect.map((item, index) => (
                                                                            <div key={index} className="text-sm">
                                                                                <p className="font-medium text-psi-dark/70">{item.label}</p>
                                                                                <p className="text-psi-dark">{item.answer || "-"}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(ticket.status === "REFUND_REQUESTED" || ticket.status === "REFUNDED" || ticket.Payment?.refundStatus) && (
                                                        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm space-y-4">
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-psi-dark">
                                                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                                Status do Reembolso
                                                            </div>
                                                            <div className="grid gap-3
                                                            sm:grid-cols-2">
                                                                {ticket.Payment?.refundStatus && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs text-psi-dark/60">Status</p>
                                                                        <Badge className={refundStatusConfig[ticket.Payment.refundStatus]?.badgeClass || "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                            {refundStatusConfig[ticket.Payment.refundStatus]?.label || ticket.Payment.refundStatus}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {ticket.Payment?.refundedAt && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs text-psi-dark/60">Concluído em</p>
                                                                        <p className="text-sm font-semibold text-psi-dark">
                                                                            {DateUtils.formatDate(ticket.Payment.refundedAt, "DD/MM/YYYY [às] HH:mm")}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {ticket.status === "REFUND_REQUESTED" && !ticket.Payment?.refundedAt && (
                                                                <div className="rounded-lg border border-amber-200 bg-amber-100/50 p-3">
                                                                    <p className="text-xs text-amber-800">
                                                                        Seu pedido de reembolso está sendo processado. Você será notificado quando o reembolso for concluído.
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {ticket.Payment?.refundStatus === "DONE" && ticket.Payment?.refundedAt && (
                                                                <div className="rounded-lg border border-emerald-200 bg-emerald-100/50 p-3">
                                                                    <p className="text-xs text-emerald-800">
                                                                        Seu reembolso foi concluído com sucesso. O valor será creditado na sua conta em até 3 dias úteis.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col gap-3
                                                    lg:flex-row
                                                    lg:flex-wrap">
                                                        {isPendingPayment && (
                                                            <Button
                                                                variant="tertiary"
                                                                size="lg"
                                                                className="flex-1 min-w-[200px]"
                                                                onClick={() => hasPixQrCode ? handleOpenPixPayment(ticket) : undefined}
                                                            >
                                                                Realizar pagamento
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="lg"
                                                            className="flex-1 min-w-[200px]"
                                                            onClick={() => handleShareTicket(ticket)}
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                            Compartilhar
                                                        </Button>
                                                        <Link href={`/ver-evento/${ticket.Event.slug}`} className="flex-1 min-w-[200px]">
                                                            <Button
                                                                variant="secondary"
                                                                size="lg"
                                                                className="w-full"
                                                            >
                                                                Ver detalhes do evento
                                                                <ArrowRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={pixPaymentDialogOpen} onOpenChange={setPixPaymentDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pagamento via PIX</DialogTitle>
                        <DialogDescription>
                            Escaneie o QR Code ou copie o código para realizar o pagamento
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTicketForPix?.Payment?.qrcodeData && (
                        <div className="space-y-4 mt-4">
                            <div className="flex flex-col items-center space-y-3">
                                {selectedTicketForPix.Payment.qrcodeData.encodedImage ? (
                                    <div className="p-4 bg-white rounded-lg border border-psi-primary/20">
                                        <img
                                            src={`data:image/png;base64,${selectedTicketForPix.Payment.qrcodeData.encodedImage}`}
                                            alt="QR Code PIX"
                                            className="w-64 h-64"
                                        />
                                    </div>
                                ) : selectedTicketForPix.Payment.qrcodeData.payload ? (
                                    <div className="p-4 bg-white rounded-lg border border-psi-primary/20">
                                        <QRCodeSVG
                                            value={selectedTicketForPix.Payment.qrcodeData.payload}
                                            size={256}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                ) : null}

                                {selectedTicketForPix.Payment.qrcodeData.expirationDate && (
                                    <div className="text-center">
                                        <p className="text-sm text-psi-dark/60">Vencimento</p>
                                        <p className="text-sm font-semibold text-psi-dark">
                                            {formatExpirationDate(selectedTicketForPix.Payment.qrcodeData.expirationDate)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedTicketForPix.Payment.qrcodeData.payload && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">Código PIX (Copiar e Colar)</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-3 bg-psi-light rounded-lg border border-psi-primary/20">
                                            <p className="text-xs font-mono text-psi-dark break-all">
                                                {selectedTicketForPix.Payment.qrcodeData.payload}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => selectedTicketForPix.Payment?.qrcodeData?.payload && handleCopyPayload(selectedTicketForPix.Payment.qrcodeData.payload)}
                                            className="shrink-0"
                                        >
                                            {copiedPayload ? (
                                                <Check className="h-4 w-4 text-emerald-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {selectedTicketForPix.Payment.qrcodeData.description && (
                                <div className="rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-3">
                                    <p className="text-sm text-psi-dark">
                                        {selectedTicketForPix.Payment.qrcodeData.description}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-end pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPixPaymentDialogOpen(false)}
                                >
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={qrCodeZoomOpen} onOpenChange={setQrCodeZoomOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>QR Code do Ingresso</DialogTitle>
                        <DialogDescription>
                            Apresente este QR Code na entrada do evento
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTicketForZoom && qrCodeData[selectedTicketForZoom.id] && (
                        <div className="flex flex-col items-center space-y-4 mt-4">
                            <div className="p-2 bg-white rounded-lg border border-psi-primary/20">
                                <QRCodeSVG
                                    value={qrCodeData[selectedTicketForZoom.id]}
                                    size={300}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-psi-dark/60">Evento</p>
                                <p className="text-sm font-semibold text-psi-dark">
                                    {selectedTicketForZoom.Event.name}
                                </p>
                            </div>
                            <div className="flex items-center justify-end w-full pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setQrCodeZoomOpen(false)}
                                >
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    MeusIngressosPannel
}