"use client"

import { AlertTriangle, XCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { TEvent } from "@/types/Event/TEvent"
import { formatEventDate, formatEventTime } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"

type TDialogAdminCancelEventWarningProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: TEvent | null
    onConfirm: () => void
}

const DialogAdminCancelEventWarning = ({
    open,
    onOpenChange,
    event,
    onConfirm
}: TDialogAdminCancelEventWarningProps) => {
    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-5 w-5" />
                        ATENÇÃO: Cancelar Evento (Ação Administrativa)
                    </DialogTitle>
                    <DialogDescription>
                        Esta é uma ação irreversível com consequências graves
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-base font-semibold text-destructive mb-2">
                            ⚠️ CANCELAR UM EVENTO É EXTREMAMENTE PREJUDICIAL
                        </p>
                        <p className="text-sm text-psi-dark">
                            Cancelar um evento como administrador é uma atitude que pode causar <strong>diversas consequências negativas</strong> para a plataforma, organizador e compradores, incluindo:
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-900 mb-2">
                                Consequências Imediatas:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 ml-2">
                                <li>Perda de credibilidade e confiança dos compradores na plataforma</li>
                                <li>Danos à reputação da plataforma e do organizador</li>
                                <li>Impacto negativo na imagem da marca</li>
                                <li>Possíveis ações legais ou reclamações</li>
                                <li>Perda de confiança em eventos futuros</li>
                            </ul>
                        </div>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <p className="text-sm font-medium text-amber-900 mb-2">
                                Consequências Financeiras:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800 ml-2">
                                <li>Reembolso obrigatório de todos os ingressos vendidos</li>
                                <li>Perda de receita já arrecadada</li>
                                <li>Possíveis custos com taxas de transação</li>
                                <li>Impacto negativo em eventos futuros</li>
                                <li>Possível perda de parceiros e organizadores</li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                            <p className="text-sm font-medium text-psi-dark mb-2">
                                Informações do Evento:
                            </p>
                            <div className="space-y-2 text-sm text-psi-dark/70">
                                <p><strong>Nome:</strong> {event.name}</p>
                                {event.Organizer && (
                                    <p><strong>Organizador:</strong> {event.Organizer.companyName || "Organizador"}</p>
                                )}
                                {event.EventDates && event.EventDates.length > 0 && (
                                    <div>
                                        <strong>Datas:</strong>
                                        <ul className="list-disc list-inside ml-4 mt-1">
                                            {event.EventDates.map((eventDate, index) => (
                                                <li key={index}>
                                                    {formatEventDate(eventDate.date, "DD/MM/YYYY")} - {formatEventTime(eventDate.hourStart, eventDate.hourEnd)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border-2 border-destructive bg-destructive/5 p-4">
                            <p className="text-sm font-semibold text-destructive mb-2">
                                IMPORTANTE - Termos e Condições:
                            </p>
                            <p className="text-sm text-psi-dark">
                                De acordo com os <strong>termos e condições de uso da plataforma</strong>, 
                                ao cancelar um evento, <strong>todos os ingressos vendidos serão automaticamente 
                                estornados aos compradores</strong>. Esta ação é irreversível e não pode ser desfeita.
                            </p>
                        </div>

                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                            <p className="text-sm font-medium text-psi-dark mb-1">
                                Alternativas Recomendadas:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-psi-dark/70 ml-2">
                                <li>Entre em contato com o organizador antes de cancelar</li>
                                <li>Considere adiar o evento em vez de cancelar</li>
                                <li>Avalie todas as opções antes de tomar esta decisão</li>
                                <li>Documente o motivo do cancelamento</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Voltar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Desejo prosseguir mesmo assim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogAdminCancelEventWarning
}

