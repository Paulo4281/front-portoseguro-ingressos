"use client"

import { AlertTriangle, CalendarClock } from "lucide-react"
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

type TDialogAdminChangeDateWarningProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: TEvent | null
    onConfirm: () => void
}

const DialogAdminChangeDateWarning = ({
    open,
    onOpenChange,
    event,
    onConfirm
}: TDialogAdminChangeDateWarningProps) => {
    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        ATENÇÃO: Alterar Data/Horário do Evento
                    </DialogTitle>
                    <DialogDescription>
                        Esta é uma ação administrativa sensível que pode impactar compradores
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                        <p className="text-base font-bold text-amber-900 mb-2">
                            ⚠️ ALTERAR DATA/HORÁRIO É UMA AÇÃO CRÍTICA
                        </p>
                        <p className="text-sm text-psi-dark">
                            Alterar a data ou horário de um evento pode causar <strong>diversas consequências negativas</strong>, incluindo:
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm font-semibold text-red-900 mb-2">
                                Consequências para os Compradores:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 ml-2">
                                <li>Compradores podem não conseguir comparecer na nova data</li>
                                <li>Confusão e insatisfação dos clientes</li>
                                <li>Possíveis solicitações de reembolso em massa</li>
                                <li>Danos à reputação da plataforma</li>
                            </ul>
                        </div>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <p className="text-sm font-semibold text-amber-900 mb-2">
                                Consequências para o Organizador:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800 ml-2">
                                <li>Perda de credibilidade e confiança</li>
                                <li>Impacto negativo na imagem da marca</li>
                                <li>Possíveis ações legais ou reclamações</li>
                                <li>Redução de vendas em eventos futuros</li>
                            </ul>
                        </div>

                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                            <p className="text-sm font-semibold text-psi-dark mb-2">
                                Informações do Evento:
                            </p>
                            <div className="space-y-2 text-sm text-psi-dark/70">
                                <p><strong>Nome:</strong> {event.name}</p>
                                {event.EventDates && event.EventDates.length > 0 && (
                                    <div>
                                        <strong>Datas atuais:</strong>
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
                            <p className="text-sm font-bold text-destructive mb-2">
                                IMPORTANTE - Recomendações:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-psi-dark ml-2">
                                <li>Comunique o organizador antes de realizar a alteração</li>
                                <li>Considere notificar os compradores sobre a mudança</li>
                                <li>Avalie todas as alternativas antes de tomar esta decisão</li>
                                <li>Documente o motivo da alteração</li>
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
                        Cancelar
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
    DialogAdminChangeDateWarning
}

