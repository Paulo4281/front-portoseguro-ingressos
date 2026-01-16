"use client"

import { useMemo, useState } from "react"
import { usePaymentAdminList } from "@/hooks/Payment/usePaymentAdminList"
import type { TPaymentAdminListResponse } from "@/types/Payment/TPayment"
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
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import {
    ChevronDown,
    Calendar,
    CreditCard,
    User,
    Ticket,
    Building2,
    FileText,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    DollarSign,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle,
    Crown
} from "lucide-react"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { usePaymentRefund } from "@/hooks/Payment/usePaymentRefund"
import { usePaymentRefundCreditCard } from "@/hooks/Payment/usePaymentRefundCreditCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/Input/Input"
import { Textarea } from "@/components/ui/textarea"
import { useUserCheckPasswordAdmin } from "@/hooks/User/useUserCheckPasswordAdmin"
import { Toast } from "@/components/Toast/Toast"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { DialogUnderstandValues } from "@/components/Dialog/DialogUnderstandValues/DialogUnderstandValues"
import { HelpCircle } from "lucide-react"
import { DocumentUtils } from "@/utils/Helpers/DocumentUtils/DocumentUtils"

export const ticketCancelledByConfig: Record<string, { label: string; badgeClass: string }> = {
    ORGANIZER: {
        label: "Cancelado pelo organizador",
        badgeClass: "bg-purple-50 text-purple-600 border-purple-200"
    },
    CUSTOMER: {
        label: "Cancelado pelo cliente",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    ADMIN: {
        label: "Cancelado pelo administrador",
        badgeClass: "bg-blue-50 text-blue-600 border-blue-200"
    }
}

export const ticketStatusConfig: Record<string, { label: string; badgeClass: string }> = {
    PENDING: {
        label: "Pendente",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    CONFIRMED: {
        label: "Confirmado",
        badgeClass: "bg-blue-50 text-blue-600 border-blue-200"
    },
    USED: {
        label: "Utilizado",
        badgeClass: "bg-green-50 text-green-600 border-green-200"
    },
    PARTIALLY_USED: {
        label: "Utilizado parcialmente",
        badgeClass: "bg-yellow-50 text-yellow-600 border-yellow-200"
    },
    CANCELLED: {
        label: "Cancelado",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    REFUNDED: {
        label: "Estornado",
        badgeClass: "bg-purple-50 text-purple-600 border-purple-200"
    },
    REFUND_REQUESTED: {
        label: "Estorno solicitado",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    OVERDUE: {
        label: "Vencido",
        badgeClass: "bg-gray-50 text-gray-600 border-gray-200"
    },
    EXPIRED: {
        label: "Expirado",
        badgeClass: "bg-gray-50 text-gray-600 border-gray-200"
    },
    FAILED: {
        label: "Falhou",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    }
}

const paymentStatusConfig: Record<TPaymentAdminListResponse["status"], { label: string; badgeClass: string }> = {
    RECEIVED: {
        label: "Recebido",
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    CONFIRMED: {
        label: "Confirmado",
        badgeClass: "bg-blue-50 text-blue-600 border-blue-200"
    },
    PENDING: {
        label: "Pendente",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    FAILED: {
        label: "Falhou",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    REFUNDED: {
        label: "Estornado",
        badgeClass: "bg-purple-50 text-purple-600 border-purple-200"
    },
    REFUND_REQUESTED: {
        label: "Estorno solicitado",
        badgeClass: "bg-purple-50 text-purple-600 border-purple-200"
    },
    OVERDUE: {
        label: "Vencido",
        badgeClass: "bg-gray-50 text-gray-600 border-gray-200"
    }
}

const installmentStatusConfig: Record<string, { label: string; badgeClass: string }> = {
    RECEIVED: {
        label: "Recebido",
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    CONFIRMED: {
        label: "Confirmado",
        badgeClass: "bg-blue-50 text-blue-600 border-blue-200"
    },
    PENDING: {
        label: "Pendente",
        badgeClass: "bg-amber-50 text-amber-600 border-amber-200"
    },
    FAILED: {
        label: "Falhou",
        badgeClass: "bg-red-50 text-red-600 border-red-200"
    },
    REFUNDED: {
        label: "Estornado",
        badgeClass: "bg-purple-50 text-purple-600 border-purple-200"
    }
}

export const refundStatusConfig: Record<string, { label: string; badgeClass: string }> = {
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

const AdmPagamentosPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedStatus, setSelectedStatus] = useState<TPaymentAdminListResponse["status"] | "all">("all")

    const offset = (currentPage - 1) * 50

    const { data, isLoading } = usePaymentAdminList({
        offset,
        status: selectedStatus === "all" ? undefined : selectedStatus
    })

    const payments = useMemo(() => {
        if (!data?.data?.data) return []
        if (Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }, [data])

    const { mutateAsync: refundPayment, isPending: isRefundingPayment } = usePaymentRefund()
    const { mutateAsync: refundCreditCardPayment, isPending: isRefundingCreditCard } = usePaymentRefundCreditCard()
    const { mutateAsync: checkPasswordAdmin, isPending: isCheckingPassword } = useUserCheckPasswordAdmin()

    const responseData = data?.data || { data: [], total: 0, limit: 50, offset: 0 }
    const totalItems = responseData.total || 0
    const limit = responseData.limit || 50
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
    const [refundDialogOpen, setRefundDialogOpen] = useState(false)
    const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<TPaymentAdminListResponse | null>(null)
    const [refundTicketDialogOpen, setRefundTicketDialogOpen] = useState(false)
    const [selectedTicketForRefund, setSelectedTicketForRefund] = useState<{ payment: TPaymentAdminListResponse, ticket: TPaymentAdminListResponse["Tickets"][0] } | null>(null)
    const [adminPassword, setAdminPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [refundReason, setRefundReason] = useState("")
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [isUnderstandValuesDialogOpen, setIsUnderstandValuesDialogOpen] = useState(false)
    const [selectedPaymentForValues, setSelectedPaymentForValues] = useState<TPaymentAdminListResponse | null>(null)

    const toggleRow = (paymentId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [paymentId]: !prev[paymentId]
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
        setSelectedStatus(status as TPaymentAdminListResponse["status"] | "all")
        setCurrentPage(1)
    }

    const handleOpenRefundDialog = (payment: TPaymentAdminListResponse) => {
        setSelectedPaymentForRefund(payment)
        setRefundDialogOpen(true)
    }

    const handleCloseRefundDialog = () => {
        setRefundDialogOpen(false)
        setSelectedPaymentForRefund(null)
        setAdminPassword("")
        setRefundReason("")
        setPasswordError(null)
        setShowPassword(false)
    }

    const handleOpenRefundTicketDialog = (payment: TPaymentAdminListResponse, ticket: TPaymentAdminListResponse["Tickets"][0]) => {
        setSelectedTicketForRefund({ payment, ticket })
        setRefundTicketDialogOpen(true)
    }

    const handleCloseRefundTicketDialog = () => {
        setRefundTicketDialogOpen(false)
        setSelectedTicketForRefund(null)
        setAdminPassword("")
        setRefundReason("")
        setPasswordError(null)
        setShowPassword(false)
    }

    const handleConfirmRefund = async () => {
        if (!adminPassword.trim()) {
            setPasswordError("Por favor, digite a senha do administrador")
            return
        }

        if (!selectedPaymentForRefund) {
            return
        }

        try {
            const passwordResponse = await checkPasswordAdmin(adminPassword)
            
            if (passwordResponse?.success !== true) {
                setPasswordError("Senha incorreta. Tente novamente.")
                return
            }

            setPasswordError(null)

            if (selectedPaymentForRefund.method === "CREDIT_CARD") {
                if (!selectedPaymentForRefund.externalPaymentId) {
                    setPasswordError("Dados do pagamento incompletos")
                    return
                }

                const firstInstallment = selectedPaymentForRefund.Installments?.find(
                    (installment) => installment.externalInstallmentId
                )

                if (!firstInstallment?.externalInstallmentId) {
                    setPasswordError("Nenhuma parcela disponível para estorno")
                    return
                }

                await refundCreditCardPayment({
                    billingId: selectedPaymentForRefund.externalPaymentId,
                    installmentId: firstInstallment.externalInstallmentId,
                    params: {
                        description: refundReason.trim() || undefined
                    }
                })
            } else {
                await refundPayment({
                    billingId: selectedPaymentForRefund.externalPaymentId ?? "",
                    params: {
                        description: refundReason.trim() || undefined
                    }
                })
            }

            Toast.success("Estorno solicitado com sucesso")
            handleCloseRefundDialog()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Erro ao processar estorno. Tente novamente."
            setPasswordError(errorMessage)
            Toast.error(errorMessage)
        }
    }

    const handleConfirmRefundTicket = async () => {
        if (!adminPassword.trim()) {
            setPasswordError("Por favor, digite a senha do administrador")
            return
        }

        if (!selectedTicketForRefund) {
            return
        }

        const { payment, ticket } = selectedTicketForRefund

        if (!payment.Tickets || payment.Tickets.length <= 1) {
            setPasswordError("Não é possível estornar um ingresso específico quando há apenas um ingresso")
            return
        }

        try {
            const passwordResponse = await checkPasswordAdmin(adminPassword)
            
            if (passwordResponse?.success !== true) {
                setPasswordError("Senha incorreta. Tente novamente.")
                return
            }

            setPasswordError(null)

            if (payment.method === "CREDIT_CARD") {
                if (!payment.externalPaymentId) {
                    setPasswordError("Dados do pagamento incompletos")
                    return
                }

                const firstInstallment = payment.Installments?.find(
                    (installment) => installment.externalInstallmentId
                )

                if (!firstInstallment?.externalInstallmentId) {
                    setPasswordError("Nenhuma parcela disponível para estorno")
                    return
                }

                await refundCreditCardPayment({
                    billingId: payment.externalPaymentId,
                    installmentId: firstInstallment.externalInstallmentId,
                    params: {
                        description: refundReason.trim() || undefined,
                        ticketId: ticket.id
                    }
                })
            } else {
                await refundPayment({
                    billingId: payment.externalPaymentId ?? "",
                    params: {
                        description: refundReason.trim() || undefined,
                        ticketId: ticket.id
                    }
                })
            }

            Toast.success("Estorno do ingresso solicitado com sucesso")
            handleCloseRefundTicketDialog()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Erro ao processar estorno. Tente novamente."
            setPasswordError(errorMessage)
            Toast.error(errorMessage)
        }
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
                            Pagamentos
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Visualize todos os pagamentos realizados na plataforma. Acompanhe transações, parcelas e detalhes completos de cada pagamento.
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
                                <SelectItem value="RECEIVED">Recebido</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                                <SelectItem value="PENDING">Pendente</SelectItem>
                                <SelectItem value="FAILED">Falhou</SelectItem>
                                <SelectItem value="REFUNDED">Estornado</SelectItem>
                                <SelectItem value="OVERDUE">Vencido</SelectItem>
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
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Pagamento</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Cliente</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Evento</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Valor</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                    <DollarSign className="h-8 w-8 text-psi-primary/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-medium text-psi-dark">Nenhum pagamento encontrado</p>
                                                    <p className="text-sm text-psi-dark/50">Os pagamentos aparecerão aqui.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => {
                                        const isOpen = openRows[payment.id] || false
                                        const statusConfig = paymentStatusConfig[payment.status]
                                        const user = payment.User

    return (
        <>
                                                <TableRow key={payment.id} className="border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors">
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                {payment.method === "PIX" ? (
                                                                    <img
                                                                        src="/icons/payment/pix.png"
                                                                        alt="PIX"
                                                                        className="h-6 w-6"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src="/icons/payment/credit-card.png"
                                                                        alt="Cartão de Crédito"
                                                                        className="h-6 w-6"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <p className="font-medium text-psi-dark text-sm">
                                                                        {payment.method === "PIX" ? "PIX" : "Cartão de Crédito"}
                                                                    </p>
                                                                    <p className="text-sm text-psi-dark/80">
                                                                        {DateUtils.formatDate(payment.createdAt, "DD/MM/YYYY HH:mm")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-psi-dark text-sm">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/50">
                                                                {user.email}
                                                            </p>
                                                            {user.phone && (
                                                                <p className="text-xs text-psi-dark/50">
                                                                    {DocumentUtils.formatPhone(user.phone || "")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        {payment.type === "CRM_PRO" ? (
                                                            <div className="space-y-1">
                                                                <p className="font-medium text-psi-dark text-sm">
                                                                    Assinatura CRM Pro
                                                                </p>
                                                                {payment.Subscription && (
                                                                    <p className="text-xs text-psi-dark/50">
                                                                        {payment.Subscription.code}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1">
                                                                <p className="font-medium text-psi-dark text-sm">
                                                                    {payment.Event?.name || "Evento não encontrado"}
                                                                </p>
                                                                <p className="text-xs text-psi-dark/50">
                                                                    {payment.Event?.location || "Sem localização"}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-psi-dark text-sm">
                                                                {ValueUtils.centsToCurrency(payment.totalPaidByCustomer || payment.grossValue)}
                                                            </p>
                                                            {payment.creditCardInstallments && payment.creditCardInstallments > 1 && (
                                                                <p className="text-xs text-psi-dark/50">
                                                                    {payment.creditCardInstallments}x
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
                                                            onClick={() => toggleRow(payment.id)}
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
                                                                                {user.firstName} {user.lastName}
                                                                            </p>
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                {user.email}
                                                                            </p>
                                                                            {user.phone && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    {DocumentUtils.formatPhone(user.phone || "")}
                                                                                </p>
                                                                            )}
                                                                            {user.document && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    {DocumentUtils.formatCpf(user.document || "")}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {payment.type === "TICKET" && payment.Event && (
                                                                        <>
                                                                            <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                    <Building2 className="h-4 w-4 text-psi-primary" />
                                                                                    Organizador
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <p className="text-base font-medium text-psi-dark">
                                                                                        {payment.Event.Organizer.companyName}
                                                                                    </p>
                                                                                    <p className="text-sm text-psi-dark/70">
                                                                                        {DocumentUtils.formatCnpj(payment.Event.Organizer.companyDocument || "")}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                    <Ticket className="h-4 w-4 text-psi-primary" />
                                                                                    Evento
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <p className="text-base font-medium text-psi-dark">
                                                                                        {payment.Event.name}
                                                                                    </p>
                                                                                    {payment.Event.location && (
                                                                                        <p className="text-sm text-psi-dark/70">
                                                                                            {payment.Event.location}
                                                                                        </p>
                                                                                    )}
                                                                                    {payment.Event.isOnline && (
                                                                                        <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                                                                                            Online
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {payment.type === "CRM_PRO" && payment.Subscription && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Crown className="h-4 w-4 text-psi-primary" />
                                                                                Assinatura CRM Pro
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <p className="text-base font-medium text-psi-dark">
                                                                                    CRM Pro
                                                                                </p>
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Código: {payment.Subscription.code}
                                                                                </p>
                                                                                <Badge className={payment.Subscription.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : payment.Subscription.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-200" : payment.Subscription.status === "CANCELLED" ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                                    {payment.Subscription.status === "ACTIVE" ? "Ativa" : payment.Subscription.status === "PENDING" ? "Pendente" : payment.Subscription.status === "CANCELLED" ? "Cancelada" : payment.Subscription.status}
                                                                                </Badge>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <DollarSign className="h-4 w-4 text-psi-primary" />
                                                                                Valores
                                                                            </div>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setSelectedPaymentForValues(payment)
                                                                                    setIsUnderstandValuesDialogOpen(true)
                                                                                }}
                                                                                className="h-7 px-2 text-xs text-psi-primary hover:text-psi-primary/80 hover:bg-psi-primary/5"
                                                                            >
                                                                                <HelpCircle className="h-3.5 w-3.5 mr-1" />
                                                                                Entender valores
                                                                            </Button>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-sm text-psi-dark/70">Valor bruto:</span>
                                                                                <span className="text-sm font-medium text-psi-dark">
                                                                                    {ValueUtils.centsToCurrency(payment.grossValue)}
                                                                                </span>
                                                                            </div>
                                                                            {payment.discountedValue !== null && payment.discountedValue !== undefined && payment.discountedValue > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Desconto:</span>
                                                                                    <span className="text-sm font-medium text-emerald-600">
                                                                                        -{ValueUtils.centsToCurrency(payment.discountedValue)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.customerFee !== null && payment.customerFee !== undefined && payment.customerFee > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Taxa do cliente:</span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {ValueUtils.centsToCurrency(payment.customerFee)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.organizerFee !== null && payment.organizerFee !== undefined && payment.organizerFee > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Taxa do organizador:</span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {ValueUtils.centsToCurrency(payment.organizerFee)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.customerPaymentFee !== null && payment.customerPaymentFee !== undefined && payment.customerPaymentFee > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Taxa de pagamento do cliente:</span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {ValueUtils.centsToCurrency(payment.customerPaymentFee)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.platformPaymentFee !== null && payment.platformPaymentFee !== undefined && payment.platformPaymentFee > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Taxa da plataforma:</span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {ValueUtils.centsToCurrency(payment.platformPaymentFee)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.gatewayFeeGain !== null && payment.gatewayFeeGain !== undefined && payment.gatewayFeeGain > 0 && (
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="text-sm text-psi-dark/70">Ganho do gateway:</span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {ValueUtils.centsToCurrency(payment.gatewayFeeGain)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.organizerPayout !== null && payment.organizerPayout !== undefined && payment.organizerPayout > 0 && (
                                                                                <div className="flex justify-between items-center pt-2 border-t border-psi-dark/10">
                                                                                    <span className="text-sm font-medium text-psi-dark">Repasse organizador:</span>
                                                                                    <span className="text-sm font-medium text-emerald-600">
                                                                                        {ValueUtils.centsToCurrency(payment.organizerPayout)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {payment.netValue !== null && payment.netValue !== undefined && (
                                                                                <div className="flex justify-between items-center pt-2 border-t border-psi-dark/10">
                                                                                    <span className="text-sm font-medium text-psi-dark">Ganho líquido:</span>
                                                                                    <span className="text-sm font-medium text-emerald-600">
                                                                                        {ValueUtils.centsToCurrency(payment.netValue)}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex justify-between items-center pt-2 border-t border-psi-dark/10">
                                                                                <span className="text-sm font-medium text-psi-dark">Total pago pelo cliente:</span>
                                                                                <span className="text-base font-semibold text-psi-primary">
                                                                                    {ValueUtils.centsToCurrency(payment.totalPaidByCustomer || payment.grossValue)}
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
                                                                                Criado: {DateUtils.formatDate(payment.createdAt, "DD/MM/YYYY HH:mm")}
                                                                            </p>
                                                                            {payment.paidAt && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Pago: {DateUtils.formatDate(payment.paidAt, "DD/MM/YYYY HH:mm")}
                                                                                </p>
                                                                            )}
                                                                            {payment.updatedAt && (
                                                                                <p className="text-sm text-psi-dark/70">
                                                                                    Atualizado: {DateUtils.formatDate(payment.updatedAt, "DD/MM/YYYY HH:mm")}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {payment.couponInfo && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <FileText className="h-4 w-4 text-psi-primary" />
                                                                                Cupom de Desconto
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                {payment.couponInfo.couponCode && (
                                                                                    <div>
                                                                                        <span className="text-xs text-psi-dark/60">Código: </span>
                                                                                        <span className="text-sm font-medium text-psi-dark">
                                                                                            {payment.couponInfo.couponCode}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {payment.couponInfo.discountValue !== null && payment.couponInfo.discountValue !== undefined && (
                                                                                    <div>
                                                                                        <span className="text-xs text-psi-dark/60">Desconto aplicado: </span>
                                                                                        <span className="text-sm font-medium text-emerald-600">
                                                                                            {payment.couponInfo.discountType === "PERCENTAGE" 
                                                                                                ? `${payment.couponInfo.discountValue}%`
                                                                                                : ValueUtils.centsToCurrency(payment.couponInfo.discountValue)
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {payment.couponInfo.discountType && (
                                                                                    <div>
                                                                                        <span className="text-xs text-psi-dark/60">Tipo: </span>
                                                                                        <span className="text-sm font-medium text-psi-dark">
                                                                                            {payment.couponInfo.discountType === "PERCENTAGE" ? "Porcentagem" : "Valor fixo"}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
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
                                                                            <p className="text-xs text-psi-dark/60">Código: <span className="font-medium text-psi-dark text-sm">{payment.code}</span></p>
                                                                            <hr />
                                                                            {payment.externalPaymentId && (
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    ID: {payment.externalPaymentId}
                                                                                </p>
                                                                            )}
                                                                            {payment.invoiceNumber && (
                                                                                <div>
                                                                                    <span className="text-xs text-psi-dark/60">Número da fatura: </span>
                                                                                    <span className="text-sm font-medium text-psi-dark">
                                                                                        {payment.invoiceNumber}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex flex-col">
                                                                                {payment.invoiceUrl && (
                                                                                    <a
                                                                                        href={payment.invoiceUrl}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="inline-flex items-center gap-1 text-sm text-psi-primary hover:text-psi-primary/80"
                                                                                    >
                                                                                        Ver fatura
                                                                                        <ExternalLink className="h-3 w-3" />
                                                                                    </a>
                                                                                )}
                                                                                {payment.transactionReceiptUrl && (
                                                                                    <a
                                                                                        href={payment.transactionReceiptUrl}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="inline-flex items-center gap-1 text-sm text-psi-primary hover:text-psi-primary/80"
                                                                                    >
                                                                                        Ver comprovante
                                                                                        <ExternalLink className="h-3 w-3" />
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                            {payment.failedReason && (
                                                                                <div className="pt-2 border-t border-psi-dark/10">
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Motivo da falha:</p>
                                                                                    <p className="text-sm text-red-600">
                                                                                        {payment.failedReason}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            {payment.chargebackRequested && (
                                                                                <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">
                                                                                    Chargeback solicitado
                                                                                </Badge>
                                                                            )}
                                                                            {payment.additionalLogs && (
                                                                                <div className="pt-2 border-t border-psi-dark/10">
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">
                                                                                        Logs adicionais
                                                                                    </p>
                                                                                    <p className="text-sm text-psi-dark/70 wrap-break-word whitespace-pre-line">
                                                                                        {payment.additionalLogs}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {payment.Card && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                                                <CreditCard className="h-5 w-5 text-psi-primary" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-medium text-psi-dark">
                                                                                    Cartão de Crédito
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    Informações do cartão utilizado
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid gap-4
                                                                        md:grid-cols-2
                                                                        lg:grid-cols-4">
                                                                            <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                <p className="text-xs text-psi-dark/60 mb-1">Nome no cartão</p>
                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                    {payment.Card.name}
                                                                                </p>
                                                                            </div>
                                                                            <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                <p className="text-xs text-psi-dark/60 mb-1">Últimos 4 dígitos</p>
                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                    **** {payment.Card.last4}
                                                                                </p>
                                                                            </div>
                                                                            <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                <p className="text-xs text-psi-dark/60 mb-1">Bandeira</p>
                                                                                <div className="flex items-center gap-2">
                                                                                    <img
                                                                                        src={getCardBrandIcon(payment.Card.brand)}
                                                                                        alt={payment.Card.brand}
                                                                                        className="h-12 w-12 object-contain"
                                                                                    />
                                                                                    <p className="text-xs font-light text-psi-dark">
                                                                                        {payment.Card.brand}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                <p className="text-xs text-psi-dark/60 mb-1">Validade</p>
                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                    {payment.Card.expMonth}/{payment.Card.expYear}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {payment.Installments && payment.Installments.length > 0 && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                                                <CreditCard className="h-5 w-5 text-psi-primary" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-medium text-psi-dark">
                                                                                    Parcelas
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    {payment.Installments.length} {payment.Installments.length === 1 ? "parcela" : "parcelas"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            {payment.Installments.map((installment) => {
                                                                                const installmentStatus = installmentStatusConfig[installment.status]
                                                                                return (
                                                                                    <div key={installment.id} className="rounded-xl border border-psi-dark/10 bg-white/80 p-4">
                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                            <div className="flex items-center gap-3">
                                                                                                <Badge className={installmentStatus.badgeClass}>
                                                                                                    {installmentStatus.label}
                                                                                                </Badge>
                                                                                                <span className="text-sm font-medium text-psi-dark">
                                                                                                    Parcela {installment.installmentNumber} de {payment.creditCardInstallments}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="grid gap-3
                                                                                        md:grid-cols-3">
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Valor bruto</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {ValueUtils.centsToCurrency(installment.grossValue)}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Valor líquido</p>
                                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                                    {ValueUtils.centsToCurrency(installment.netValue)}
                                                                                                </p>
                                                                                            </div>
                                                                                            {installment.dueDate && (
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Vencimento</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {formatDate(installment.dueDate)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}
                                                                                            {installment.paidAt && (
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Pago em</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {formatDateTime(installment.paidAt)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}
                                                                                            {installment.receivedAt && (
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Recebido em</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {formatDateTime(installment.receivedAt)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}
                                                                                            {installment.estimatedCreditDate && (
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Data de crédito estimada</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {DateUtils.formatDate(installment.estimatedCreditDate)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}
                                                                                            {installment.externalPaymentId && (
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">ID externo</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {installment.externalPaymentId}
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {payment.type === "TICKET" && payment.Tickets && payment.Tickets.length > 0 && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                                                <Ticket className="h-5 w-5 text-psi-primary" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-medium text-psi-dark">
                                                                                    Ingressos
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    {payment.Tickets.length} {payment.Tickets.length === 1 ? "ingresso" : "ingressos"} vinculados
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            {payment.Tickets.map((ticket) => (
                                                                                <div key={ticket.id} className="rounded-xl border border-psi-dark/10 bg-white/80 p-4">
                                                                                    <div className="flex items-center justify-between mb-3">
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/80 mb-2">
                                                                                                {ticket.code}
                                                                                            </p>
                                                                                            <p className="text-sm font-medium text-psi-dark">
                                                                                                <span className="text-psi-dark/60">Tipo: </span>{ticket.TicketType?.name || "Ingresso sem tipo"}
                                                                                            </p>
                                                                                            {ticket.TicketType?.description && (
                                                                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                                                                    {ticket.TicketType.description}
                                                                                                </p>
                                                                                            )}
                                                                                            {ticket.code && (
                                                                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                                                                    Código: <span className="font-mono font-medium text-psi-dark">{ticket.code}</span>
                                                                                                </p>
                                                                                            )}
                                                                                            {ticket.price && (
                                                                                                <div className="flex gap-1">
                                                                                                    <p className="text-xs text-psi-dark/60">Valor:</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {ValueUtils.centsToCurrency(ticket.price)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="flex flex-col gap-2">
                                                                                            <Badge className={ticketStatusConfig[ticket.status]?.badgeClass || "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                                                {ticketStatusConfig[ticket.status]?.label || ticket.status}
                                                                                            </Badge>
                                                                                            {ticket.cancelledBy && (
                                                                                                <Badge className={ticketCancelledByConfig[ticket.cancelledBy]?.badgeClass || "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                                                    {ticketCancelledByConfig[ticket.cancelledBy]?.label || ticket.cancelledBy}
                                                                                                </Badge>
                                                                                            )}
                                                                                            {ticket.cancelledAt && (
                                                                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                                                                    Cancelado em: {formatDateTime(ticket.cancelledAt)}
                                                                                                </p>
                                                                                            )}
                                                                                            {payment.Tickets && payment.Tickets.length > 1 && 
                                                                                             ["CONFIRMED", "RECEIVED"].includes(payment.status) && 
                                                                                             !ticket.cancelledBy && (
                                                                                                <Button
                                                                                                    variant="destructive"
                                                                                                    size="sm"
                                                                                                    onClick={() => handleOpenRefundTicketDialog(payment, ticket)}
                                                                                                    className="mt-2"
                                                                                                >
                                                                                                    Estornar ingresso
                                                                                                </Button>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    {(ticket.refundStatus || ticket.refundedAt || ticket.refundReason) && (
                                                                                        <div className="mt-3 pt-3 border-t border-psi-dark/10 space-y-2">
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
                                                                                                {ticket.refundedBy && (
                                                                                                    <div>
                                                                                                        <p className="text-xs text-psi-dark/60 mb-1">Solicitado por</p>
                                                                                                        <p className="text-xs font-medium text-psi-dark font-mono">
                                                                                                            {ticket.refundedBy}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )}
                                                                                                {ticket.refundedAt && (
                                                                                                    <div>
                                                                                                        <p className="text-xs text-psi-dark/60 mb-1">Concluído em</p>
                                                                                                        <p className="text-xs font-medium text-psi-dark">
                                                                                                            {formatDateTime(ticket.refundedAt)}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )}
                                                                                                {ticket.refundEndToEndIndentifier && (
                                                                                                    <div>
                                                                                                        <p className="text-xs text-psi-dark/60 mb-1">ID de end to end</p>
                                                                                                        <p className="text-xs font-medium text-psi-dark">
                                                                                                            {ticket.refundEndToEndIndentifier}
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
                                                                                                    <a
                                                                                                        href={ticket.refundReceiptUrl}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="inline-flex items-center gap-1 text-xs text-psi-primary hover:text-psi-primary/80"
                                                                                                    >
                                                                                                        Ver recibo do reembolso
                                                                                                        <ExternalLink className="h-3 w-3" />
                                                                                                    </a>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    {ticket.TicketDates && ticket.TicketDates.length > 0 && (
                                                                                        <div className="space-y-2 pt-3 border-t border-psi-dark/10">
                                                                                            <p className="text-xs font-medium text-psi-dark/60 uppercase tracking-wide">Datas do evento:</p>
                                                                                            {ticket.TicketDates.map((ticketDate) => (
                                                                                                <div key={ticketDate.id} className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                                                                    <Calendar className="h-3 w-3" />
                                                                                                    <span>
                                                                                                        {formatDate(ticketDate.EventDate.date)} - {ticketDate.EventDate.hourStart} às {ticketDate.EventDate.hourEnd}
                                                                                                    </span>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {payment.qrcodeData && payment.method === "PIX" && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                                                <FileText className="h-5 w-5 text-psi-primary" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-medium text-psi-dark">
                                                                                    Dados PIX
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    Informações do QR Code PIX
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        {payment.qrcodeData.expirationDate && (
                                                                            <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                <p className="text-xs text-psi-dark/60 mb-1">Data de expiração</p>
                                                                                <p className="text-sm font-medium text-psi-dark">
                                                                                    {formatDateTime(payment.qrcodeData.expirationDate)}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {(payment.status === "REFUND_REQUESTED" || payment.status === "REFUNDED" || payment.refundStatus || payment.refundReason || payment.refundedBy) && 
                                                                 (payment.type === "CRM_PRO" || !payment.Tickets?.some(ticket => ticket.refundStatus !== null && ticket.refundStatus !== undefined)) && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                                                <AlertTriangle className="h-5 w-5 text-purple-600" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-medium text-psi-dark">
                                                                                    Informações de Reembolso
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    Detalhes sobre o pedido de estorno
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid gap-4
                                                                        md:grid-cols-2">
                                                                            {payment.refundStatus && (
                                                                                <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                    <p className="text-xs text-psi-dark/60 mb-2">Status do reembolso</p>
                                                                                    <Badge className={refundStatusConfig[payment.refundStatus]?.badgeClass || "bg-gray-50 text-gray-600 border-gray-200"}>
                                                                                        {refundStatusConfig[payment.refundStatus]?.label || payment.refundStatus}
                                                                                    </Badge>
                                                                                </div>
                                                                            )}
                                                                            {payment.refundedBy && (
                                                                                <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Solicitado por</p>
                                                                                    <p className="text-sm font-medium text-psi-dark font-mono">
                                                                                        {payment.refundedBy}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            {payment.refundedAt && (
                                                                                <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Concluído em</p>
                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                        {formatDateTime(payment.refundedAt)}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            {payment.refundReason && (
                                                                                <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3
                                                                                md:col-span-2">
                                                                                    <p className="text-xs text-psi-dark/60 mb-2">Motivo do reembolso</p>
                                                                                    <p className="text-sm text-psi-dark/70 whitespace-pre-line">
                                                                                        {payment.refundReason}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            {payment.refundEndToEndIdentifier && (
                                                                                <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">ID de end to end</p>
                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                        {payment.refundEndToEndIdentifier}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                            {payment.refundReceiptUrl && payment.Tickets?.every(ticket => ticket.refundStatus === null) && (
                                                                                <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-3">
                                                                                    <p className="text-xs text-psi-dark/60 mb-1">URL do recibo</p>
                                                                                    <a href={payment.refundReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-psi-primary hover:text-psi-primary/80">
                                                                                        Ver recibo
                                                                                    </a>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="flex items-center justify-end gap-2">
                                                                    {
                                                                        ["CONFIRMED", "RECEIVED"].includes(payment.status) && (
                                                                            <Button 
                                                                                variant="destructive" 
                                                                                size="sm" 
                                                                                onClick={() => handleOpenRefundDialog(payment)} 
                                                                                disabled={isRefundingPayment || payment.status === "REFUNDED"}
                                                                            >
                                                                                Estornar pagamento
                                                                            </Button>
                                                                        )
                                                                    }
                                                                    {payment.type === "TICKET" && (
                                                                        <Button variant="primary" size="lg" disabled>
                                                                            Solicitar nota fiscal
                                                                        </Button>
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

            <Dialog open={refundDialogOpen} onOpenChange={handleCloseRefundDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            Confirmar Estorno de Pagamento
                        </DialogTitle>
                        <DialogDescription className="pt-2 space-y-2">
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-sm font-medium text-amber-900 mb-1">
                                    ⚠️ Atenção: Esta ação é delicada e irreversível
                                </p>
                                <p className="text-xs text-amber-800">
                                    O estorno de um pagamento pode resultar em perda de receita, problemas com o cliente e impactos financeiros significativos. Certifique-se de que esta ação é realmente necessária antes de prosseguir.
                                </p>
                            </div>
                            {selectedPaymentForRefund && (
                                <div className="pt-2 space-y-1">
                                    <p className="text-sm text-psi-dark/70">
                                        <span className="font-medium">Pagamento:</span> {selectedPaymentForRefund.code}
                                    </p>
                                    <p className="text-sm text-psi-dark/70">
                                        <span className="font-medium">Valor:</span> {ValueUtils.centsToCurrency(selectedPaymentForRefund.grossValue)}
                                    </p>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Senha do Administrador *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={adminPassword}
                                    onChange={(e) => {
                                        setAdminPassword(e.target.value)
                                        if (passwordError) setPasswordError(null)
                                    }}
                                    placeholder="Digite a senha do administrador"
                                    icon={Lock}
                                    className="pr-10"
                                    required
                                    disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-psi-dark/60 hover:text-psi-dark transition-colors"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                Motivo do Estorno (Opcional)
                            </label>
                            <Textarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                placeholder="Descreva o motivo do estorno..."
                                className="min-h-[100px]"
                                maxLength={500}
                                disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                            />
                            <p className="text-xs text-psi-dark/50 mt-1">
                                {refundReason.length}/500 caracteres
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseRefundDialog}
                            disabled={isCheckingPassword || isRefundingPayment}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmRefund}
                            disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard || !adminPassword.trim()}
                        >
                            {isCheckingPassword || isRefundingPayment || isRefundingCreditCard ? (
                                <LoadingButton />
                            ) : (
                                "Confirmar Estorno"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={refundTicketDialogOpen} onOpenChange={handleCloseRefundTicketDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            Confirmar Estorno de Ingresso
                        </DialogTitle>
                        <DialogDescription className="pt-2 space-y-2">
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-sm font-medium text-amber-900 mb-1">
                                    ⚠️ Atenção: Esta ação é delicada e irreversível
                                </p>
                                <p className="text-xs text-amber-800">
                                    O estorno de um ingresso específico estornará apenas o valor deste ingresso. Certifique-se de que esta ação é realmente necessária antes de prosseguir.
                                </p>
                            </div>
                            {selectedTicketForRefund && (
                                <div className="pt-2 space-y-1">
                                    <p className="text-sm text-psi-dark/70">
                                        <span className="font-medium">Pagamento:</span> {selectedTicketForRefund.payment.code}
                                    </p>
                                    <p className="text-sm text-psi-dark/70">
                                        <span className="font-medium">Ingresso:</span> {selectedTicketForRefund.ticket.code}
                                    </p>
                                    <p className="text-sm text-psi-dark/70">
                                        <span className="font-medium">Valor do ingresso:</span> {ValueUtils.centsToCurrency(selectedTicketForRefund.ticket.price || 0)}
                                    </p>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Senha do Administrador *
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={adminPassword}
                                    onChange={(e) => {
                                        setAdminPassword(e.target.value)
                                        if (passwordError) setPasswordError(null)
                                    }}
                                    placeholder="Digite a senha do administrador"
                                    icon={Lock}
                                    className="pr-10"
                                    required
                                    disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-psi-dark/60 hover:text-psi-dark transition-colors"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                Motivo do Estorno (Opcional)
                            </label>
                            <Textarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                placeholder="Descreva o motivo do estorno..."
                                className="min-h-[100px]"
                                maxLength={500}
                                disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                            />
                            <p className="text-xs text-psi-dark/50 mt-1">
                                {refundReason.length}/500 caracteres
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseRefundTicketDialog}
                            disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmRefundTicket}
                            disabled={isCheckingPassword || isRefundingPayment || isRefundingCreditCard || !adminPassword.trim()}
                        >
                            {isCheckingPassword || isRefundingPayment || isRefundingCreditCard ? (
                                <LoadingButton />
                            ) : (
                                "Confirmar Estorno"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogUnderstandValues
                open={isUnderstandValuesDialogOpen}
                onOpenChange={(open) => {
                    setIsUnderstandValuesDialogOpen(open)
                    if (!open) {
                        setSelectedPaymentForValues(null)
                    }
                }}
                payment={selectedPaymentForValues}
            />
        </Background>
    )
}

export {
    AdmPagamentosPannel
}
