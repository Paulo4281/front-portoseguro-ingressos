"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Ticket, QrCode, Copy, Share2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Eye, EyeOff, FileText, Loader2, Check, AlertTriangle, TicketCheck, RefreshCw, Shield, Download } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { TicketService } from "@/services/Ticket/TicketService"
import { Toast } from "@/components/Toast/Toast"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useTicketFindByUserId } from "@/hooks/Ticket/useTicketFindByUserId"
import { useTicketCustomerRequestRefund } from "@/hooks/Ticket/useTicketCustomerRequestRefund"
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
        description: "Assim que o pagamento for confirmado enviaremos o QR Code.",
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

    if (ticket.Event.Recurrence) {
        const baseLabel = {
            DAILY: "Evento diário",
            WEEKLY: "Evento semanal",
            MONTHLY: "Evento mensal"
        }[ticket.Event.Recurrence.type]

        let detailLabel = baseLabel

        if (ticket.Event.Recurrence.type === "WEEKLY" && ticket.Event.Recurrence.day !== null && ticket.Event.Recurrence.day !== undefined) {
            const dayLabel = recurrenceDayLabels[ticket.Event.Recurrence.day] || `Dia ${ticket.Event.Recurrence.day}`
            detailLabel = `${baseLabel} (${dayLabel})`
        }

        if (ticket.Event.Recurrence.type === "MONTHLY" && ticket.Event.Recurrence.day !== null && ticket.Event.Recurrence.day !== undefined) {
            detailLabel = `${baseLabel} (Dia ${ticket.Event.Recurrence.day})`
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

const renderFormFields = (form: TTicket["form"]) => {
    if (!form) return null

    const hasAnyFields = (
        (form.text && form.text.length > 0) ||
        (form.email && form.email.length > 0) ||
        (form.textArea && form.textArea.length > 0) ||
        (form.select && form.select.length > 0) ||
        (form.multiSelect && form.multiSelect.length > 0)
    )

    if (!hasAnyFields) return null

    return (
        <div className="space-y-3">
            {form.text && form.text.length > 0 && (
                <div className="space-y-2">
                    {form.text.map((item, index) => (
                        <div key={index} className="text-sm">
                            <p className="font-medium text-psi-dark/70">{item.label}</p>
                            <p className="text-psi-dark">{item.answer || "-"}</p>
                        </div>
                    ))}
                </div>
            )}
            {form.email && form.email.length > 0 && (
                <div className="space-y-2">
                    {form.email.map((item, index) => (
                        <div key={index} className="text-sm">
                            <p className="font-medium text-psi-dark/70">{item.label}</p>
                            <p className="text-psi-dark">{item.answer || "-"}</p>
                        </div>
                    ))}
                </div>
            )}
            {form.textArea && form.textArea.length > 0 && (
                <div className="space-y-2">
                    {form.textArea.map((item, index) => (
                        <div key={index} className="text-sm">
                            <p className="font-medium text-psi-dark/70">{item.label}</p>
                            <p className="text-psi-dark whitespace-pre-wrap">{item.answer || "-"}</p>
                        </div>
                    ))}
                </div>
            )}
            {form.select && form.select.length > 0 && (
                <div className="space-y-2">
                    {form.select.map((item, index) => (
                        <div key={index} className="text-sm">
                            <p className="font-medium text-psi-dark/70">{item.label}</p>
                            <p className="text-psi-dark">{item.answer || "-"}</p>
                        </div>
                    ))}
                </div>
            )}
            {form.multiSelect && form.multiSelect.length > 0 && (
                <div className="space-y-2">
                    {form.multiSelect.map((item, index) => (
                        <div key={index} className="text-sm">
                            <p className="font-medium text-psi-dark/70">{item.label}</p>
                            <p className="text-psi-dark">{item.answer || "-"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
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
    const [qrCodeDownloadDialogOpen, setQrCodeDownloadDialogOpen] = useState(false)
    const [selectedTicketForDownload, setSelectedTicketForDownload] = useState<TTicket | null>(null)
    const [isDownloadingQrCode, setIsDownloadingQrCode] = useState(false)
    const [postponedRefundDialogOpen, setPostponedRefundDialogOpen] = useState(false)
    const [selectedTicketForRefund, setSelectedTicketForRefund] = useState<TTicket | null>(null)

    const { mutateAsync: requestRefund, isPending: isRequestingRefund } = useTicketCustomerRequestRefund()

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

    const groupedTickets = useMemo(() => {
        const groups: Record<string, TTicket[]> = {}
        
        orderedTickets.forEach((ticket) => {
            const groupKey = `${ticket.eventId}-${ticket.Payment?.id || 'no-payment'}`
            
            if (!groups[groupKey]) {
                groups[groupKey] = []
            }
            
            groups[groupKey].push(ticket)
        })
        
        return Object.values(groups).map(group => ({
            tickets: group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
            event: group[0].Event,
            payment: group[0].Payment,
            purchaseDate: group[0].createdAt
        }))
    }, [orderedTickets])

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

    const ensureQrCodeData = async (ticketId: string) => {
        if (qrCodeData[ticketId]) {
            return qrCodeData[ticketId]
        }

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
                return response.data.token
            }
            Toast.error("Erro ao carregar QR Code")
            return null
        } catch (error) {
            console.error("Erro ao buscar QR Code:", error)
            Toast.error("Erro ao carregar QR Code")
            return null
        } finally {
            setLoadingQRCodes(prev => ({
                ...prev,
                [ticketId]: false
            }))
        }
    }

    const handleOpenQrCodeDownloadDialog = (ticket: TTicket) => {
        setSelectedTicketForDownload(ticket)
        setQrCodeDownloadDialogOpen(true)
    }

    const handleDownloadQrCode = async () => {
        if (!selectedTicketForDownload) return
        setIsDownloadingQrCode(true)

        try {
            const token = await ensureQrCodeData(selectedTicketForDownload.id)
            if (!token) {
                return
            }

            const qrCodeElement = document.getElementById(`ticket-qr-download-${selectedTicketForDownload.id}`)
            if (!qrCodeElement) {
                Toast.error("Erro ao gerar QR Code")
                return
            }

            const svg = qrCodeElement.querySelector("svg")
            if (!svg) {
                Toast.error("Erro ao gerar QR Code")
                return
            }

            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            const img = new Image()

            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx?.drawImage(img, 0, 0)
                
                canvas.toBlob((blob) => {
                    if (!blob) return
                    
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `qrcode-ingresso-${selectedTicketForDownload.Event.slug}.jpg`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                    
                    Toast.success("QR Code baixado com sucesso!")
                    setQrCodeDownloadDialogOpen(false)
                    setSelectedTicketForDownload(null)
                }, "image/jpeg", 0.95)
            }

            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
        } catch (error) {
            Toast.error("Erro ao baixar QR Code")
        } finally {
            setIsDownloadingQrCode(false)
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

    const handleRequestRefund = async (ticket: TTicket) => {
        if (ticket.Event.isPostponed && !ticket.Event.isCancelled) {
            setSelectedTicketForRefund(ticket)
            setPostponedRefundDialogOpen(true)
            return
        }

        try {
            await requestRefund({ ticketId: ticket.id })
            Toast.success("Solicitação de reembolso enviada com sucesso!")
            window.location.reload()
        } catch (error) {
            Toast.error("Erro ao solicitar reembolso. Tente novamente.")
        }
    }

    const handleConfirmPostponedRefund = async () => {
        if (!selectedTicketForRefund) return

        try {
            await requestRefund({ ticketId: selectedTicketForRefund.id })
            Toast.success("Solicitação de reembolso enviada com sucesso!")
            setPostponedRefundDialogOpen(false)
            setSelectedTicketForRefund(null)
            window.location.reload()
        } catch (error) {
            Toast.error("Erro ao solicitar reembolso. Tente novamente.")
        }
    }

    const wasPurchasedBeforePostponement = (ticket: TTicket): boolean => {
        if (!ticket.Event.isPostponed || ticket.Event.isCancelled) return false
        if (!ticket.Event.postponedAt || !ticket.Payment?.paidAt) return false
        
        const postponedDate = new Date(ticket.Event.postponedAt)
        const paidDate = new Date(ticket.Payment.paidAt)
        
        return paidDate < postponedDate
    }

    const canRequestRefund = (ticket: TTicket) => {
        if (!ticket.Event.isCancelled && !ticket.Event.isPostponed) return false
        if (ticket.status === "REFUNDED" || ticket.status === "REFUND_REQUESTED") return false
        if (ticket.Payment?.refundStatus === "DONE" || ticket.Payment?.refundStatus === "PENDING") return false
        
        if (ticket.Event.isPostponed && !ticket.Event.isCancelled) {
            if (!wasPurchasedBeforePostponement(ticket)) return false
        }
        
        return true
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
                        <h1 className="text-3xl font-semibold text-psi-primary
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
                        <h2 className="text-2xl font-medium text-psi-dark">Não foi possível carregar seus ingressos</h2>
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
                                <h2 className="text-lg font-medium text-psi-primary">
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
                                    <span className="text-2xl font-semibold text-psi-primary">{stats.total}</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-emerald-600/80">Confirmados</span>
                                    <span className="text-2xl font-semibold text-emerald-600">{stats.confirmed}</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-psi-dark">Pendentes</span>
                                    <span className="text-2xl font-semibold text-psi-dark">{stats.pending}</span>
                                </div>
                                <div className="flex flex-col items-center min-w-[88px]">
                                    <span className="text-xs text-psi-dark/60">Eventos</span>
                                    <span className="text-2xl font-semibold text-psi-dark">{stats.uniqueEvents}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!hasTickets && (
                        <div className="rounded-3xl border border-dashed border-psi-primary/30 bg-white p-10 text-center space-y-6 shadow-sm">
                            <div className="flex justify-center">
                                <TicketCheck className="h-12 w-12 text-psi-primary" />
                            </div>
                            <h2 className="text-2xl font-medium text-psi-dark">Você ainda não possui ingressos</h2>
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
                            {groupedTickets.map((group, groupIndex) => {
                                const firstTicket = group.tickets[0]
                                const isMultipleTickets = group.tickets.length > 1
                                const isCancelled = group.event.isCancelled
                                const isPostponed = group.event.isPostponed && wasPurchasedBeforePostponement(firstTicket)
                                const hasForm = firstTicket.form && (
                                    (firstTicket.form.text && firstTicket.form.text.length > 0) ||
                                    (firstTicket.form.email && firstTicket.form.email.length > 0) ||
                                    (firstTicket.form.textArea && firstTicket.form.textArea.length > 0) ||
                                    (firstTicket.form.select && firstTicket.form.select.length > 0) ||
                                    (firstTicket.form.multiSelect && firstTicket.form.multiSelect.length > 0)
                                )
                                
                                const hasFormForEachTicket = isMultipleTickets && 
                                    group.tickets.every(ticket => {
                                        if (!ticket.form) return false
                                        return (
                                            (ticket.form.text && ticket.form.text.length > 0) ||
                                            (ticket.form.email && ticket.form.email.length > 0) ||
                                            (ticket.form.textArea && ticket.form.textArea.length > 0) ||
                                            (ticket.form.select && ticket.form.select.length > 0) ||
                                            (ticket.form.multiSelect && ticket.form.multiSelect.length > 0)
                                        )
                                    })
                                const hasPixQrCode = (group.payment?.method === "PIX" || group.payment?.method === "LINK") && 
                                                    group.payment?.status === "PENDING" && 
                                                    group.payment?.qrcodeData
                                const hasPartialRefund = group.tickets.some(t => 
                                    t.refundStatus !== null && t.refundStatus !== undefined
                                )
                                const hasRefundInfo = !hasPartialRefund && group.tickets.some(t => 
                                    t.status === "REFUND_REQUESTED" || 
                                    t.status === "REFUNDED" || 
                                    t.Payment?.refundStatus
                                )
                                const totalPaid = group.payment?.totalPaidByCustomer || 
                                    group.tickets.reduce((sum, t) => sum + (t.price || 0), 0)
                                const showRefundButton = group.tickets.some(t => canRequestRefund(t))

                                return (
                                    <div
                                        key={`group-${groupIndex}`}
                                        className={`relative overflow-visible rounded-3xl border p-6 shadow-lg transition-all duration-500
                                        before:content-[''] before:absolute before:top-1/2 before:-left-6 before:-translate-y-1/2 before:w-12 before:h-12 before:rounded-full
                                        after:content-[''] after:absolute after:top-1/2 after:-right-6 after:-translate-y-1/2 after:w-12 after:h-12 after:rounded-full
                                        ${
                                            isCancelled 
                                                ? "border-rose-300/50 bg-linear-to-br from-rose-50/80 to-rose-100/40 shadow-rose-200/20 hover:shadow-rose-300/30 before:bg-rose-50 after:bg-rose-50"
                                                : isPostponed
                                                ? "border-amber-300/50 bg-linear-to-br from-amber-50/80 to-amber-100/40 shadow-amber-200/20 hover:shadow-amber-300/30 before:bg-amber-50 after:bg-amber-50"
                                                : "border-white/40 bg-linear-to-br from-white to-psi-primary/5 shadow-psi-primary/5 hover:shadow-xl hover:shadow-psi-primary/20 before:bg-[#F4F6FB] after:bg-[#F4F6FB]"
                                        }`}
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
                                                        src={ImageUtils.getEventImageUrl(group.event.image)}
                                                        alt={group.event.name}
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
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h3 className="text-2xl font-medium text-psi-dark">{group.event.name}</h3>
                                                                {isMultipleTickets && (
                                                                    <Badge className="bg-psi-primary/10 text-psi-primary border-psi-primary/20">
                                                                        {group.tickets.length} ingressos
                                                                    </Badge>
                                                                )}
                                                                {isCancelled && (
                                                                    <Badge className="bg-rose-100 text-rose-700 border-rose-300 font-medium">
                                                                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                                        Evento Cancelado
                                                                    </Badge>
                                                                )}
                                                                {isPostponed && !isCancelled && (
                                                                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 font-medium">
                                                                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                                        Evento Adiado
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-psi-dark/60">
                                                                Comprado em {formatPurchaseDate(group.purchaseDate)}
                                                            </p>
                                                            {(isCancelled || isPostponed) && (
                                                                <div className={`mt-3 p-3 rounded-lg border ${
                                                                    isCancelled 
                                                                        ? "bg-rose-50 border-rose-200"
                                                                        : "bg-amber-50 border-amber-200"
                                                                }`}>
                                                                    <p className={`text-sm font-medium ${
                                                                        isCancelled ? "text-rose-800" : "text-amber-800"
                                                                    }`}>
                                                                        {isCancelled 
                                                                            ? "Este evento foi cancelado. O reembolso será processado automaticamente ou você pode solicitar manualmente."
                                                                            : "Este evento foi adiado. Se você não puder comparecer na nova data, pode solicitar o reembolso."
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-4
                                                    sm:grid-cols-2">
                                                        <div className="space-y-3 rounded-2xl border border-psi-primary/20 bg-white/80 p-4 shadow-sm">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-psi-dark">
                                                                <MapPin className="h-4 w-4 text-psi-primary" />
                                                                Local
                                                            </div>
                                                            <p className="text-sm text-psi-dark">
                                                                {group.event.location || "Local a definir"}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/60">
                                                                QR Code validado diretamente na entrada.
                                                            </p>
                                                        </div>

                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white p-4 shadow-sm space-y-1">
                                                            <p className="text-xs uppercase text-psi-dark/50 tracking-wide">Valor total pago</p>
                                                            <p className="text-2xl font-medium text-psi-primary">
                                                                {ValueUtils.centsToCurrency(totalPaid)}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/60">Taxas já inclusas</p>
                                                            <hr className="my-2" />
                                                            <p className="text-xs text-psi-dark/60">Código da compra: <span className="font-medium text-psi-dark text-sm">{group.payment?.code}</span></p>
                                                            {group.payment?.transactionReceiptUrl && (
                                                                <Link href={group.payment.transactionReceiptUrl} target="_blank" className="text-xs flex items-center gap-1 mt-2 text-psi-dark/60">
                                                                    <FileText className="h-4 w-4 text-psi-primary" />
                                                                    Ver recibo
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 text-lg font-medium text-psi-dark">
                                                            <Ticket className="h-5 w-5 text-psi-primary" />
                                                            {isMultipleTickets ? "Ingressos" : "Ingresso"}
                                                        </div>
                                                        
                                                        <div className="space-y-3">
                                                            {group.tickets.map((ticket, ticketIndex) => {
                                                                const ticketSchedule = getEventSchedule(ticket)
                                                                const ticketStatus = statusConfig[ticket.status]
                                                                const canShowQRCode = ticket.status === "CONFIRMED"
                                                                const isQRCodeVisible = visibleQRCodes[ticket.id] || false
                                                                const isPendingPayment = ticket.status === "PENDING"
                                                                const isUsed = ticket.status === "USED" || ticket.status === "PARTIALLY_USED"
                                                                
                                                                return (
                                                                    <div
                                                                        key={ticket.id}
                                                                        className="rounded-2xl border border-psi-primary/20 bg-white/80 p-4 shadow-sm space-y-4"
                                                                    >
                                                                        <div className="flex items-start justify-between gap-3">
                                                                            <div className="flex-1 space-y-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        Ingresso {ticketIndex + 1}
                                                                                    </span>
                                                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ticketStatus.badgeClass}`}>
                                                                                        {ticketStatus.label}
                                                                                    </span>
                                                                                </div>
                                                                                {ticket.code && (
                                                                                    <div>
                                                                                        <p className="text-xs text-psi-dark/60">Código</p>
                                                                                        <p className="text-sm font-medium text-psi-dark font-mono">
                                                                                            {ticket.code}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                {ticket.price && (
                                                                                    <div>
                                                                                        <p className="text-xs text-psi-dark/60">Valor</p>
                                                                                        <p className="text-sm font-medium text-psi-dark">
                                                                                            {ValueUtils.centsToCurrency(ticket.price)}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                                {ticket.isInsured && (
                                                                                    <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                                                                                        <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                                                                                        <div>
                                                                                            <p className="text-xs font-medium text-emerald-900">Ingresso segurado</p>
                                                                                            <p className="text-xs text-emerald-700">Este ingresso possui seguro da compra</p>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid gap-4
                                                                        sm:grid-cols-2">
                                                                            <div className="space-y-2 rounded-xl border border-psi-primary/10 bg-psi-primary/5 p-3">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark">
                                                                                    <Calendar className="h-3.5 w-3.5 text-psi-primary" />
                                                                                    Data e horário
                                                                                </div>
                                                                                <p className="text-sm text-psi-dark">{ticketSchedule.dateLabel}</p>
                                                                                {ticketSchedule.timeLabel && (
                                                                                    <div className="flex items-center gap-2 text-xs text-psi-dark/70">
                                                                                        <Clock className="h-3.5 w-3.5 text-psi-primary" />
                                                                                        {ticketSchedule.timeLabel}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <div className="space-y-2 rounded-xl border border-psi-primary/10 bg-psi-primary/5 p-3">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark">
                                                                                    <QrCode className="h-3.5 w-3.5 text-psi-primary" />
                                                                                    QR Code
                                                                                </div>
                                                                                {canShowQRCode ? (
                                                                                    <div className="space-y-2">
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            className="w-full text-xs"
                                                                                            onClick={() => toggleQRCode(ticket.id)}
                                                                                            disabled={loadingQRCodes[ticket.id]}
                                                                                        >
                                                                                            {loadingQRCodes[ticket.id] ? (
                                                                                                <>
                                                                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                                                                    Carregando...
                                                                                                </>
                                                                                            ) : isQRCodeVisible ? (
                                                                                                <>
                                                                                                    <EyeOff className="h-3 w-3 mr-1" />
                                                                                                    Ocultar
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <Eye className="h-3 w-3 mr-1" />
                                                                                                    Mostrar
                                                                                                </>
                                                                                            )}
                                                                                        </Button>
                                                                                        {isQRCodeVisible && qrCodeData[ticket.id] && (
                                                                                            <div 
                                                                                                className="flex justify-center p-3 bg-white rounded-lg cursor-pointer hover:bg-psi-primary/5 transition-colors border border-psi-primary/10"
                                                                                                onClick={() => {
                                                                                                    setSelectedTicketForZoom(ticket)
                                                                                                    setQrCodeZoomOpen(true)
                                                                                                }}
                                                                                                title="Clique para ampliar"
                                                                                            >
                                                                                                <QRCodeSVG
                                                                                                    value={qrCodeData[ticket.id]}
                                                                                                    size={150}
                                                                                                    level="H"
                                                                                                    includeMargin={true}
                                                                                                />
                                                                                            </div>
                                                                                        )}
                                                                                        <Button
                                                                                            variant="secondary"
                                                                                            size="sm"
                                                                                            className="w-full text-xs"
                                                                                            onClick={() => handleOpenQrCodeDownloadDialog(ticket)}
                                                                                        >
                                                                                            <Download className="h-3 w-3 mr-1" />
                                                                                            Baixar QR Code
                                                                                        </Button>
                                                                                    </div>
                                                                                ) : isUsed ? (
                                                                                    <div className="p-3 rounded-lg bg-psi-primary/10 border border-psi-primary/20">
                                                                                        <p className="text-xs font-medium text-psi-dark mb-1">Ingresso já utilizado</p>
                                                                                        <p className="text-xs text-psi-dark/70">{ticketStatus.description}</p>
                                                                                    </div>
                                                                                ) : (
                                                                                    <p className="text-xs text-psi-dark/60">{ticketStatus.description}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {ticket.EventBatch && (
                                                                            <div className="text-xs text-psi-dark/60">
                                                                                <span className="font-medium">Lote:</span> {ticket.EventBatch.name}
                                                                                {ticket.TicketType && (
                                                                                    <span className="ml-2">
                                                                                        <span className="font-medium">Tipo:</span> {ticket.TicketType.name}
                                                                                    </span>
                                                                                )}
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
                                                                                    {ticket.refundedAt && (
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/60 mb-1">Concluído em</p>
                                                                                            <p className="text-xs font-medium text-psi-dark">
                                                                                                {DateUtils.formatDate(ticket.refundedAt, "DD/MM/YYYY [às] HH:mm")}
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
                                                                                        <Link href={ticket.refundReceiptUrl} target="_blank" className="text-xs flex items-center gap-1 mt-2 text-psi-primary hover:text-psi-primary/80">
                                                                                            <FileText className="h-3.5 w-3.5" />
                                                                                            Ver recibo do reembolso
                                                                                        </Link>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {hasFormForEachTicket && ticket.form && renderFormFields(ticket.form) && (
                                                                            <div className="mt-3 pt-3 border-t border-psi-primary/20 space-y-2">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                    <FileText className="h-3.5 w-3.5 text-psi-primary" />
                                                                                    Respostas do Formulário
                                                                                </div>
                                                                                {renderFormFields(ticket.form)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>

                                                    {hasForm && !hasFormForEachTicket && (
                                                        <div className="rounded-2xl border border-psi-primary/20 bg-white/80 p-4 shadow-sm space-y-4">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-psi-dark">
                                                                <FileText className="h-4 w-4 text-psi-primary" />
                                                                Respostas do Formulário
                                                            </div>
                                                            {renderFormFields(firstTicket.form)}
                                                        </div>
                                                    )}

                                                    {hasRefundInfo && (
                                                        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm space-y-4">
                                                            <div className="flex items-center gap-2 text-sm font-medium text-psi-dark">
                                                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                                Status do Reembolso
                                                            </div>
                                                            <div className="grid gap-3
                                                            sm:grid-cols-2">
                                                                {group.payment?.refundStatus && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs text-psi-dark/60">Status</p>
                                                                        <Badge className={refundStatusConfig[group.payment.refundStatus]?.badgeClass || "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                            {refundStatusConfig[group.payment.refundStatus]?.label || group.payment.refundStatus}
                                                                        </Badge>
                                                                    </div>
                                                                )}
                                                                {group.payment?.refundedAt && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs text-psi-dark/60">Concluído em</p>
                                                                        <p className="text-sm font-medium text-psi-dark">
                                                                            {DateUtils.formatDate(group.payment.refundedAt, "DD/MM/YYYY [às] HH:mm")}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {group.tickets.some(t => t.status === "REFUND_REQUESTED") && !group.payment?.refundedAt && (
                                                                <div className="rounded-lg border border-amber-200 bg-amber-100/50 p-3">
                                                                    <p className="text-xs text-amber-800">
                                                                        Seu pedido de reembolso está sendo processado. Você será notificado quando o reembolso for concluído.
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {group.payment?.refundReceiptUrl && (
                                                                <Link href={group.payment.refundReceiptUrl} target="_blank" className="text-xs flex items-center gap-1 mt-2 text-psi-dark/60">
                                                                    <FileText className="h-4 w-4 text-psi-primary" />
                                                                    Ver recibo
                                                                </Link>
                                                            )}
                                                            {group.payment?.refundStatus === "DONE" && group.payment?.refundedAt && (
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
                                                        {group.tickets.some(t => t.status === "PENDING") && (
                                                            <Button
                                                                variant="tertiary"
                                                                size="lg"
                                                                className="flex-1 min-w-[200px]"
                                                                onClick={() => hasPixQrCode && firstTicket ? handleOpenPixPayment(firstTicket) : undefined}
                                                            >
                                                                Realizar pagamento
                                                            </Button>
                                                        )}

                                                        {showRefundButton && (
                                                            <Button
                                                                variant={isCancelled ? "destructive" : "outline"}
                                                                size="lg"
                                                                className="flex-1 min-w-[200px]"
                                                                onClick={() => handleRequestRefund(firstTicket)}
                                                                disabled={isRequestingRefund}
                                                            >
                                                                {isRequestingRefund ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        Processando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                                        Solicitar reembolso
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="lg"
                                                            className="flex-1 min-w-[200px]"
                                                            onClick={() => handleShareTicket(firstTicket)}
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                            Compartilhar
                                                        </Button>
                                                        <Link href={`/ver-evento/${group.event.slug}`} className="flex-1 min-w-[200px]">
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
                                        <p className="text-sm font-medium text-psi-dark">
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
                                <p className="text-sm font-medium text-psi-dark">
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

            <Dialog open={qrCodeDownloadDialogOpen} onOpenChange={setQrCodeDownloadDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Baixar QR Code</DialogTitle>
                        <DialogDescription>
                            Este QR Code dá acesso direto ao evento. Mantenha-o em segurança e compartilhe apenas com quem realmente irá utilizá-lo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                            <p className="text-sm text-amber-900 font-medium mb-2">
                                Aviso de segurança
                            </p>
                            <p className="text-sm text-amber-800">
                                Não compartilhe este QR Code em nenhuma hipótese. O uso é de total responsabilidade do usuário. Caso seja compartilhado indevidamente, o acesso ao evento poderá ser comprometido.
                            </p>
                        </div>
                        {selectedTicketForDownload && qrCodeData[selectedTicketForDownload.id] && (
                            <div id={`ticket-qr-download-${selectedTicketForDownload.id}`} className="hidden">
                                <QRCodeSVG
                                    value={qrCodeData[selectedTicketForDownload.id]}
                                    size={600}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setQrCodeDownloadDialogOpen(false)
                                    setSelectedTicketForDownload(null)
                                }}
                                disabled={isDownloadingQrCode}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleDownloadQrCode}
                                disabled={isDownloadingQrCode}
                            >
                                {isDownloadingQrCode ? "Baixando..." : "Baixar QR Code"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={postponedRefundDialogOpen} onOpenChange={setPostponedRefundDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            Evento Adiado - Reembolso
                        </DialogTitle>
                        <DialogDescription>
                            Informações sobre o reembolso para eventos adiados
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Este evento foi <strong>adiado</strong> para uma nova data. O reembolso é <strong>facultativo</strong>.
                            </p>
                            <div className="space-y-2 text-sm text-amber-800">
                                <p className="font-medium">Você tem duas opções:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Se você <strong>conseguir comparecer</strong> na nova data, não há necessidade de solicitar reembolso. Seu ingresso continuará válido.</li>
                                    <li>Se você <strong>não puder comparecer</strong> na nova data, pode solicitar o reembolso agora.</li>
                                </ul>
                            </div>
                        </div>

                        {selectedTicketForRefund && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-psi-dark">Evento:</p>
                                <p className="text-sm text-psi-dark">{selectedTicketForRefund.Event.name}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setPostponedRefundDialogOpen(false)
                                    setSelectedTicketForRefund(null)
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleConfirmPostponedRefund}
                                disabled={isRequestingRefund}
                            >
                                {isRequestingRefund ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4" />
                                        Solicitar reembolso
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    MeusIngressosPannel
}