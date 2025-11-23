"use client"

import { useState } from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DollarSign, Ticket, Calendar, Users, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react"
import useDashboardGetData from "@/hooks/Dashboard/useDashboardGetData"
import { Skeleton } from "@/components/ui/skeleton"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import type { TDashboard } from "@/types/Dashboard/TDashboard"

const COLORS = ["#6C4BFF", "#FF6F91", "#FFD447", "#4ECDC4", "#95E1D3", "#F38181"]

const DashboardPannel = () => {
    const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month")
    const { data, isLoading, isError } = useDashboardGetData(period)

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
        year: "Este Ano"
    }

    if (isLoading) {
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

    if (isError || !data) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[80px]">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-semibold text-psi-dark">Erro ao carregar dados</h1>
                        <p className="text-psi-dark/60">Não foi possível carregar as informações do dashboard.</p>
                    </div>
                </div>
            </Background>
        )
    }

    const dashboardData = data as TDashboard

    const statsCards = [
        {
            title: "Receita Total",
            value: ValueUtils.centsToCurrency(dashboardData.totalRevenue),
            growth: dashboardData.revenueGrowth,
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Ingressos Vendidos",
            value: dashboardData.totalTickets.toLocaleString("pt-BR"),
            growth: dashboardData.ticketsGrowth,
            icon: Ticket,
            color: "text-psi-primary",
            bgColor: "bg-psi-primary/10"
        },
        {
            title: "Eventos Publicados",
            value: dashboardData.totalEvents.toLocaleString("pt-BR"),
            growth: dashboardData.eventsGrowth,
            icon: Calendar,
            color: "text-psi-secondary",
            bgColor: "bg-psi-secondary/10"
        },
        {
            title: "Ticket Médio",
            value: ValueUtils.centsToCurrency(dashboardData.averageTicketPrice),
            growth: dashboardData.averageTicketPriceGrowth,
            icon: TrendingUp,
            color: "text-psi-tertiary",
            bgColor: "bg-psi-tertiary/10"
        }
    ]

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-12 mt-[80px] space-y-8">
                <div className="flex flex-col gap-4
                sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-psi-dark
                        sm:text-4xl">Dashboard</h1>
                        <p className="text-sm text-psi-dark/60 mt-1">Visão geral da plataforma</p>
                    </div>
                    <div className="flex gap-2">
                        {(["day", "week", "month", "year"] as const).map((p) => (
                            <Button
                                key={p}
                                variant={period === p ? "primary" : "outline"}
                                size="sm"
                                onClick={() => setPeriod(p)}
                                className="capitalize"
                            >
                                {periodLabels[p]}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4 gap-6">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon
                        const isPositive = stat.growth >= 0
                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                        isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                    }`}>
                                        {isPositive ? (
                                            <TrendingUp className="w-3 h-3" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3" />
                                        )}
                                        {Math.abs(stat.growth)}%
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-psi-dark/60 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-psi-dark">{stat.value}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-1
                lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-psi-dark mb-4">Evolução da Receita</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboardData.revenueOverTime}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={formatDate}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
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
                        <h3 className="text-lg font-semibold text-psi-dark mb-4">Ingressos Vendidos</h3>
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

                <div className="grid grid-cols-1
                lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-psi-dark mb-4">Vendas por Evento</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dashboardData.salesByEvent}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                <XAxis
                                    dataKey="eventName"
                                    tick={{ fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        if (name === "revenue") {
                                            return [ValueUtils.centsToCurrency(value), "Receita"]
                                        }
                                        return [value.toLocaleString("pt-BR"), "Ingressos"]
                                    }}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #E4E6F0",
                                        borderRadius: "8px"
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="tickets" fill="#6C4BFF" radius={[8, 8, 0, 0]} name="Ingressos" />
                                <Bar dataKey="revenue" fill="#FF6F91" radius={[8, 8, 0, 0]} name="Receita" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-psi-dark">Meus Melhores Eventos</h3>
                            <ArrowUpRight className="w-5 h-5 text-psi-dark/40" />
                        </div>
                        <div className="space-y-4">
                            {dashboardData.topPerformingEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-xl bg-psi-primary/5 border border-psi-primary/10"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-psi-dark text-sm">{event.name}</p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-xs text-psi-dark/60">
                                                {event.tickets.toLocaleString("pt-BR")} ingressos
                                            </span>
                                            <span className="text-xs font-semibold text-psi-primary">
                                                {ValueUtils.centsToCurrency(event.revenue)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-psi-primary/20 flex items-center justify-center text-xs font-bold text-psi-primary">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export default DashboardPannel
