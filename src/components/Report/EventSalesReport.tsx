"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Ticket, TrendingUp, Eye, DollarSign, Users, Calendar, Clock, MapPin, Award } from "lucide-react"
import { useEventGenerateSalesReport } from "@/hooks/Event/useEventGenerateSalesReport"
import type { TEventSalesReport } from "@/types/Event/TEvent"
import { Skeleton } from "@/components/ui/skeleton"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { cn } from "@/lib/utils"

type TEventSalesReportProps = {
    eventId: string
    eventName?: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

const COLORS = ["#6C4BFF", "#FF6F91", "#FFD447", "#4ECDC4", "#95E1D3"]

const EventSalesReport = ({
    eventId,
    eventName,
    open,
    onOpenChange
}: TEventSalesReportProps) => {
    const { data: reportResponse, isLoading } = useEventGenerateSalesReport({
        eventId,
        enabled: open && !!eventId
    })

    const reportData = reportResponse?.success && reportResponse?.data ? reportResponse.data : null

    if (!open) return null

    const formatCurrency = (value: number) => {
        return ValueUtils.centsToCurrency(value)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[100vw]
            w-full
            h-screen
            max-h-screen
            p-0
            m-0
            rounded-none
            border-0
            translate-x-0
            translate-y-0
            left-0
            top-0
            overflow-hidden">
                <DialogHeader className="px-6
                pt-6
                pb-4
                border-b
                border-[#E4E6F0]
                sticky
                top-0
                bg-white
                z-10">
                    <DialogTitle className="text-2xl
                    font-bold
                    text-psi-dark">
                        Relatório de Vendas
                        {eventName && (
                            <span className="text-psi-primary ml-2">{eventName}</span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 h-[calc(100vh-100px)]">
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-32 rounded-xl" />
                                ))}
                            </div>
                            <Skeleton className="h-96 rounded-xl" />
                        </div>
                    ) : reportData ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-4 gap-4">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                            <Ticket className="h-6 w-6 text-psi-primary" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-psi-dark/60 mb-1">Ingressos Vendidos</p>
                                    <p className="text-3xl font-bold text-psi-dark">{reportData.totalTicketsSold}</p>
                                </div>

                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-psi-secondary/10 flex items-center justify-center">
                                            <DollarSign className="h-6 w-6 text-psi-secondary" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-psi-dark/60 mb-1">Receita Total</p>
                                    <p className="text-3xl font-bold text-psi-primary">{formatCurrency(reportData.totalRevenue)}</p>
                                </div>

                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-psi-tertiary/10 flex items-center justify-center">
                                            <Eye className="h-6 w-6 text-psi-tertiary" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-psi-dark/60 mb-1">Visualizações</p>
                                    <p className="text-3xl font-bold text-psi-dark">{reportData.totalViews}</p>
                                </div>

                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-psi-dark/60 mb-1">Taxa de Conversão</p>
                                    <p className="text-3xl font-bold text-psi-dark">{reportData.conversionRate.toFixed(1)}%</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1
                            lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4">Vendas por Lote</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={reportData.salesByBatch}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                            <XAxis dataKey="batchName" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                formatter={(value: number) => [
                                                    value.toLocaleString("pt-BR"),
                                                    "Ingressos"
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E4E6F0",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                            <Bar dataKey="ticketsSold" fill="#6C4BFF" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4">Vendas por Tipo de Ingresso</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={reportData.salesByTicketType}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry: any) => `${entry.ticketTypeName}: ${entry.percentage.toFixed(1)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="ticketsSold"
                                            >
                                                {reportData.salesByTicketType.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => [
                                                    value.toLocaleString("pt-BR"),
                                                    "Ingressos"
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E4E6F0",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-psi-dark mb-4">Evolução das Vendas</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={reportData.salesOverTime}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={formatDate}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value: number) => [
                                                value.toLocaleString("pt-BR"),
                                                "Ingressos"
                                            ]}
                                            labelFormatter={(label) => formatDate(label)}
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #E4E6F0",
                                                borderRadius: "8px"
                                            }}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="ticketsSold"
                                            stroke="#6C4BFF"
                                            strokeWidth={2}
                                            name="Ingressos Vendidos"
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-1
                            lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-psi-primary" />
                                        Compradores por Faixa Etária
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={reportData.buyersByAgeRange} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                            <XAxis type="number" tick={{ fontSize: 12 }} />
                                            <YAxis dataKey="ageRange" type="category" tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                formatter={(value: number, name: string, props: any) => [
                                                    `${value} (${props.payload.percentage.toFixed(1)}%)`,
                                                    "Compradores"
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E4E6F0",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                            <Bar dataKey="count" fill="#FF6F91" radius={[0, 8, 8, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-psi-primary" />
                                        Compradores por Origem
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={reportData.buyersByOrigin}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry: any) => `${entry.origin}: ${entry.percentage.toFixed(1)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {reportData.buyersByOrigin.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number, name: string, props: any) => [
                                                    `${value} (${props.payload.percentage.toFixed(1)}%)`,
                                                    "Compradores"
                                                ]}
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E4E6F0",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-1
                            lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-psi-primary" />
                                        Top Compradores
                                    </h3>
                                    <div className="space-y-3">
                                        {reportData.topBuyers.map((buyer, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg bg-psi-light/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                                                        index === 0 && "bg-psi-primary",
                                                        index === 1 && "bg-psi-secondary",
                                                        index === 2 && "bg-psi-tertiary",
                                                        index > 2 && "bg-psi-dark/60"
                                                    )}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-psi-dark">{buyer.buyerName}</p>
                                                        <p className="text-xs text-psi-dark/60">{buyer.ticketsBought} ingressos</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold text-psi-primary">{formatCurrency(buyer.totalSpent)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4">Insights</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg bg-psi-primary/5 border border-psi-primary/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="h-4 w-4 text-psi-primary" />
                                                <p className="text-sm font-semibold text-psi-dark">Preço Médio do Ingresso</p>
                                            </div>
                                            <p className="text-2xl font-bold text-psi-primary">{formatCurrency(reportData.averageTicketPrice)}</p>
                                        </div>

                                        <div className="p-4 rounded-lg bg-psi-secondary/5 border border-psi-secondary/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4 text-psi-secondary" />
                                                <p className="text-sm font-semibold text-psi-dark">Dia de Pico de Vendas</p>
                                            </div>
                                            <p className="text-xl font-bold text-psi-secondary">{reportData.peakSalesDay}</p>
                                        </div>

                                        <div className="p-4 rounded-lg bg-psi-tertiary/5 border border-psi-tertiary/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-4 w-4 text-psi-tertiary" />
                                                <p className="text-sm font-semibold text-psi-dark">Horário de Pico de Vendas</p>
                                            </div>
                                            <p className="text-xl font-bold text-psi-tertiary">{reportData.peakSalesHour}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-lg text-psi-dark/60">Erro ao carregar relatório</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export {
    EventSalesReport
}
