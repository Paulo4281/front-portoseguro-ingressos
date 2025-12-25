"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useWalletCurrent } from "@/hooks/Wallet/useWalletCurrent"
import { useWalletHistory } from "@/hooks/Wallet/useWalletHistory"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { ArrowUp, ArrowDown, Eye, EyeOff, Info } from "lucide-react"
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

const CarteiraPannel = () => {
    const { data: walletData, isLoading: walletLoading } = useWalletCurrent()
    const { data: historyData, isLoading: historyLoading } = useWalletHistory()
    const { user } = useAuthStore()
    const [isBalanceVisible, setIsBalanceVisible] = useState(false)
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)

    const balance = useMemo(() => {
        return walletData?.data?.value ?? 0
    }, [walletData])

    const history = useMemo(() => {
        return historyData?.data ?? []
    }, [historyData])

    const organizer = useMemo(() => {
        return user?.Organizer || null
    }, [user])

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
                <div className="
                lg:flex lg:items-start lg:justify-between
                ">
                    <div className="text-start">
                        <div className="text-xs text-psi-dark/60">Disponível</div>
                        <div className="mt-1 text-4xl lg:text-5xl font-extrabold text-psi-primary">
                            {walletLoading ? "—" : isBalanceVisible ? ValueUtils.centsToCurrency(balance) : "••••••"}
                        </div>
                        <hr className="my-4" />
                        <div className="mt-4">
                            <Button 
                                variant="primary" 
                                disabled={walletLoading || balance <= 0}
                                onClick={() => setIsWithdrawDialogOpen(true)}
                            >
                                Sacar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-psi-dark">Histórico</h3>
                    <p className="text-sm text-psi-dark/60">Últimas transações</p>
                </div>

                {historyLoading ? (
                    <p className="text-sm text-psi-dark/60">Carregando histórico...</p>
                ) : history.length === 0 ? (
                    <p className="text-sm text-psi-dark/60">Nenhuma transação encontrada.</p>
                ) : (
                    <ul className="space-y-3">
                        {history.map((item, idx) => {
                            const isReceived = item.type === "RECEIVED"
                            const sign = isReceived ? "+" : "-"
                            const colorClass = isReceived ? "text-emerald-600" : "text-destructive"
                            const formattedDate = DateUtils.formatDate(item.date)

                            return (
                                <li key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[#F0F1F6] bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-md bg-psi-primary/10 ${isReceived ? "text-emerald-600" : "text-destructive"}`}>
                                            {isReceived ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-psi-dark">{isReceived ? "Recebimento" : "Saque"}</div>
                                            {
                                                item.eventName && (
                                                    <div className="text-sm text-gray-600">{item.eventName}</div>
                                                )
                                            }
                                            <div className="text-xs text-psi-dark/60">{formattedDate}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-sm font-medium ${colorClass}`}>
                                            {isBalanceVisible ? `${sign} ${ValueUtils.centsToCurrency(item.value)}` : "••••"}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
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
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                disabled={!organizer?.payoutMethod || balance <= 0}
                            >
                                Confirmar Saque
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        </Background>
    )
}

export {
    CarteiraPannel
}