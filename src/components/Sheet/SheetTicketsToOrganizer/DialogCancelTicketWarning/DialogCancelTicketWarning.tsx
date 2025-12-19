"use client"

import { useState } from "react"
import { AlertTriangle, XCircle, Ban, FileText, Lock, Eye, EyeOff } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { Textarea } from "@/components/ui/textarea"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { useUserCheckPassword } from "@/hooks/User/useUserCheckPassword"
import { Toast } from "@/components/Toast/Toast"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import type { TTicketToOrganizer } from "@/types/Ticket/TTicket"

type TDialogCancelTicketWarningProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (reason: string) => Promise<void>
    ticket: TTicketToOrganizer
}

const DialogCancelTicketWarning = ({
    open,
    onOpenChange,
    onConfirm,
    ticket
}: TDialogCancelTicketWarningProps) => {
    const [confirmationText, setConfirmationText] = useState("")
    const [reason, setReason] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const { mutateAsync: checkPassword, isPending: isCheckingPassword } = useUserCheckPassword()
    
    const isConfirmed = confirmationText.trim().toLowerCase() === "cancelar"
    const isReasonValid = reason.trim().length > 0 && reason.trim().length <= 600
    const isPasswordValid = password.trim().length > 0

    const handleConfirm = async () => {
        if (!isConfirmed || !isReasonValid || !isPasswordValid) {
            return
        }

        try {
            const response = await checkPassword(password)
            
            if (response?.success === true) {
                setPasswordError(null)
                await onConfirm(reason.trim())
                setConfirmationText("")
                setReason("")
                setPassword("")
                onOpenChange(false)
            } else {
                setPasswordError("Senha incorreta. Tente novamente.")
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Senha incorreta. Tente novamente."
            setPasswordError(errorMessage)
            Toast.error(errorMessage)
        }
    }

    const handleCancel = () => {
        setConfirmationText("")
        setReason("")
        setPassword("")
        setPasswordError(null)
        onOpenChange(false)
    }

    const handleOpenChangeWrapper = (newOpen: boolean) => {
        if (!newOpen) {
            setConfirmationText("")
            setReason("")
            setPassword("")
            setPasswordError(null)
        }
        onOpenChange(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-5 w-5" />
                        ATENÇÃO: Cancelar Ingresso
                    </DialogTitle>
                    <DialogDescription>
                        Esta é uma ação delicada que requer máxima atenção
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-base font-bold text-destructive mb-2">
                            ⚠️ CANCELAR UM INGRESSO É UMA ATITUDE MUITO DELICADA
                        </p>
                        <p className="text-sm text-psi-dark">
                            Cancelar o ingresso de um cliente é uma ação que pode causar <strong>diversas consequências negativas</strong> para sua organização, incluindo:
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm font-semibold text-red-900 mb-2">
                                Consequências Imediatas:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 ml-2">
                                <li>Perda de credibilidade e confiança do cliente</li>
                                <li>Danos à reputação da sua organização</li>
                                <li>Impacto negativo na imagem da marca</li>
                                <li>Possíveis reclamações ou ações legais</li>
                            </ul>
                        </div>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <p className="text-sm font-semibold text-amber-900 mb-2">
                                Consequências Financeiras:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800 ml-2">
                                <li>Reembolso automático de <strong>{ValueUtils.centsToCurrency(ticket.price)}</strong> ao cliente</li>
                                <li>Perda de receita já arrecadada</li>
                                <li>Possíveis custos com taxas de transação</li>
                                <li>Impacto negativo em eventos futuros</li>
                            </ul>
                        </div>

                        <div className="rounded-xl border-2 border-destructive bg-destructive/5 p-4">
                            <p className="text-sm font-bold text-destructive mb-2">
                                IMPORTANTE - Informações do Cliente:
                            </p>
                            <div className="space-y-1 text-sm text-psi-dark">
                                <p><strong>Cliente:</strong> {ticket.customer.name}</p>
                                <p><strong>E-mail:</strong> {ticket.customer.email}</p>
                                {ticket.customer.phone && (
                                    <p><strong>Telefone:</strong> {ticket.customer.phone}</p>
                                )}
                                <p><strong>Valor a ser reembolsado:</strong> {ValueUtils.centsToCurrency(ticket.price)}</p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                            <p className="text-sm font-semibold text-psi-dark mb-1">
                                Alternativas Recomendadas:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-psi-dark/70 ml-2">
                                <li>Entre em contato com o cliente antes de cancelar</li>
                                <li>Considere oferecer alternativas (troca de data, crédito, etc.)</li>
                                <li>Avalie todas as opções antes de tomar esta decisão</li>
                                <li>Lembre-se que esta ação pode "manchar" sua reputação</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-psi-dark/10 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Motivo do cancelamento e reembolso <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Textarea
                                    value={reason}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (value.length <= 600) {
                                            setReason(value)
                                        }
                                    }}
                                    placeholder="Descreva o motivo pelo qual está cancelando este ingresso e solicitando o reembolso..."
                                    className="min-h-[100px] pr-12"
                                    required
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-psi-dark/50">
                                    {reason.length}/600
                                </div>
                            </div>
                            {reason.trim().length === 0 && (
                                <p className="mt-1 text-xs text-destructive">O motivo é obrigatório</p>
                            )}
                            {reason.trim().length > 600 && (
                                <p className="mt-1 text-xs text-destructive">O motivo deve ter no máximo 600 caracteres</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Para prosseguir, digite <strong>"Cancelar"</strong> abaixo:
                            </label>
                            <Input
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                placeholder="Digite 'Cancelar' para confirmar"
                                icon={Ban}
                                disabled={isCheckingPassword}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Senha <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (passwordError) setPasswordError(null)
                                    }}
                                    placeholder="Digite sua senha"
                                    icon={Lock}
                                    className="pr-10"
                                    required
                                    disabled={isCheckingPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-psi-dark/60 hover:text-psi-dark transition-colors"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    disabled={isCheckingPassword}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="mt-1 text-xs text-destructive">{passwordError}</p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isCheckingPassword}
                    >
                        Voltar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!isConfirmed || !isReasonValid || !isPasswordValid || isCheckingPassword}
                    >
                        {isCheckingPassword ? (
                            <LoadingButton />
                        ) : (
                            "Desejo prosseguir mesmo assim"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogCancelTicketWarning
}

