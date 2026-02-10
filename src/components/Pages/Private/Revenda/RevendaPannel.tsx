"use client"

import { useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Toast } from "@/components/Toast/Toast"
import type { TResale, TResaleInvite } from "@/types/Resale/TResale"
import { Loader2, PlusCircle, Users, Pencil, Trash2, BarChart3, TrendingUp, Mail, XCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    ComposedChart,
    Legend
} from "recharts"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import type { TResaleSalesByEvent } from "@/types/Resale/TResale"

const getSalesCount = (reseller: TResale) => {
    const candidates = [
        reseller.totalSales,
        reseller.salesCount,
        reseller.totalTicketsSold,
        reseller.ticketsSold
    ]
    const firstValid = candidates.find((value) => typeof value === "number" && Number.isFinite(value))
    return firstValid ?? 0
}

const getTotalRevenue = (reseller: TResale) => {
    if (typeof reseller.totalRevenue === "number" && Number.isFinite(reseller.totalRevenue)) {
        return reseller.totalRevenue
    }
    return 0
}

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

const formatCommissionRate = (value?: number) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return "0%"
    return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`
}

const mockResellersSeed: TResale[] = [
    {
        id: "rsl-1",
        email: "alice.revenda@email.com",
        commissionRate: 12,
        totalSales: 124,
        totalRevenue: 2480000,
        isActive: true
    },
    {
        id: "rsl-2",
        email: "bruno.revenda@email.com",
        commissionRate: 10,
        totalSales: 96,
        totalRevenue: 1920000,
        isActive: true
    },
    {
        id: "rsl-3",
        email: "carla.revenda@email.com",
        commissionRate: 8.5,
        totalSales: 61,
        totalRevenue: 915000,
        isActive: false
    }
]

const MOCK_EVENTS = [
    { id: "evt-1", name: "Festival de Verão 2025" },
    { id: "evt-2", name: "Show Nacional" },
    { id: "evt-3", name: "Workshop Corporativo" }
]

const mockSalesByEventSeed: TResaleSalesByEvent[] = [
    { eventId: "evt-1", eventName: "Festival de Verão 2025", resellerId: "rsl-1", resellerEmail: "alice.revenda@email.com", ticketsSold: 45, revenue: 900000 },
    { eventId: "evt-1", eventName: "Festival de Verão 2025", resellerId: "rsl-2", resellerEmail: "bruno.revenda@email.com", ticketsSold: 38, revenue: 760000 },
    { eventId: "evt-1", eventName: "Festival de Verão 2025", resellerId: "rsl-3", resellerEmail: "carla.revenda@email.com", ticketsSold: 22, revenue: 330000 },
    { eventId: "evt-2", eventName: "Show Nacional", resellerId: "rsl-1", resellerEmail: "alice.revenda@email.com", ticketsSold: 52, revenue: 1040000 },
    { eventId: "evt-2", eventName: "Show Nacional", resellerId: "rsl-2", resellerEmail: "bruno.revenda@email.com", ticketsSold: 41, revenue: 820000 },
    { eventId: "evt-2", eventName: "Show Nacional", resellerId: "rsl-3", resellerEmail: "carla.revenda@email.com", ticketsSold: 28, revenue: 420000 },
    { eventId: "evt-3", eventName: "Workshop Corporativo", resellerId: "rsl-1", resellerEmail: "alice.revenda@email.com", ticketsSold: 27, revenue: 540000 },
    { eventId: "evt-3", eventName: "Workshop Corporativo", resellerId: "rsl-2", resellerEmail: "bruno.revenda@email.com", ticketsSold: 17, revenue: 340000 },
    { eventId: "evt-3", eventName: "Workshop Corporativo", resellerId: "rsl-3", resellerEmail: "carla.revenda@email.com", ticketsSold: 11, revenue: 165000 }
]

const mockInvitesSeed: TResaleInvite[] = [
    {
        id: "inv-1",
        email: "novo.revendedor@email.com",
        status: "PENDING",
        commissionRate: 10,
        siid: "abc123xyz",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "inv-2",
        email: "outro.convite@email.com",
        status: "PENDING",
        commissionRate: 12,
        siid: "def456uvw",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: "inv-3",
        email: "alice.revenda@email.com",
        status: "ACCEPTED",
        commissionRate: 12,
        siid: "old-siid-alice",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
]

const RevendaPannel = () => {
    const [resellers, setResellers] = useState<TResale[]>(mockResellersSeed)
    const [newEmail, setNewEmail] = useState("")
    const [newCommissionRate, setNewCommissionRate] = useState("10")
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [commissionInfoDialogOpen, setCommissionInfoDialogOpen] = useState(false)
    const [editingResaleId, setEditingResaleId] = useState<string | null>(null)
    const [editingCommissionRate, setEditingCommissionRate] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [resaleToDelete, setResaleToDelete] = useState<TResale | null>(null)
    const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false)
    const [resaleToToggle, setResaleToToggle] = useState<TResale | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    const [invites, setInvites] = useState<TResaleInvite[]>(mockInvitesSeed)
    const [cancelInviteDialogOpen, setCancelInviteDialogOpen] = useState(false)
    const [inviteToCancel, setInviteToCancel] = useState<TResaleInvite | null>(null)
    const [isCancellingInvite, setIsCancellingInvite] = useState(false)
    const [salesByEvent] = useState<TResaleSalesByEvent[]>(mockSalesByEventSeed)

    const chartDataAllResellers = useMemo(() => {
        return [...resellers]
            .map((reseller) => ({
                id: reseller.id,
                email: reseller.email,
                vendas: getSalesCount(reseller),
                receita: getTotalRevenue(reseller)
            }))
            .sort((a, b) => b.vendas - a.vendas)
    }, [resellers])

    const chartDataByEvent = useMemo(() => {
        const byEvent = new Map<string, Record<string, number>>()
        const resellerIds = new Set<string>()
        salesByEvent.forEach((row) => {
            resellerIds.add(row.resellerId)
            if (!byEvent.has(row.eventName)) {
                byEvent.set(row.eventName, {})
            }
            const eventRow = byEvent.get(row.eventName)!
            eventRow[row.resellerId] = row.ticketsSold
        })
        const resellerMap = new Map<string, string>()
        resellers.forEach((r) => resellerMap.set(r.id, r.email))
        return {
            data: Array.from(byEvent.entries()).map(([eventName, values]) => ({
                eventName,
                ...Object.fromEntries(
                    Array.from(resellerIds).map((id) => [id, values[id] ?? 0])
                )
            })),
            resellerIds: Array.from(resellerIds),
            resellerEmails: resellers.reduce((acc, r) => {
                acc[r.id] = r.email
                return acc
            }, {} as Record<string, string>)
        }
    }, [salesByEvent, resellers])

    const RESELLER_CHART_COLORS = ["#6C4BFF", "#FF6F91", "#4ECDC4", "#95E1D3", "#F38181", "#AA96DA", "#FCBAD3", "#A8D8EA"]

    const stats = useMemo(() => {
        const totalResellers = resellers.length
        const activeResellers = resellers.filter((reseller) => reseller.isActive === true).length
        const totalSales = resellers.reduce((sum, reseller) => sum + getSalesCount(reseller), 0)
        const averageSalesPerReseller = totalResellers > 0 ? Math.round(totalSales / totalResellers) : 0

        return {
            totalResellers,
            activeResellers,
            totalSales,
            averageSalesPerReseller
        }
    }, [resellers])

    const isMutating = isCreating || isUpdating || isDeleting || isToggling || isCancellingInvite

    const handleCreateResale = async () => {
        const normalizedEmail = newEmail.trim().toLowerCase()
        const parsedCommissionRate = Number(newCommissionRate.replace(",", "."))

        if (!normalizedEmail) {
            Toast.error("Informe o email do revendedor")
            return
        }

        if (!isValidEmail(normalizedEmail)) {
            Toast.error("Informe um email válido")
            return
        }

        if (!Number.isFinite(parsedCommissionRate) || parsedCommissionRate <= 0 || parsedCommissionRate > 100) {
            Toast.error("Informe uma taxa de comissão válida entre 0,01% e 100%")
            return
        }

        try {
            setIsCreating(true)
            await new Promise((resolve) => setTimeout(resolve, 350))

            setResellers((prev) => [
                {
                    id: `rsl-${Date.now()}`,
                    email: normalizedEmail,
                    commissionRate: parsedCommissionRate,
                    totalSales: 0,
                    totalRevenue: 0,
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                ...prev
            ])
            setInvites((prev) => [
                {
                    id: `inv-${Date.now()}`,
                    email: normalizedEmail,
                    status: "PENDING",
                    commissionRate: parsedCommissionRate,
                    siid: `siid-${Date.now()}`,
                    createdAt: new Date().toISOString()
                },
                ...prev
            ])

            Toast.success("Revendedor adicionado com sucesso (mock)")
            setNewEmail("")
            setNewCommissionRate("10")
            setCreateDialogOpen(false)
        } catch (error) {
            Toast.error("Não foi possível adicionar o revendedor")
        } finally {
            setIsCreating(false)
        }
    }

    const startEdit = (reseller: TResale) => {
        setEditingResaleId(reseller.id)
        setEditingCommissionRate(String(reseller.commissionRate ?? 0))
    }

    const cancelEdit = () => {
        setEditingResaleId(null)
        setEditingCommissionRate("")
    }

    const handleSaveEdit = async () => {
        if (!editingResaleId) return

        const parsedCommissionRate = Number(editingCommissionRate.replace(",", "."))

        if (!Number.isFinite(parsedCommissionRate) || parsedCommissionRate <= 0 || parsedCommissionRate > 100) {
            Toast.error("Informe uma taxa de comissão válida entre 0,01% e 100%")
            return
        }

        try {
            setIsUpdating(true)
            await new Promise((resolve) => setTimeout(resolve, 350))

            setResellers((prev) =>
                prev.map((item) =>
                    item.id === editingResaleId
                        ? {
                            ...item,
                            commissionRate: parsedCommissionRate,
                            updatedAt: new Date().toISOString()
                        }
                        : item
                )
            )

            Toast.success("Revendedor atualizado com sucesso (mock)")
            cancelEdit()
        } catch (error) {
            Toast.error("Não foi possível atualizar o revendedor")
        } finally {
            setIsUpdating(false)
        }
    }

    const openDeleteDialog = (reseller: TResale) => {
        setResaleToDelete(reseller)
        setDeleteDialogOpen(true)
    }

    const openToggleStatusDialog = (reseller: TResale) => {
        setResaleToToggle(reseller)
        setToggleStatusDialogOpen(true)
    }

    const handleToggleStatus = async () => {
        if (!resaleToToggle) return

        try {
            setIsToggling(true)
            await new Promise((resolve) => setTimeout(resolve, 250))

            setResellers((prev) =>
                prev.map((item) =>
                    item.id === resaleToToggle.id
                        ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() }
                        : item
                )
            )
            const newStatus = !resaleToToggle.isActive
            Toast.success(
                newStatus
                    ? "Revendedor ativado com sucesso (mock)"
                    : "Revendedor inativado com sucesso (mock)"
            )
            setToggleStatusDialogOpen(false)
            setResaleToToggle(null)
        } catch (error) {
            Toast.error("Não foi possível alterar o status do revendedor")
        } finally {
            setIsToggling(false)
        }
    }

    const handleDeleteResale = async () => {
        if (!resaleToDelete) return

        try {
            setIsDeleting(true)
            await new Promise((resolve) => setTimeout(resolve, 250))

            setResellers((prev) => prev.filter((item) => item.id !== resaleToDelete.id))
            Toast.success("Revendedor excluído com sucesso (mock)")
            setDeleteDialogOpen(false)
            setResaleToDelete(null)
        } catch (error) {
            Toast.error("Não foi possível excluir o revendedor")
        } finally {
            setIsDeleting(false)
        }
    }

    const openCancelInviteDialog = (invite: TResaleInvite) => {
        setInviteToCancel(invite)
        setCancelInviteDialogOpen(true)
    }

    const handleCancelInvite = async () => {
        if (!inviteToCancel) return
        try {
            setIsCancellingInvite(true)
            await new Promise((resolve) => setTimeout(resolve, 250))
            setInvites((prev) =>
                prev.map((inv) =>
                    inv.id === inviteToCancel.id ? { ...inv, status: "CANCELLED" as const } : inv
                )
            )
            Toast.success("Convite cancelado com sucesso (mock)")
            setCancelInviteDialogOpen(false)
            setInviteToCancel(null)
        } catch (error) {
            Toast.error("Não foi possível cancelar o convite")
        } finally {
            setIsCancellingInvite(false)
        }
    }

    const pendingInvites = useMemo(() => invites.filter((i) => i.status === "PENDING"), [invites])

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] pb-[240px]! container">
            <section className="space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-psi-primary sm:text-4xl">Revenda</h1>
                    <p className="text-psi-dark/70 max-w-3xl">
                        Cadastre e gerencie revendedores da sua operação, acompanhe quem mais vende e mantenha o controle rápido do desempenho.
                    </p>
                </div>

                <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 shadow-md shadow-black/5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-psi-primary/10 text-psi-primary flex items-center justify-center">
                                <PlusCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-psi-dark">Adicionar novo revendedor</h2>
                                <p className="text-sm text-psi-dark/60">Abra o diálogo para informar e-mail e comissão.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-700">
                                Modo mock ativo
                            </Badge>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCommissionInfoDialogOpen(true)}
                                disabled={isMutating}
                            >
                                Como funciona o comissionamento
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => setCreateDialogOpen(true)}
                                disabled={isMutating}
                            >
                                <PlusCircle className="h-4 w-4" />
                                Novo revendedor
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon={Users} title="Total de revendedores" value={stats.totalResellers.toString()} />
                    <StatCard icon={TrendingUp} title="Revendedores ativos" value={stats.activeResellers.toString()} />
                    <StatCard icon={BarChart3} title="Total de vendas" value={stats.totalSales.toString()} />
                    <StatCard icon={TrendingUp} title="Média por revendedor" value={stats.averageSalesPerReseller.toString()} />
                </div>

                <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 shadow-md shadow-black/5">
                    <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-xl font-medium text-psi-dark">Todos os revendedores – Vendas e receita</h2>
                            <p className="text-sm text-psi-dark/60">Quantidade de vendas e valor em reais por revendedor.</p>
                        </div>
                        <Badge variant="secondary" className="bg-psi-dark/5 text-psi-dark/70">
                            {chartDataAllResellers.length} revendedores
                        </Badge>
                    </div>

                    {chartDataAllResellers.length === 0 ? (
                        <div className="rounded-2xl border border-psi-dark/10 bg-psi-dark/5 p-8 text-center text-sm text-psi-dark/60">
                            Sem dados de vendas para montar o gráfico no momento.
                        </div>
                    ) : (
                        <div className="h-[320px] min-h-[280px]" style={{ minHeight: Math.max(280, chartDataAllResellers.length * 44) }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={chartDataAllResellers}
                                    layout="vertical"
                                    margin={{ top: 8, right: 56, left: 24, bottom: 8 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                    <XAxis type="number" allowDecimals={false} xAxisId="vendas" orientation="bottom" />
                                    <XAxis type="number" xAxisId="receita" orientation="top" tickFormatter={(v) => ValueUtils.centsToCurrency(v)} />
                                    <YAxis
                                        dataKey="email"
                                        type="category"
                                        width={220}
                                        tick={{ fontSize: 11 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #E4E6F0",
                                            borderRadius: "8px"
                                        }}
                                        formatter={(value: number, name: string) => {
                                            if (name === "vendas") return [value.toLocaleString("pt-BR"), "Vendas (un.)"]
                                            if (name === "receita") return [ValueUtils.centsToCurrency(value), "Receita"]
                                            return [value, name]
                                        }}
                                        labelFormatter={(label) => `Revendedor: ${label}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="vendas" name="Vendas (un.)" fill="#6C4BFF" radius={[0, 8, 8, 0]} xAxisId="vendas" />
                                    <Bar dataKey="receita" name="Receita (R$)" fill="#4ECDC4" radius={[0, 8, 8, 0]} xAxisId="receita" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 shadow-md shadow-black/5">
                    <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-xl font-medium text-psi-dark">Eficiência por evento</h2>
                            <p className="text-sm text-psi-dark/60">Vendas de cada revendedor em cada evento do organizador.</p>
                        </div>
                        <Badge variant="secondary" className="bg-psi-dark/5 text-psi-dark/70">
                            {chartDataByEvent.data.length} eventos
                        </Badge>
                    </div>

                    {chartDataByEvent.data.length === 0 || chartDataByEvent.resellerIds.length === 0 ? (
                        <div className="rounded-2xl border border-psi-dark/10 bg-psi-dark/5 p-8 text-center text-sm text-psi-dark/60">
                            Sem dados de vendas por evento no momento.
                        </div>
                    ) : (
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartDataByEvent.data}
                                    margin={{ top: 8, right: 24, left: 8, bottom: 80 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                    <XAxis
                                        dataKey="eventName"
                                        tick={{ fontSize: 11 }}
                                        angle={-35}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #E4E6F0",
                                            borderRadius: "8px"
                                        }}
                                        formatter={(value: number, name: string) => [
                                            value.toLocaleString("pt-BR"),
                                            chartDataByEvent.resellerEmails[name] ?? name
                                        ]}
                                        labelFormatter={(label) => `Evento: ${label}`}
                                    />
                                    <Legend
                                        formatter={(value) => chartDataByEvent.resellerEmails[value] ?? value}
                                    />
                                    {chartDataByEvent.resellerIds.map((resellerId, index) => (
                                        <Bar
                                            key={resellerId}
                                            dataKey={resellerId}
                                            name={resellerId}
                                            fill={RESELLER_CHART_COLORS[index % RESELLER_CHART_COLORS.length]}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 shadow-md shadow-black/5 space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-xl font-medium text-psi-dark">Convites enviados</h2>
                            <p className="text-sm text-psi-dark/60">Acompanhe e cancele convites pendentes.</p>
                        </div>
                        <Badge variant="secondary" className="bg-psi-dark/5 text-psi-dark/70">
                            {invites.length} no total · {pendingInvites.length} pendentes
                        </Badge>
                    </div>
                    {invites.length === 0 ? (
                        <div className="rounded-2xl border border-psi-dark/10 bg-psi-dark/5 p-10 text-center">
                            <p className="text-sm text-psi-dark/60">Nenhum convite enviado até o momento.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="rounded-2xl border border-psi-dark/10 bg-white p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0">
                                            <Mail className="h-5 w-5 text-psi-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-base font-medium text-psi-dark truncate">{invite.email}</p>
                                            <p className="text-xs text-psi-dark/60 mt-0.5">
                                                Enviado em {new Date(invite.createdAt).toLocaleDateString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                                {invite.commissionRate != null && (
                                                    <> · Comissão: {formatCommissionRate(invite.commissionRate)}</>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge
                                            variant="secondary"
                                            className={
                                                invite.status === "PENDING"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : invite.status === "ACCEPTED"
                                                      ? "bg-emerald-100 text-emerald-700"
                                                      : "bg-psi-dark/10 text-psi-dark/70"
                                            }
                                        >
                                            {invite.status === "PENDING"
                                                ? "Pendente"
                                                : invite.status === "ACCEPTED"
                                                  ? "Aceito"
                                                  : "Cancelado"}
                                        </Badge>
                                        {invite.status === "PENDING" && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openCancelInviteDialog(invite)}
                                                disabled={isMutating}
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Cancelar convite
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 shadow-md shadow-black/5 space-y-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-xl font-medium text-psi-dark">Lista de revendedores</h2>
                            <p className="text-sm text-psi-dark/60">Edite apenas a taxa de comissão, ative/inative ou exclua quando necessário.</p>
                        </div>
                        <Badge variant="secondary" className="bg-psi-dark/5 text-psi-dark/70">
                            {stats.totalResellers} cadastrados
                        </Badge>
                    </div>

                    {resellers.length === 0 ? (
                        <div className="rounded-2xl border border-psi-dark/10 bg-psi-dark/5 p-10 text-center">
                            <p className="text-sm text-psi-dark/60">Nenhum revendedor cadastrado até o momento.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {resellers.map((reseller) => {
                                const isEditing = editingResaleId === reseller.id
                                const sales = getSalesCount(reseller)

                                return (
                                    <div
                                        key={reseller.id}
                                        className="rounded-2xl border border-psi-dark/10 bg-white p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            {isEditing ? (
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_180px]">
                                                    <Input
                                                        value={reseller.email}
                                                        type="email"
                                                        className="h-10"
                                                        disabled
                                                    />
                                                    <Input
                                                        value={editingCommissionRate}
                                                        onChange={(event) => setEditingCommissionRate(event.target.value)}
                                                        type="number"
                                                        min="0.01"
                                                        max="100"
                                                        step="0.01"
                                                        placeholder="Taxa (%)"
                                                        className="h-10"
                                                        disabled={isMutating}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-base font-medium text-psi-dark truncate">{reseller.email}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary">
                                                    {sales.toLocaleString("pt-BR")} vendas
                                                </Badge>
                                                <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                                                    Comissão: {formatCommissionRate(reseller.commissionRate)}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap sm:items-center">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={reseller.isActive === true}
                                                    onCheckedChange={() => openToggleStatusDialog(reseller)}
                                                    disabled={isMutating}
                                                    aria-label={reseller.isActive ? "Inativar revendedor" : "Ativar revendedor"}
                                                />
                                                <span className="text-sm font-medium text-psi-dark/80">
                                                    {reseller.isActive ? "Ativo" : "Inativo"}
                                                </span>
                                            </div>
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        onClick={handleSaveEdit}
                                                        disabled={isMutating}
                                                    >
                                                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={cancelEdit}
                                                        disabled={isMutating}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => startEdit(reseller)}
                                                    disabled={isMutating}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Editar
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(reseller)}
                                                disabled={isMutating}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Excluir
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            <DialogConfirm
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteResale}
                title="Excluir revendedor"
                description={`Tem certeza que deseja excluir "${resaleToDelete?.email ?? "este revendedor"}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={isDeleting}
                variant="destructive"
            />
            <DialogConfirm
                open={toggleStatusDialogOpen}
                onOpenChange={setToggleStatusDialogOpen}
                onConfirm={handleToggleStatus}
                title={resaleToToggle?.isActive ? "Inativar revendedor" : "Ativar revendedor"}
                description={
                    resaleToToggle?.isActive
                        ? `Tem certeza que deseja inativar "${resaleToToggle.email}"? O revendedor não poderá realizar novas vendas até ser ativado novamente.`
                        : `Tem certeza que deseja ativar "${resaleToToggle?.email ?? "este revendedor"}"? O revendedor poderá voltar a realizar vendas.`
                }
                confirmText={resaleToToggle?.isActive ? "Inativar" : "Ativar"}
                cancelText="Cancelar"
                isLoading={isToggling}
                variant="default"
            />
            <DialogConfirm
                open={cancelInviteDialogOpen}
                onOpenChange={setCancelInviteDialogOpen}
                onConfirm={handleCancelInvite}
                title="Cancelar convite"
                description={
                    inviteToCancel
                        ? `Tem certeza que deseja cancelar o convite enviado para "${inviteToCancel.email}"? O link deixará de ser válido.`
                        : ""
                }
                confirmText="Cancelar convite"
                cancelText="Voltar"
                isLoading={isCancellingInvite}
                variant="destructive"
            />
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar novo revendedor</DialogTitle>
                        <DialogDescription>
                            Informe o e-mail e a taxa de comissão para cadastrar o revendedor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-psi-dark">Email</label>
                            <Input
                                value={newEmail}
                                onChange={(event) => setNewEmail(event.target.value)}
                                placeholder="revendedor@email.com"
                                type="email"
                                disabled={isMutating}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-psi-dark">Taxa de comissão (%)</label>
                            <Input
                                value={newCommissionRate}
                                onChange={(event) => setNewCommissionRate(event.target.value)}
                                placeholder="10"
                                type="number"
                                min="0.01"
                                max="100"
                                step="0.01"
                                disabled={isMutating}
                                className="h-11"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateDialogOpen(false)}
                            disabled={isMutating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleCreateResale}
                            disabled={isMutating}
                        >
                            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                            Adicionar revendedor
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={commissionInfoDialogOpen} onOpenChange={setCommissionInfoDialogOpen}>
                <DialogContent className="sm:max-w-[620px]">
                    <DialogHeader>
                        <DialogTitle>Como funciona o comissionamento</DialogTitle>
                        <DialogDescription>
                            Entenda como a comissão é dividida em cada venda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 text-sm text-psi-dark/80 leading-relaxed">
                        <p>
                            O comissionamento funciona com base no valor ganho pelo organizador na venda de um ingresso.
                        </p>
                        <p>
                            Exemplo: se um ingresso gerou <strong>R$ 50,00</strong> de lucro para o organizador e a taxa de
                            comissão do revendedor que vendeu esse ingresso é de <strong>10%</strong>, então
                            <strong> R$ 5,00 </strong>
                            ficam para o revendedor e
                            <strong> R$ 45,00 </strong>
                            ficam para o organizador.
                        </p>
                        <p>
                            O revendedor possui sua própria carteira dentro da plataforma e ele mesmo realiza o saque dos
                            valores ganhos usando a própria conta.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setCommissionInfoDialogOpen(false)}
                        >
                            Entendi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

type TStatCardProps = {
    icon: typeof Users
    title: string
    value: string
}

const StatCard = ({ icon: Icon, title, value }: TStatCardProps) => (
    <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-5 flex items-center justify-between gap-4 shadow-sm">
        <div>
            <p className="text-xs uppercase tracking-[0.2em] text-psi-dark/40">Resumo</p>
            <p className="text-sm font-medium text-psi-dark/70">{title}</p>
            <p className="text-3xl font-medium text-psi-dark mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-psi-primary/10 text-psi-primary flex items-center justify-center">
            <Icon className="h-6 w-6" />
        </div>
    </div>
)

export {
    RevendaPannel
}