"use client"

import { useMemo, useState } from "react"
import { usePayoutListAdmin } from "@/hooks/Payout/usePayoutListAdmin"
import type { TPayoutAdminListResponse, TPayoutStatus } from "@/types/Payout/TPayout"
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
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/Pagination/Pagination"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import {
    ChevronDown,
    Calendar,
    User,
    Building2,
    DollarSign,
    ArrowDown,
    ArrowUp,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    CreditCard,
    SquareArrowRight
} from "lucide-react"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"

const payoutStatusConfig: Record<TPayoutStatus, { label: string; badgeClass: string }> = {
    PROCESSING: {
        label: "Processando",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    PAID: {
        label: "Pago",
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    FAILED: {
        label: "Falhou",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    }
}

const payoutMethodConfig: Record<TPayoutAdminListResponse["method"], { label: string; icon: string }> = {
    PIX: {
        label: "PIX",
        icon: "/icons/payment/pix.png"
    },
    BANK_TRANSFER: {
        label: "Transferência Bancária",
        icon: "/icons/payment/transfer.png"
    }
}

const AdmTransferenciasPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState<TPayoutStatus | "all">("all")

    const offset = (currentPage - 1) * 50

    const { data, isLoading } = usePayoutListAdmin({
        offset
    })

    const payouts = useMemo(() => {
        if (!data?.data) return []
        const nestedData = (data.data as any)?.data
        if (Array.isArray(nestedData)) {
            return nestedData
        }
        if (Array.isArray(data.data)) {
            return data.data
        }
        return []
    }, [data])

    const filteredPayouts = useMemo(() => {
        if (selectedStatus === "all") return payouts
        return payouts.filter(payout => payout.status === selectedStatus)
    }, [payouts, selectedStatus])

    const responseData = (data?.data as any) || {}
    const totalItems = responseData.total || 0
    const limit = responseData.limit || 50
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

    const toggleRow = (payoutId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [payoutId]: !prev[payoutId]
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
        setSelectedStatus(status as TPayoutStatus | "all")
        setCurrentPage(1)
    }

    const getAccountTypeLabel = (type: string | null | undefined) => {
        if (type === "CONTA_CORRENTE") return "Conta Corrente"
        if (type === "CONTA_POUPANCA") return "Conta Poupança"
        return type || "—"
    }

    const getPixTypeLabel = (type: string | null | undefined) => {
        const labels: Record<string, string> = {
            CPF: "CPF",
            CNPJ: "CNPJ",
            EMAIL: "E-mail",
            PHONE: "Telefone",
            EVP: "Chave Aleatória"
        }
        return labels[type || ""] || type || "—"
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
                            Transferências
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Visualize todas as transferências realizadas para os organizadores. Acompanhe saques, status e detalhes completos de cada transferência.
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
                                <SelectItem value="PROCESSING">Processando</SelectItem>
                                <SelectItem value="PAID">Pago</SelectItem>
                                <SelectItem value="FAILED">Falhou</SelectItem>
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
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Transferência</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Organizador</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Valor</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayouts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                    <SquareArrowRight className="h-8 w-8 text-psi-primary/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-medium text-psi-dark">Nenhuma transferência encontrada</p>
                                                    <p className="text-sm text-psi-dark/50">As transferências aparecerão aqui.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayouts.map((payout) => {
                                        const isOpen = openRows[payout.id] || false
                                        const statusConfig = payoutStatusConfig[payout.status as TPayoutStatus]
                                        const methodConfig = payoutMethodConfig[payout.method as TPayoutAdminListResponse["method"]]
                                        const user = payout.User
                                        const isFailed = payout.status === "FAILED"
                                        const rowClassName = isFailed 
                                            ? "border-b border-red-200 bg-red-50/30 hover:bg-red-50/50 transition-colors" 
                                            : "border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors"

                                        return (
                                            <>
                                                <TableRow key={payout.id} className={rowClassName}>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={methodConfig.icon}
                                                                    alt={methodConfig.label}
                                                                    className="h-6 w-6"
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-psi-dark text-sm">
                                                                        {methodConfig.label}
                                                                    </p>
                                                                    <p className="text-sm text-psi-dark/80">
                                                                        {formatDateTime(payout.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-psi-dark text-sm">
                                                                {user.Organizer?.companyName || `${user.firstName} ${user.lastName}`}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/50">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-psi-dark text-sm">
                                                                {ValueUtils.centsToCurrency(payout.netValue)}
                                                            </p>
                                                            {payout.transactionFee > 0 && (
                                                                <p className="text-xs text-psi-dark/50">
                                                                    Taxa: {ValueUtils.centsToCurrency(payout.transactionFee)}
                                                                </p>
                                                            )}
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
                                                            onClick={() => toggleRow(payout.id)}
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-psi-primary hover:text-psi-primary/80 transition-all hover:gap-3 px-3 py-1.5 rounded-lg hover:bg-psi-primary/5"
                                                        >
                                                            Ver detalhes
                                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                                {isOpen && (
                                                    <TableRow className="border-0">
                                                        <TableCell colSpan={5} className="p-0">
                                                            <div className="bg-linear-to-br from-psi-dark/2 to-psi-dark/5 px-8 py-8 space-y-8 border-t border-psi-dark/10">
                                                                <div className="grid gap-6
                                                                md:grid-cols-2
                                                                lg:grid-cols-3">
                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <User className="h-4 w-4 text-psi-primary" />
                                                                            Organizador
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-base font-medium text-psi-dark">
                                                                                {user.firstName} {user.lastName}
                                                                            </p>
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                {user.email}
                                                                            </p>
                                                                            {user.phone && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Telefone: {user.phone}
                                                                                </p>
                                                                            )}
                                                                            {user.document && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Documento: {user.document}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {user.Organizer && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Building2 className="h-4 w-4 text-psi-primary" />
                                                                                Empresa
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <p className="text-base font-medium text-psi-dark">
                                                                                    {user.Organizer.companyName}
                                                                                </p>
                                                                                {user.Organizer.companyDocument && (
                                                                                    <p className="text-sm text-psi-dark/70">
                                                                                        {user.Organizer.companyDocument}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <DollarSign className="h-4 w-4 text-psi-primary" />
                                                                            Valores
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-sm text-psi-dark/70">Valor bruto:</span>
                                                                                <span className="text-sm font-medium text-psi-dark">
                                                                                    {ValueUtils.centsToCurrency(payout.grossValue)}
                                                                                </span>
                                                                            </div>
                                                                            {payout.transactionFee > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Taxa de transação:</span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {ValueUtils.centsToCurrency(payout.transactionFee)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex justify-between items-center pt-2 border-t border-psi-dark/10">
                                                                                <span className="text-sm font-medium text-psi-dark">Valor líquido:</span>
                                                                                <span className="text-base font-semibold text-emerald-600">
                                                                                    {ValueUtils.centsToCurrency(payout.netValue)}
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
                                                                                Criado: {formatDateTime(payout.createdAt)}
                                                                            </p>
                                                                            {payout.paidAt && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Pago: {formatDateTime(payout.paidAt)}
                                                                                </p>
                                                                            )}
                                                                            {payout.updatedAt && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Atualizado: {formatDateTime(payout.updatedAt)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {payout.transferObject && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm
                                                                        md:col-span-2
                                                                        lg:col-span-3">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <CreditCard className="h-4 w-4 text-psi-primary" />
                                                                                {payout.method === "PIX" ? "Dados PIX" : "Dados Bancários"}
                                                                            </div>
                                                                            <div className="grid gap-3
                                                                            md:grid-cols-2
                                                                            lg:grid-cols-3">
                                                                                {payout.method === "PIX" ? (
                                                                                    <>
                                                                                        {payout.transferObject.type && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Tipo de chave</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {getPixTypeLabel(payout.transferObject.type)}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.key && (
                                                                                            <div className="md:col-span-2 lg:col-span-2">
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Chave PIX</p>
                                                                                                <p className="text-sm font-medium text-psi-dark break-all">
                                                                                                    {payout.transferObject.key}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {payout.transferObject.bankCode && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Banco</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.bankCode}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.agency && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Agência</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.agency}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.accountNumber && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Conta</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.accountNumber}
                                                                                                    {payout.transferObject.accountDigit && `-${payout.transferObject.accountDigit}`}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.accountType && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Tipo de conta</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {getAccountTypeLabel(payout.transferObject.accountType)}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.accountName && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Nome da conta</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.accountName}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.ownerName && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Titular</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.ownerName}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.ownerDocument && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Documento do titular</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.ownerDocument}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {payout.transferObject.ownerBirth && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Data de nascimento</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {payout.transferObject.ownerBirth}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {payout.failReason && (
                                                                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 space-y-2 shadow-sm
                                                                        md:col-span-2
                                                                        lg:col-span-3">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-red-600 uppercase tracking-wide">
                                                                                <XCircle className="h-4 w-4" />
                                                                                Motivo da Falha
                                                                            </div>
                                                                            <p className="text-sm text-red-700">
                                                                                {payout.failReason}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {payout.transactionReceiptUrl && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <ExternalLink className="h-4 w-4 text-psi-primary" />
                                                                                Comprovante
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <a
                                                                                    href={payout.transactionReceiptUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-2 text-sm text-psi-primary hover:text-psi-primary/80 font-medium"
                                                                                >
                                                                                    Ver comprovante da transferência
                                                                                    <ExternalLink className="h-3 w-3" />
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {payout.externalTransactionId && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm w-fit">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <ExternalLink className="h-4 w-4 text-psi-primary" />
                                                                                Informações adicionais
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <p className="text-xs text-psi-dark/60">ID da transação externa: <span className="font-medium text-psi-dark text-sm">{payout.externalTransactionId}</span></p>
                                                                                <p className="text-xs text-psi-dark/50">ID interno: {payout.id}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
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
    AdmTransferenciasPannel
}
