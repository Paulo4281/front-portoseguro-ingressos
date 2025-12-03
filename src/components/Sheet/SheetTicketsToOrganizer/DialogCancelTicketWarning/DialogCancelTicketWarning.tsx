"use client"

import { useState } from "react"
import { AlertTriangle, XCircle, Ban } from "lucide-react"
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
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import type { TTicketToOrganizer } from "@/types/Ticket/TTicket"

type TDialogCancelTicketWarningProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    ticket: TTicketToOrganizer
}

const DialogCancelTicketWarning = ({
    open,
    onOpenChange,
    onConfirm,
    ticket
}: TDialogCancelTicketWarningProps) => {
    const [confirmationText, setConfirmationText] = useState("")
    const isConfirmed = confirmationText.trim().toLowerCase() === "cancelar"

    const handleConfirm = () => {
        if (isConfirmed) {
            onConfirm()
            setConfirmationText("")
            onOpenChange(false)
        }
    }

    const handleCancel = () => {
        setConfirmationText("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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

                    <div className="pt-4 border-t border-psi-dark/10">
                        <label className="block text-sm font-medium text-psi-dark mb-2">
                            Para prosseguir, digite <strong>"Cancelar"</strong> abaixo:
                        </label>
                        <Input
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="Digite 'Cancelar' para confirmar"
                            icon={Ban}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Voltar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!isConfirmed}
                    >
                        Desejo prosseguir mesmo assim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogCancelTicketWarning
}

