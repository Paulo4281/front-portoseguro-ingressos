"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Ticket, QrCode, Copy, Download, Share2, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useTicketFindByUserId } from "@/hooks/Ticket/useTicketFindByUserId"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TTicket } from "@/types/Ticket/TTicket"

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
    PAID: {
        label: "Confirmado",
        description: "Ingresso confirmado. Apresente o QR Code no dia do evento.",
        badgeClass: "border border-emerald-200 bg-emerald-50 text-emerald-600"
    },
    CANCELLED: {
        label: "Cancelado",
        description: "Esse ingresso foi cancelado e não pode ser utilizado.",
        badgeClass: "border border-rose-200 bg-rose-50 text-rose-600"
    },
    USED: {
        label: "Utilizado",
        description: "Ingresso já validado no acesso ao evento.",
        badgeClass: "border border-psi-primary/30 bg-psi-primary/10 text-psi-primary"
    },
    EXPIRED: {
        label: "Expirado",
        description: "Evento já ocorreu e o ingresso expirou.",
        badgeClass: "border border-psi-dark/10 bg-psi-dark/5 text-psi-dark/70"
    }
}

const recurrenceDayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

const getEventSchedule = (ticket: TTicket) => {
    if (ticket.event.EventDates && ticket.event.EventDates.length > 0) {
        const sortedDates = [...ticket.event.EventDates].sort((a, b) =>
            getDateOrderValue(a?.date) - getDateOrderValue(b?.date)
        )
        const nextDate = sortedDates[0]

        return {
            dateLabel: formatEventDate(nextDate?.date, "DD [de] MMMM [de] YYYY"),
            timeLabel: formatEventTime(nextDate?.hourStart, nextDate?.hourEnd)
        }
    }

    if (ticket.event.Recurrence && ticket.event.Recurrence.type !== "NONE") {
        const baseLabel = {
            DAILY: "Evento diário",
            WEEKLY: "Evento semanal",
            MONTHLY: "Evento mensal"
        }[ticket.event.Recurrence.type]

        let detailLabel = baseLabel

        if (ticket.event.Recurrence.type === "WEEKLY" && ticket.event.Recurrence.RecurrenceDays?.length) {
            const days = ticket.event.Recurrence.RecurrenceDays
                .map((day) => recurrenceDayLabels[day.day] || `Dia ${day.day}`)
                .join(", ")
            detailLabel = `${baseLabel} (${days})`
        }

        if (ticket.event.Recurrence.type === "MONTHLY" && ticket.event.Recurrence.RecurrenceDays?.length) {
            const days = ticket.event.Recurrence.RecurrenceDays
                .map((day) => `Dia ${day.day}`)
                .join(", ")
            detailLabel = `${baseLabel} (${days})`
        }

        const timeLabel = formatEventTime(ticket.event.Recurrence.hourStart, ticket.event.Recurrence.hourEnd)

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
    const { data, isLoading, isError } = useTicketFindByUserId(userId)

    const tickets = (data?.data ?? []) as TTicket[]

    const orderedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [tickets])

    const stats = useMemo(() => {
        const total = tickets.length
        const confirmed = tickets.filter((ticket) => ticket.status === "PAID" || ticket.status === "USED").length
        const pending = tickets.filter((ticket) => ticket.status === "PENDING").length
        const uniqueEvents = new Set(tickets.map((ticket) => ticket.eventId)).size

        return {
            total,
            confirmed,
            pending,
            uniqueEvents
        }
    }, [tickets])

    const handleShareTicket = (ticket: TTicket) => {
        const eventUrl = `${window.location.origin}/ver-evento?id=${ticket.eventId}`
        const sharePayload = {
            title: ticket.event.name,
            text: `Vou participar de ${ticket.event.name} em Porto Seguro. Garanta seu ingresso também!`,
            url: eventUrl
        }

        if (navigator.share) {
            navigator.share(sharePayload).catch(() => undefined)
            return
        }

        navigator.clipboard?.writeText(eventUrl)
    }

    const handleDownloadTicket = (ticket: TTicket) => {
        const schedule = getEventSchedule(ticket)
        const content = [
            `Ingresso: ${ticket.id}`,
            `Evento: ${ticket.event.name}`,
            `Data: ${schedule.dateLabel}${schedule.timeLabel ? ` - ${schedule.timeLabel}` : ""}`,
            `Local: ${ticket.event.location || "Local a definir"}`,
            `Status: ${statusConfig[ticket.status].label}`,
            `Valor: ${ValueUtils.centsToCurrency(ticket.price)}`
        ].join("\n")

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `ingresso-${ticket.id}.txt`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    const handleCopyCode = (ticketId: string) => {
        navigator.clipboard?.writeText(ticketId)
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
                                <Link href="/#eventos">
                                    <Button variant="primary" size="lg">
                                        Explorar eventos
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/ver-evento">
                                    <Button variant="outline" size="lg">
                                        Ver eventos em destaque
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
                                const canDownloadTicket = ticket.status === "PAID"

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
                                                        src={ImageUtils.getEventImageUrl(ticket.event.image)}
                                                        alt={ticket.event.name}
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
                                                            <h3 className="text-2xl font-semibold text-psi-dark">{ticket.event.name}</h3>
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
                                                                {ticket.event.location || "Local a definir"}
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
                                                                {ticket.eventBatch?.name || "Ingresso único"}
                                                            </p>
                                                            {ticket.eventBatch && (
                                                                <p className="text-xs text-psi-dark/60">
                                                                    Até {ticket.eventBatch.endDate ? DateUtils.formatDate(ticket.eventBatch.endDate, "DD/MM/YYYY") : "data indefinida"}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white p-4 shadow-sm space-y-1">
                                                            <p className="text-xs uppercase text-psi-dark/50 tracking-wide">Valor pago</p>
                                                            <p className="text-2xl font-semibold text-psi-primary">
                                                                {ValueUtils.centsToCurrency(ticket.price)}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/60">Taxas já inclusas</p>
                                                        </div>
                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white p-4 shadow-sm space-y-3">
                                                            <p className="text-xs uppercase text-psi-dark/50 tracking-wide">Código</p>
                                                            <div className="flex items-center gap-2">
                                                                <QrCode className="h-5 w-5 text-psi-primary" />
                                                                <span className="font-mono text-sm text-psi-dark">{ticket.id}</span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon-sm"
                                                                    aria-label="Copiar código do ingresso"
                                                                    onClick={() => handleCopyCode(ticket.id)}
                                                                >
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <p className="text-xs text-psi-dark/60">{status.description}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3
                                                    lg:flex-row
                                                    lg:flex-wrap">
                                                        {canDownloadTicket && (
                                                            <Button
                                                                variant="primary"
                                                                size="lg"
                                                                className="flex-1 min-w-[200px]"
                                                                onClick={() => handleDownloadTicket(ticket)}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                Baixar ingresso
                                                            </Button>
                                                        )}

                                                        {isPendingPayment && (
                                                            <Link href="/checkout" className="flex-1 min-w-[200px]">
                                                                <Button
                                                                    variant="tertiary"
                                                                    size="lg"
                                                                    className="w-full"
                                                                >
                                                                    Efetuar pagamento
                                                                </Button>
                                                            </Link>
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
                                                        <Link href={`/ver-evento?id=${ticket.eventId}`} className="flex-1 min-w-[200px]">
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
        </Background>
    )
}

export {
    MeusIngressosPannel
}