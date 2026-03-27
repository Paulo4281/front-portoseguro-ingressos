"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useBalanceCurrent } from "@/hooks/Balance/useBalanceCurrent"
import { usePayoutList } from "@/hooks/Payout/usePayoutList"
import { usePayoutWithdraw } from "@/hooks/Payout/usePayoutWithdraw"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { ArrowUp, ArrowDown, Eye, EyeOff, Info, Loader2, ExternalLink, Clock, CreditCard } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Toast } from "@/components/Toast/Toast"
import { DialogPasswordConfirmation } from "@/components/Dialog/DialogPasswordConfirmation/DialogPasswordConfirmation"
import type { TBalancePendingEntry } from "@/types/Balance/TBalance"

const CarteiraPannel = () => {
    const { data: balanceData, isLoading: balanceLoading, refetch: refetchBalance } = useBalanceCurrent()
    const { data: payoutListData, isLoading: payoutListLoading, refetch: refetchPayoutList } = usePayoutList()
    const { mutateAsync: withdrawPayout, isPending: isWithdrawing } = usePayoutWithdraw()
    const { user } = useAuthStore()
    const [isBalanceVisible, setIsBalanceVisible] = useState(false)
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
    const [balanceTab, setBalanceTab] = useState<"history" | "pending">("history")

    const balance = useMemo(() => {
        return balanceData?.data?.currentValue ?? 0
    }, [balanceData])

    const pendingValue = useMemo(() => {
        return balanceData?.data?.pendingValue ?? 0
    }, [balanceData])

    const balanceList = useMemo(() => {
        return balanceData?.data?.balances ?? []
    }, [balanceData])

    const payoutList = useMemo(() => {
        return payoutListData?.data ?? []
    }, [payoutListData])

    const organizer = useMemo(() => {
        return user?.Organizer || null
    }, [user])

    /** Agrupa pendingBalances por externalInstallmentId (= uma compra/parcelamento) e ordena pela data estimada mais próxima */
    const pendingGroups = useMemo(() => {
        const raw: TBalancePendingEntry[] = balanceData?.data?.pendingBalances ?? []
        const map = new Map<string, TBalancePendingEntry[]>()
        for (const entry of raw) {
            const key = entry.externalInstallmentId
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(entry)
        }
        return [...map.entries()]
            .map(([, items]) => ({
                items: [...items].sort((a, b) => a.installmentNumber - b.installmentNumber),
                firstEstimatedDate: items.reduce(
                    (min, e) => (e.estimatedCreditDate < min ? e.estimatedCreditDate : min),
                    items[0].estimatedCreditDate
                ),
                totalValue: items.reduce((sum, e) => sum + e.value, 0),
                eventName: items[0].eventName,
                method: items[0].method,
                totalInstallments: items[0].totalInstallments,
            }))
            .sort((a, b) => a.firstEstimatedDate.localeCompare(b.firstEstimatedDate))
    }, [balanceData])

    const getAccountTypeLabel = (type: string | null) => {
        if (type === "CONTA_CORRENTE") return "Conta Corrente"
        if (type === "CONTA_POUPANCA") return "Conta Poupança"
        return type || "—"
    }

    const getPixTypeLabel = (type: string | null) => {
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
        <Background variant="hero" className="min-h-screen">
        <div className="space-y-6 container mt-[80px]">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold text-psi-primary
                            sm:text-4xl">Carteira</h1>
                            <p className="text-sm text-psi-dark/60">Saldo disponível para saque e movimentações</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                            className="shrink-0"
                            aria-label={isBalanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
                        >
                            {isBalanceVisible ? (
                                <EyeOff className="h-5 w-5 text-psi-dark/60" />
                            ) : (
                                <Eye className="h-5 w-5 text-psi-dark/60" />
                            )}
                        </Button>
                    </div>
            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="text-start">
                        <div className="text-xs text-psi-dark/60">Disponível</div>
                        <div className="mt-1 text-4xl lg:text-5xl font-extrabold text-psi-primary">
                            {balanceLoading ? "—" : isBalanceVisible ? ValueUtils.centsToCurrency(balance) : "••••••"}
                        </div>
                        <hr className="my-4" />
                        <Button
                            variant="primary"
                            disabled={balanceLoading || balance <= 0}
                            onClick={() => setIsWithdrawDialogOpen(true)}
                        >
                            Sacar
                        </Button>
                    </div>
                    {pendingValue > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-start">
                            <div className="flex items-center gap-1.5 text-xs text-amber-700 mb-1">
                                <Clock className="h-3.5 w-3.5" />
                                A receber
                            </div>
                            <div className="text-2xl font-bold text-amber-700">
                                {isBalanceVisible ? ValueUtils.centsToCurrency(pendingValue) : "••••••"}
                            </div>
                            <div className="text-xs text-amber-600 mt-1">Aguardando liquidação</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex rounded-lg border border-[#E4E6F0] p-0.5 bg-psi-dark/5">
                        <button
                            type="button"
                            onClick={() => setBalanceTab("history")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${balanceTab === "history" ? "bg-white text-psi-dark shadow-sm" : "text-psi-dark/70 hover:text-psi-dark"}`}
                        >
                            Histórico
                        </button>
                        <button
                            type="button"
                            onClick={() => setBalanceTab("pending")}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${balanceTab === "pending" ? "bg-white text-psi-dark shadow-sm" : "text-psi-dark/70 hover:text-psi-dark"}`}
                        >
                            A receber
                        </button>
                    </div>
                    {balanceTab === "history" && <p className="text-sm text-psi-dark/60">Últimas transações</p>}
                    {balanceTab === "pending" && pendingGroups.length > 0 && (
                        <p className="text-sm text-psi-dark/60">
                            {isBalanceVisible ? ValueUtils.centsToCurrency(pendingValue) : "••••••"} aguardando liquidação
                        </p>
                    )}
                </div>

                {balanceTab === "history" && (
                    <>
                        {payoutListLoading ? (
                            <p className="text-sm text-psi-dark/60">Carregando histórico...</p>
                        ) : payoutList.length === 0 && balanceList.length === 0 ? (
                            <p className="text-sm text-psi-dark/60">Nenhuma transação encontrada.</p>
                        ) : (
                            <ul className="space-y-3">
                                {payoutList.map((item, idx) => {
                                    const isPaid = item.status === "PAID"
                                    const isFailed = item.status === "FAILED"
                                    const isProcessing = item.status === "PROCESSING"
                                    const colorClass = isFailed ? "text-red-600" : isPaid ? "text-red-600" : "text-amber-600"
                                    const borderClass = isFailed ? "border-red-200 bg-red-50/50" : "border-[#F0F1F6] bg-white"
                                    const formattedDate = DateUtils.formatDate(item.createdAt)
                                    const formattedPaidDate = item.paidAt ? DateUtils.formatDate(item.paidAt) : null

                                    return (
                                        <li key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${borderClass}`}>
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className={`p-2 rounded-md ${isFailed ? "bg-red-100" : "bg-psi-primary/10"} ${colorClass}`}>
                                                    <ArrowDown className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium text-psi-dark">Saque</div>
                                                        {isFailed && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                                                Falhou
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-psi-dark/60">
                                                        {formattedDate}
                                                        {formattedPaidDate && ` • Pago em ${formattedPaidDate}`}
                                                    </div>
                                                    {isProcessing && (
                                                        <div className="text-xs text-amber-600 font-medium mt-1">Processando</div>
                                                    )}
                                                    {isFailed && item.failReason && (
                                                        <div className="mt-2 p-2 rounded-md bg-red-50 border border-red-100">
                                                            <p className="text-xs font-medium text-red-800 mb-1">Motivo da falha:</p>
                                                            <p className="text-xs text-red-700">{item.failReason}</p>
                                                        </div>
                                                    )}
                                                    {item.transactionReceiptUrl && (
                                                        <div className="mt-2">
                                                            <a
                                                                href={item.transactionReceiptUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs text-psi-primary hover:text-psi-primary/80 font-medium"
                                                            >
                                                                Ver comprovante
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${colorClass}`}>
                                                    {isBalanceVisible ? `- ${ValueUtils.centsToCurrency(item.value)}` : "••••"}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                                {balanceList.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[#F0F1F6] bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-psi-primary/10 text-emerald-600">
                                                <ArrowUp className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-psi-dark">Liberado</div>
                                                <div className="text-xs text-psi-dark/60">
                                                    {DateUtils.formatDate(item.createdAt)} • {item.description}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-emerald-600">
                                                {isBalanceVisible ? ValueUtils.centsToCurrency(item.value) : "••••"}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}

                {balanceTab === "pending" && (
                    <>
                        {balanceLoading ? (
                            <p className="text-sm text-psi-dark/60">Carregando...</p>
                        ) : pendingGroups.length === 0 ? (
                            <p className="text-sm text-psi-dark/60">Nenhum valor a receber no momento.</p>
                        ) : (
                            <ul className="space-y-3">
                                {pendingGroups.map((group, idx) => {
                                    const isInstallment = group.totalInstallments > 1
                                    return (
                                        <li key={idx} className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-md bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                                                        <Clock className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-psi-dark">{group.eventName}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-psi-dark/60">
                                                            <CreditCard className="h-3.5 w-3.5" />
                                                            {group.method === "CREDIT_CARD" ? "Cartão de crédito" : group.method}
                                                            {isInstallment && (
                                                                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                                                    {group.totalInstallments}x
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-semibold text-amber-700">
                                                        {isBalanceVisible ? ValueUtils.centsToCurrency(group.totalValue) : "••••"}
                                                    </p>
                                                    {isInstallment && (
                                                        <p className="text-xs text-psi-dark/50">total</p>
                                                    )}
                                                </div>
                                            </div>

                                            {isInstallment ? (
                                                <div className="space-y-1.5 pt-1 border-t border-amber-200/50">
                                                    {group.items.map((entry) => (
                                                        <div key={entry.installmentNumber} className="flex items-center justify-between text-xs">
                                                            <span className="text-psi-dark/70">
                                                                Parcela {entry.installmentNumber}/{entry.totalInstallments}
                                                                <span className="ml-2 text-psi-dark/50">
                                                                    Previsão: {DateUtils.formatDate(entry.estimatedCreditDate)}
                                                                </span>
                                                            </span>
                                                            <span className="font-medium text-amber-700">
                                                                {isBalanceVisible ? ValueUtils.centsToCurrency(entry.value) : "••••"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-psi-dark/60 flex items-center gap-1">
                                                    <Clock className="h-3 w-3 shrink-0" />
                                                    Previsão de crédito: {DateUtils.formatDate(group.items[0].estimatedCreditDate)}
                                                </div>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </>
                )}
            </div>

            <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Solicitar Saque</DialogTitle>
                        <DialogDescription>
                            Confira as informações abaixo antes de confirmar o saque
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                            <div className="text-sm text-psi-dark/60 mb-1">Valor disponível para saque</div>
                            <div className="text-3xl font-semibold text-psi-primary">
                                {ValueUtils.centsToCurrency(balance)}
                            </div>
                        </div>

                        {organizer?.payoutMethod === "BANK_ACCOUNT" && (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-3">
                                    <h3 className="text-lg font-medium text-psi-dark">Conta Bancária</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Banco</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {organizer.Bank?.name || "—"}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Tipo de Conta</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {getAccountTypeLabel(organizer.bankAccountType)}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Agência</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {organizer.bankAccountAgency || "—"}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Conta</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {organizer.bankAccountNumber ? `${organizer.bankAccountNumber}-${organizer.bankAccountDigit || ""}` : "—"}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Nome da Conta</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {organizer.bankAccountName || "—"}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Titular</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {organizer.bankAccountOwnerName || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-900 mb-1">
                                                Taxa e Prazo
                                            </p>
                                            <p className="text-sm text-amber-700">
                                                A taxa para transferência bancária é de <strong>R$ 5,00</strong> e o valor leva até <strong>3 dias úteis</strong> para cair na conta.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {organizer?.payoutMethod === "PIX" && (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-3">
                                    <h3 className="text-lg font-medium text-psi-dark">Chave PIX</h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Tipo de Chave</div>
                                            <div className="text-sm font-medium text-psi-dark">
                                                {getPixTypeLabel(organizer.pixAddressType)}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Chave PIX</div>
                                            <div className="text-sm font-medium text-psi-dark break-all">
                                                {organizer.pixAddressKey || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900 mb-1">
                                                Taxa e Prazo
                                            </p>
                                            <p className="text-sm text-emerald-700">
                                                A taxa para transferência via PIX é de <strong>R$ 2,00</strong> e o pagamento é <strong>instantâneo</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!organizer?.payoutMethod && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-700">
                                        Nenhum método de pagamento configurado. Configure uma conta bancária ou chave PIX no seu perfil para realizar saques.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setIsWithdrawDialogOpen(false)}
                                disabled={isWithdrawing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                disabled={!organizer?.payoutMethod || balance <= 0 || isWithdrawing}
                                onClick={() => {
                                    setIsWithdrawDialogOpen(false)
                                    setIsPasswordDialogOpen(true)
                                }}
                            >
                                Confirmar Saque
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogPasswordConfirmation
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
                onConfirm={async () => {
                    try {
                        await withdrawPayout()
                        Toast.success("Saque solicitado com sucesso!")
                        setIsPasswordDialogOpen(false)
                        refetchBalance()
                        refetchPayoutList()
                    } catch (error) {
                        Toast.error("Erro ao solicitar saque")
                    }
                }}
                title="Confirmação de Segurança"
                description="Por motivos de segurança, digite sua senha para confirmar o saque."
            />
        </div>
        </Background>
    )
}

export {
    CarteiraPannel
}