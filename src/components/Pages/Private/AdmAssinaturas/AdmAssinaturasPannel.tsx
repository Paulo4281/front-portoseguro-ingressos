"use client"

import { useMemo, useState } from "react"
import { useSubscriptionList } from "@/hooks/Subscription/useSubscriptionList"
import type { TSubscription } from "@/types/Subscription/TSubscription"
import { Background } from "@/components/Background/Background"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/Pagination/Pagination"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import {
    ChevronDown,
    Calendar,
    CreditCard,
    User,
    Building2,
    Crown,
    DollarSign,
    FileText
} from "lucide-react"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { DocumentUtils } from "@/utils/Helpers/DocumentUtils/DocumentUtils"

const subscriptionStatusConfig: Record<TSubscription["status"], { label: string; badgeClass: string }> = {
    ACTIVE: {
        label: "Ativa",
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    PENDING: {
        label: "Pendente",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    OVERDUE: {
        label: "Vencida",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    FAILED: {
        label: "Falhou",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    CANCELLED: {
        label: "Cancelada",
        badgeClass: "bg-gray-50 text-gray-600 border-gray-200"
    }
}

const getCardBrandIcon = (brand: string | null | undefined): string => {
    if (!brand) return "/icons/payment/card-brand/card-unknown.png"
    const brandLower = brand.toLowerCase()
    const brandMap: Record<string, string> = {
        amex: "card-amex.png",
        discover: "card-discover.png",
        hipercard: "card-hipercard.png",
        jcb: "card-jcb.png",
        mastercard: "card-master.png",
        visa: "card-visa.png",
        elo: "card-elo.png",
        cabal: "card-cabal.png",
        banescard: "card-banescard.png",
    }
    const iconName = brandMap[brandLower] || "card-unknown.png"
    return `/icons/payment/card-brand/${iconName}`
}

const AdmAssinaturasPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState<TSubscription["status"] | "all">("all")

    const offset = (currentPage - 1) * 50

    const { data, isLoading } = useSubscriptionList({
        offset,
        status: selectedStatus === "all" ? undefined : selectedStatus
    })

    const subscriptions = useMemo(() => {
        if (!data?.data?.data) return []
        if (Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }, [data])

    const responseData = data?.data || { data: [], total: 0, limit: 50, offset: 0 }
    const totalItems = responseData.total || 0
    const limit = responseData.limit || 50
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

    const toggleRow = (subscriptionId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [subscriptionId]: !prev[subscriptionId]
        }))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    const formatDateTime = (dateString: string) => {
        return DateUtils.formatDate(dateString, "DD/MM/YYYY HH:mm")
    }

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status as TSubscription["status"] | "all")
        setCurrentPage(1)
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] container">
            <section className="space-y-8 px-4
            sm:px-6
            lg:px-8">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-medium text-psi-primary
                        sm:text-4xl">
                            Assinaturas
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Visualize todas as assinaturas na plataforma. Acompanhe status, valores e detalhes completos de cada assinatura.
                        </p>
                    </div>

                    <div className="flex gap-3
                    flex-col
                    sm:flex-row">
                        <Select value={selectedStatus} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full
                            sm:w-[250px] bg-psi-light">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                <SelectItem value="ACTIVE">Ativa</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="OVERDUE">Vencida</SelectItem>
                                <SelectItem value="FAILED">Falhou</SelectItem>
                                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-20 w-full rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 shadow-lg shadow-black/5 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-psi-dark/10 hover:bg-transparent bg-psi-dark/2">
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Assinatura</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Cliente</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Organizador</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Valor</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                    <Crown className="h-8 w-8 text-psi-primary/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-medium text-psi-dark">Nenhuma assinatura encontrada</p>
                                                    <p className="text-sm text-psi-dark/50">As assinaturas aparecerão aqui.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subscriptions.map((subscription) => {
                                        const isOpen = openRows[subscription.id] || false
                                        const statusConfig = subscriptionStatusConfig[subscription.status]

                                        return (
                                            <>
                                                <TableRow key={subscription.id} className="border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors">
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <Crown className="h-6 w-6 text-psi-primary" />
                                                                <div>
                                                                    <p className="font-medium text-psi-dark text-sm">
                                                                        CRM Pro
                                                                    </p>
                                                                    <p className="text-sm text-psi-dark/80">
                                                                        {DateUtils.formatDate(subscription.createdAt, "DD/MM/YYYY HH:mm")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-psi-dark text-sm">
                                                                {subscription.user.firstName} {subscription.user.lastName}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/50">
                                                                {subscription.user.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        {subscription.organizer ? (
                                                            <div className="space-y-1">
                                                                <p className="font-medium text-psi-dark text-sm">
                                                                    {subscription.organizer.companyName || "Sem nome"}
                                                                </p>
                                                                <p className="text-xs text-psi-dark/50">
                                                                    {DocumentUtils.formatCnpj(subscription.organizer.companyDocument || "") || "Sem documento"}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-psi-dark/50">Sem organizador</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-psi-dark text-sm">
                                                                {ValueUtils.centsToCurrency(subscription.grossValue)}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/50">
                                                                /mês
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <Badge className={statusConfig.badgeClass}>
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(subscription.id)}
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-psi-primary hover:text-psi-primary/80 transition-all hover:gap-3 px-3 py-1.5 rounded-lg hover:bg-psi-primary/5"
                                                        >
                                                            Ver detalhes
                                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                                {isOpen && (
                                                    <TableRow className="border-0">
                                                        <TableCell colSpan={6} className="p-0">
                                                            <div className="bg-linear-to-br from-psi-dark/2 to-psi-dark/5 px-8 py-8 space-y-8 border-t border-psi-dark/10">
                                                                <div className="grid gap-6
                                                                md:grid-cols-2
                                                                lg:grid-cols-3">
                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <User className="h-4 w-4 text-psi-primary" />
                                                                            Cliente
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-base font-medium text-psi-dark">
                                                                                {subscription.user.firstName} {subscription.user.lastName}
                                                                            </p>
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                {subscription.user.email}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {subscription.organizer && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Building2 className="h-4 w-4 text-psi-primary" />
                                                                                Organizador
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <p className="text-base font-medium text-psi-dark">
                                                                                    {subscription.organizer.companyName || "Sem nome"}
                                                                                </p>
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    {DocumentUtils.formatCnpj(subscription.organizer.companyDocument || "") || "Sem documento"}
                                                                                </p>
                                                                                {subscription.organizer.crmPlan && (
                                                                                    <Badge className={subscription.organizer.crmPlan === "PRO" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                                        {subscription.organizer.crmPlan === "PRO" ? "CRM Pro" : "CRM Básico"}
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <Crown className="h-4 w-4 text-psi-primary" />
                                                                            Assinatura
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-base font-medium text-psi-dark">
                                                                                CRM Pro
                                                                            </p>
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                Código: {subscription.code}
                                                                            </p>
                                                                            <Badge className={statusConfig.badgeClass}>
                                                                                {statusConfig.label}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>

                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <DollarSign className="h-4 w-4 text-psi-primary" />
                                                                            Valores
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-sm text-psi-dark/70">Valor mensal:</span>
                                                                                <span className="text-sm font-medium text-psi-dark">
                                                                                    {ValueUtils.centsToCurrency(subscription.grossValue)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <Calendar className="h-4 w-4 text-psi-primary" />
                                                                            Datas
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                Criado: {formatDateTime(subscription.createdAt)}
                                                                            </p>
                                                                            {subscription.updatedAt && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Atualizado: {formatDateTime(subscription.updatedAt)}
                                                                                </p>
                                                                            )}
                                                                            {subscription.cancelledAt && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Cancelado: {formatDateTime(subscription.cancelledAt)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {subscription.card && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <CreditCard className="h-4 w-4 text-psi-primary" />
                                                                                Cartão de Crédito
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <div>
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Nome no cartão</p>
                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                        {subscription.card.name}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Últimos 4 dígitos</p>
                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                        **** {subscription.card.last4}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Bandeira</p>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <img
                                                                                            src={getCardBrandIcon(subscription.card.brand)}
                                                                                            alt={subscription.card.brand}
                                                                                            className="h-8 w-8 object-contain"
                                                                                        />
                                                                                        <p className="text-xs font-light text-psi-dark">
                                                                                            {subscription.card.brand}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <FileText className="h-4 w-4 text-psi-primary" />
                                                                            Informações adicionais
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <hr />
                                                                            <p className="text-xs text-psi-dark/60">Código: <span className="font-medium text-psi-dark text-sm">{subscription.code}</span></p>
                                                                            <hr />
                                                                            {subscription.externalSubscriptionId && (
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    ID Externo: {subscription.externalSubscriptionId}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center pt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </section>
        </Background>
    )
}

export {
    AdmAssinaturasPannel
}
