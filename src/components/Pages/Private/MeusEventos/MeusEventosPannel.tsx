"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin, Eye, Ticket, Edit, Trash2, ExternalLink, TrendingUp, Repeat, Tag, MoreVertical, FileSpreadsheet, BarChart3, Copy, Share2, Download, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"

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

const MeusEventosPannel = () => {
    const { data: events, isLoading, isError } = useEventFind()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value)
    }

    const formatRecurrence = (recurrence: TEvent["recurrence"]) => {
        if (!recurrence || recurrence.type === "NONE") return null

        const recurrenceLabels = {
            DAILY: "Diário",
            WEEKLY: "Semanal",
            MONTHLY: "Mensal"
        }

        const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

        let label = recurrenceLabels[recurrence.type]

        if (recurrence.type === "WEEKLY" && recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
            const days = recurrence.daysOfWeek.map(day => dayLabels[day.day]).join(", ")
            label = `${label} (${days})`
        }

        if (recurrence.endDate) {
            const endDate = formatDate(recurrence.endDate)
            label = `${label} até ${endDate}`
        }

        return label
    }

    const getDateRange = (dates: TEvent["dates"]) => {
        if (dates.length === 0) return null

        const sortedDates = [...dates].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        const firstDate = formatDate(sortedDates[0].date)
        const lastDate = formatDate(sortedDates[sortedDates.length - 1].date)

        if (dates.length === 1) {
            return firstDate
        }

        return `${firstDate} - ${lastDate}`
    }

    const getActiveBatch = (batches: TEvent["batches"]): TEventBatch | null => {
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
                        <div className="text-center py-16">
                            <p className="text-lg text-psi-dark/60">Nenhum evento encontrado</p>
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
        sales: mockStats.sales,
        revenue: mockStats.revenue
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
                        sm:text-lg text-psi-dark/60">
                            Gerencie seus eventos e acompanhe o desempenho
                        </p>
                    </div>

                    <div className="grid grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3 gap-6">
                        {eventsWithStats.map((event) => {
                            return (
                                <div
                                    key={event.id}
                                    className="group rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
                                >
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <img
                                            src={event.image}
                                            alt={event.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
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
                                                    <DropdownMenuItem className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer">
                                                        <FileSpreadsheet className="h-4 w-4 mr-2 text-psi-primary" />
                                                        Gerar lista de compradores
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer">
                                                        <BarChart3 className="h-4 w-4 mr-2 text-psi-primary" />
                                                        Gerar relatório de vendas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                                                    <DropdownMenuItem className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer">
                                                        <BarChart className="h-4 w-4 mr-2 text-psi-primary" />
                                                        Ver estatísticas detalhadas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer">
                                                        <Share2 className="h-4 w-4 mr-2 text-psi-primary" />
                                                        Compartilhar evento
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer">
                                                        <Download className="h-4 w-4 mr-2 text-psi-primary" />
                                                        Exportar dados
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                                                    <DropdownMenuItem className="rounded-lg text-sm text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                                                        <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                                        Excluir evento
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
                                                        {getDateRange(event.dates)}
                                                    </div>
                                                    {event.dates.length > 1 && (
                                                        <div className="space-y-1 mt-2">
                                                            {event.dates.map((eventDate, index) => (
                                                                <div key={index} className="flex items-center gap-2 text-xs text-psi-dark/60">
                                                                    <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                                                    <span>
                                                                        {formatDate(eventDate.date)}: {eventDate.hourStart}
                                                                        {eventDate.hourEnd && ` - ${eventDate.hourEnd}`}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {event.dates.length === 1 && event.dates[0].hourStart && (
                                                        <div className="flex items-center gap-2 text-xs text-psi-dark/60 mt-1">
                                                            <Clock className="h-3 w-3 text-psi-primary shrink-0" />
                                                            <span>
                                                                {event.dates[0].hourStart}
                                                                {event.dates[0].hourEnd && ` - ${event.dates[0].hourEnd}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {event.recurrence && event.recurrence.type !== "NONE" && (
                                                <div className="flex items-center gap-2 text-sm text-psi-primary">
                                                    <Repeat className="h-4 w-4 shrink-0" />
                                                    <span className="font-medium">{formatRecurrence(event.recurrence)}</span>
                                                </div>
                                            )}

                                            {event.location && (
                                                <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                    <MapPin className="h-4 w-4 text-psi-primary shrink-0" />
                                                    <span className="line-clamp-1">{event.location}</span>
                                                </div>
                                            )}

                                            {(() => {
                                                const activeBatch = getActiveBatch(event.batches)
                                                if (!activeBatch) return null
                                                
                                                return (
                                                    <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-3 mt-2">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Tag className="h-4 w-4 text-psi-primary shrink-0" />
                                                            <span className="text-sm font-semibold text-psi-dark">
                                                                Lote Atual: {activeBatch.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-psi-dark/70">
                                                                Preço: <span className="font-bold text-psi-primary">{formatCurrency(activeBatch.price)}</span>
                                                            </span>
                                                            <span className="text-psi-dark/70">
                                                                Disponível: <span className="font-semibold text-psi-dark">{activeBatch.quantity}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })()}
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E4E6F0]">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-psi-dark/60 mb-1">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span className="text-xs">Acessos</span>
                                                </div>
                                                <p className="text-lg font-bold text-psi-dark">{event.views}</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-psi-dark/60 mb-1">
                                                    <Ticket className="h-3.5 w-3.5" />
                                                    <span className="text-xs">Vendas</span>
                                                </div>
                                                <p className="text-lg font-bold text-psi-dark">{event.sales}</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-psi-dark/60 mb-1">
                                                    <TrendingUp className="h-3.5 w-3.5" />
                                                    <span className="text-xs">Receita</span>
                                                </div>
                                                <p className="text-lg font-bold text-psi-primary">{formatCurrency(event.revenue)}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#E4E6F0]">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                >
                                                    <Link href={`/eventos/atualizar?id=${event.id}`}>
                                                        <Edit className="h-4 w-4" />
                                                        Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1"
                                                >
                                                    <Link href={`/ver-evento?id=${event.id}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" />
                                                        Ver
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    MeusEventosPannel
}
