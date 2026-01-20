"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DollarSign, Ticket, Calendar, TrendingUp, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import useDashboardGetData from "@/hooks/Dashboard/useDashboardGetData"
import useDashboardGetPayouts from "@/hooks/Dashboard/useDashboardGetPayouts"
import { Skeleton } from "@/components/ui/skeleton"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import type { TDashboardOverview, TDashboardPayouts } from "@/types/Dashboard/TDashboard"

const DashboardPannel = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "year" | "custom">("month")
    const [customDateStart, setCustomDateStart] = useState<string | null>(null)
    const [customDateEnd, setCustomDateEnd] = useState<string | null>(null)

    const { dateStart, dateEnd, shouldFetch } = useMemo(() => {
        if (period === "custom") {
            const hasBothDates = !!(customDateStart && customDateEnd)
            return {
                dateStart: customDateStart || undefined,
                dateEnd: customDateEnd || undefined,
                shouldFetch: hasBothDates
            }
        }

        const now = new Date()
        let start: Date
        let end: Date = new Date(now)

        if (period === "day") {
            start = new Date(now)
            start.setHours(0, 0, 0, 0)
        } else if (period === "week") {
            start = new Date(now)
            start.setDate(now.getDate() - 6)
            start.setHours(0, 0, 0, 0)
        } else if (period === "month") {
            start = new Date(now)
            start.setDate(1)
            start.setHours(0, 0, 0, 0)
        } else {
            start = new Date(now.getFullYear(), 0, 1)
            start.setHours(0, 0, 0, 0)
        }

        return {
            dateStart: start.toISOString().split("T")[0],
            dateEnd: end.toISOString().split("T")[0],
            shouldFetch: true
        }
    }, [period, customDateStart, customDateEnd])

    const { data, isLoading, isError } = useDashboardGetData(dateStart, dateEnd, shouldFetch)
    const { data: payoutsData, isLoading: isLoadingPayouts, isError: isErrorPayouts } = useDashboardGetPayouts()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        if (period === "day") {
            return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        } else if (period === "week" || period === "month") {
            return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
        } else {
            return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
        }
    }

    const periodLabels = {
        day: "Hoje",
        week: "Esta Semana",
        month: "Este Mês",
        year: "Este Ano",
        custom: "Período Personalizado"
    }

    const handlePeriodChange = (newPeriod: "day" | "week" | "month" | "year" | "custom") => {
        setPeriod(newPeriod)
        if (newPeriod !== "custom") {
            setCustomDateStart(null)
            setCustomDateEnd(null)
        }
    }

    const isLoadingData = isLoading && shouldFetch
    const hasError = isError && shouldFetch
    const hasData = data?.data && shouldFetch

    if (isLoadingData) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[80px] space-y-8">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-64" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-80" />
                        <Skeleton className="h-80" />
                    </div>
                </div>
            </Background>
        )
    }

    if (hasError || (shouldFetch && !hasData)) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[80px]">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-medium text-psi-dark">Erro ao carregar dados</h1>
                        <p className="text-psi-dark/60">Não foi possível carregar as informações do dashboard.</p>
                    </div>
                </div>
            </Background>
        )
    }

    const dashboardData = hasData ? (data.data as TDashboardOverview) : null

    const statsCards = dashboardData ? [
        {
            title: "Receita Total",
            value: ValueUtils.centsToCurrency(dashboardData.totalRevenue),
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Ingressos Vendidos",
            value: dashboardData.totalTickets.toLocaleString("pt-BR"),
            icon: Ticket,
            color: "text-psi-primary",
            bgColor: "bg-psi-primary/10"
        },
        {
            title: "Eventos Publicados",
            value: dashboardData.totalEvents.toLocaleString("pt-BR"),
            icon: Calendar,
            color: "text-psi-secondary",
            bgColor: "bg-psi-secondary/10"
        },
        {
            title: "Ticket Médio",
            value: ValueUtils.centsToCurrency(dashboardData.averageTicketPrice),
            icon: TrendingUp,
            color: "text-psi-tertiary",
            bgColor: "bg-psi-tertiary/10"
        }
    ] : []

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-12 mt-[80px] space-y-8">
                <div className="flex flex-col gap-4
                sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-psi-primary
                        sm:text-4xl">Dashboard</h1>
                        <p className="text-sm text-psi-dark/60 mt-1">Visão geral da plataforma</p>
                    </div>
                    <div className="flex flex-col gap-3
                    sm:flex-row sm:items-center">
                        <div className="flex gap-2 flex-wrap">
                            {(["day", "week", "month", "year"] as const).map((p) => (
                                <Button
                                    key={p}
                                    variant={period === p ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => handlePeriodChange(p)}
                                    className="capitalize"
                                >
                                    {periodLabels[p]}
                                </Button>
                            ))}
                            <Button
                                variant={period === "custom" ? "primary" : "outline"}
                                size="sm"
                                onClick={() => handlePeriodChange("custom")}
                            >
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Personalizado
                            </Button>
                        </div>
                        {period === "custom" && (
                            <div className="flex gap-2 items-center">
                                <div className="flex-1 min-w-[140px]">
                                    <DatePicker
                                        value={customDateStart}
                                        onChange={setCustomDateStart}
                                        icon={false}
                                        absoluteClassName={true}
                                    />
                                </div>
                                <span className="text-psi-dark/60">até</span>
                                <div className="flex-1 min-w-[140px]">
                                    <DatePicker
                                        value={customDateEnd}
                                        onChange={setCustomDateEnd}
                                        icon={false}
                                        minDate={customDateStart || undefined}
                                        absoluteClassName={true}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {dashboardData && (
                    <>
                        <div className="grid grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4 gap-6">
                            {statsCards.map((stat, index) => {
                                const Icon = stat.icon
                                return (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                                <Icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                stat.title === "Receita Total"
                                                ?
                                                (
                                                    <>
                                                    <p className="text-sm text-psi-dark mb-1">{stat.title}</p>
                                                    <p className="text-3xl font-semibold text-emerald-600">{stat.value}</p>
                                                    </>
                                                )
                                                :
                                                (
                                                    <>
                                                        <p className="text-sm text-psi-dark/60 mb-1">{stat.title}</p>
                                                        <p className="text-2xl font-semibold text-psi-dark">{stat.value}</p>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {!isLoadingPayouts && !isErrorPayouts && payoutsData?.data && (payoutsData.data.upcomingPayouts.length > 0 || payoutsData.data.pendingRefunds.length > 0) && (
                    <div className={`grid grid-cols-1
                    ${payoutsData.data.pendingRefunds.length < 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"} gap-6`}>
                        {payoutsData.data.upcomingPayouts.length > 0 && (
                            <div className="rounded-2xl border border-[#E4E6F0] bg-linear-to-br from-emerald-50 via-white to-emerald-50/50 p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-psi-dark">Repasses Previstos</h3>
                                            <p className="text-xs text-psi-dark/60">Valores previstos para transferência</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        <strong>Importante:</strong> Os valores e datas são previsões e podem ser alterados caso ocorram adiamentos, cancelamentos, alterações de eventos ou solicitações de reembolso por parte dos clientes.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {payoutsData.data.upcomingPayouts.map((payout, index) => {
                                        const payoutDate = new Date(payout.date)
                                        payoutDate.setDate(payoutDate.getDate() + 2)
                                        const adjustedDate = payoutDate.toISOString().split("T")[0]
                                        
                                        return (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-xl border ${
                                                    index === 0
                                                        ? "bg-emerald-100/50 border-emerald-200"
                                                        : "bg-white border-[#E4E6F0]"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {index === 0 && (
                                                                <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-medium rounded-full">
                                                                    Próximo
                                                                </span>
                                                            )}
                                                            <p className="text-sm font-medium text-psi-dark">
                                                                {new Date(adjustedDate).toLocaleDateString("pt-BR", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric"
                                                                })}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-psi-dark/60">
                                                            {(() => {
                                                                const daysDiff = Math.ceil(
                                                                    (new Date(adjustedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                                                                )
                                                                if (daysDiff === 0) return "Hoje"
                                                                if (daysDiff === 1) return "Amanhã"
                                                                if (daysDiff < 7) return `Em ${daysDiff} dias`
                                                                if (daysDiff < 30) return `Em ${Math.floor(daysDiff / 7)} semanas`
                                                                return `Em ${Math.floor(daysDiff / 30)} meses`
                                                            })()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-semibold ${
                                                            index === 0 ? "text-emerald-600" : "text-psi-dark"
                                                        }`}>
                                                            {ValueUtils.centsToCurrency(payout.value)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {payoutsData.data.pendingRefunds.length > 0 && (
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-psi-dark">Reembolsos</h3>
                                        <p className="text-xs text-psi-dark/60">Status dos reembolsos pendentes</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {payoutsData.data.pendingRefunds.map((refund, index) => {
                                        const isCompleted = refund.status === "COMPLETED"
                                        const isProcessing = refund.status === "PROCESSING"
                                        const progress = (refund.refundedAmount / refund.totalAmount) * 100
                                        
                                        return (
                                            <div
                                                key={index}
                                                className="p-4 rounded-xl border border-orange-100 bg-orange-50/50"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-psi-dark text-sm mb-1">
                                                            {refund.eventName}
                                                        </p>
                                                        <p className="text-xs text-psi-dark/60 mb-2">
                                                            {new Date(refund.eventDate).toLocaleDateString("pt-BR", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            })} • {refund.reason === "POSTPONED" ? "Adiamento" : "Cancelamento"}
                                                        </p>
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                        isCompleted ? "bg-emerald-50 text-emerald-600" :
                                                        isProcessing ? "bg-orange-50 text-orange-600" :
                                                        "bg-gray-50 text-gray-600"
                                                    }`}>
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-3 h-3" />
                                                        ) : isProcessing ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <AlertCircle className="w-3 h-3" />
                                                        )}
                                                        {isCompleted ? "Concluído" :
                                                         isProcessing ? "Processando" :
                                                         "Pendente"}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-psi-dark/60">Total a reembolsar</span>
                                                        <span className="font-medium text-psi-dark">
                                                            {ValueUtils.centsToCurrency(refund.totalAmount)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-psi-dark/60">Já reembolsado</span>
                                                        <span className="font-medium text-emerald-600">
                                                            {ValueUtils.centsToCurrency(refund.refundedAmount)}
                                                        </span>
                                                    </div>
                                                    {!isCompleted && (
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all ${
                                                                    isProcessing ? "bg-orange-500" : "bg-gray-400"
                                                                }`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                        <div className="grid grid-cols-1
                        lg:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-psi-dark mb-4">Evolução da Receita</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={dashboardData.revenueOverTime}
                                    margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={formatDate}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `${ValueUtils.centsToCurrency(value)}`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [
                                                ValueUtils.centsToCurrency(value),
                                                "Receita"
                                            ]}
                                            labelFormatter={(label) => formatDate(label)}
                                            contentStyle={{
                                                backgroundColor: "white",
                                                border: "1px solid #E4E6F0",
                                                borderRadius: "8px"
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#6C4BFF"
                                            strokeWidth={2}
                                            dot={{ fill: "#6C4BFF", r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-psi-dark mb-4">Ingressos Vendidos</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dashboardData.ticketsOverTime}>
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
                                        <Bar dataKey="tickets" fill="#FF6F91" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}

                {period === "custom" && !customDateStart && !customDateEnd && (
                    <div className="bg-transparent p-10 text-center space-y-4">
                        <CalendarIcon className="h-12 w-12 text-psi-primary mx-auto" />
                        <h2 className="text-xl font-medium text-psi-dark">Selecione um período</h2>
                        <p className="text-psi-dark/70">
                            Escolha as datas de início e fim para visualizar os dados do dashboard.
                        </p>
                    </div>
                )}

                {dashboardData && (
                    <div className="rounded-2xl border h-[600px] border-[#E4E6F0] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-medium text-psi-dark mb-4">Vendas por Evento</h3>
                        <ResponsiveContainer width="100%" height={550}>
                            <ComposedChart 
                                data={dashboardData.salesByEvent}
                                margin={{
                                    top: 5,
                                    right: typeof window !== "undefined" && window.innerWidth < 640 ? 0 : 70,
                                    left: typeof window !== "undefined" && window.innerWidth < 640 ? 0 : 70,
                                    bottom: 100
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                <XAxis 
                                    dataKey="eventName"
                                    tick={{ fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis 
                                    yAxisId="tickets"
                                    tick={{ fontSize: 12 }}
                                    label={{ value: "Ingressos", angle: -90, position: "insideLeft" }}
                                />
                                <YAxis 
                                    yAxisId="revenue"
                                    orientation="right"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `R$ ${(value / 10000).toFixed(1)}K`
                                        if (value >= 1000) return `R$ ${(value / 100).toFixed(0)}`
                                        return `R$ ${value}`
                                    }}
                                    label={{ value: "Receita", angle: 90, position: "insideRight" }}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        if (name === "Receita") {
                                            return [ValueUtils.centsToCurrency(value), "Receita"]
                                        }
                                        if (name === "Ingressos") {
                                            return [value.toLocaleString("pt-BR"), "Ingressos"]
                                        }
                                        return [value, name]
                                    }}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #E4E6F0",
                                        borderRadius: "8px"
                                    }}
                                />
                                <Legend />
                                <Bar 
                                    yAxisId="tickets"
                                    dataKey="tickets" 
                                    fill="#6C4BFF" 
                                    radius={[8, 8, 0, 0]} 
                                    name="Ingressos"
                                />
                                <Line 
                                    yAxisId="revenue"
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#FF6F91" 
                                    strokeWidth={3}
                                    dot={{ fill: "#FF6F91", r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="Receita"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Background>
    )
}

export default DashboardPannel
