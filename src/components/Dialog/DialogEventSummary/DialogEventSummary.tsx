"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Info, Calendar, MapPin, Ticket, FileText, Repeat, Tag, Clock } from "lucide-react"
import { formatEventDate, formatEventTime } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import type { z } from "zod"
import type { EventCreateValidator } from "@/validators/Event/EventValidator"
import type { TEventCategory } from "@/types/Event/TEventCategory"

type TEventCreate = z.infer<typeof EventCreateValidator>

type TDialogEventSummaryProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    eventData: TEventCreate
    eventCategories: TEventCategory[]
    onConfirm: () => void | Promise<void>
    isLoading?: boolean
}

const weekDayLabels = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const weekDayLabelsShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "Grátis"
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value)
}

const formatRecurrence = (recurrence: TEventCreate["recurrence"]) => {
    if (!recurrence) return null

    if (recurrence.type === "DAILY") {
        const timeText = recurrence.hourStart 
            ? (recurrence.hourEnd ? `${recurrence.hourStart} - ${recurrence.hourEnd}` : recurrence.hourStart)
            : "Horário a definir"
        const endDateText = recurrence.endDate ? ` até ${formatEventDate(recurrence.endDate, "DD [de] MMMM [de] YYYY")}` : ""
        return `Diário${recurrence.hourStart ? ` (${timeText})` : ""}${endDateText}`
    }

    if (recurrence.type === "WEEKLY" && recurrence.day !== null && recurrence.day !== undefined) {
        const dayLabel = weekDayLabelsShort[recurrence.day] || `Dia ${recurrence.day}`
        let timeText = ""
        if (recurrence.hourStart) {
            timeText = recurrence.hourEnd
                ? `: ${recurrence.hourStart} - ${recurrence.hourEnd}`
                : `: ${recurrence.hourStart}`
        }
        const endDateText = recurrence.endDate ? ` até ${formatEventDate(recurrence.endDate, "DD [de] MMMM [de] YYYY")}` : ""
        return `Semanal (${dayLabel}${timeText})${endDateText}`
    }

    if (recurrence.type === "MONTHLY" && recurrence.day !== null && recurrence.day !== undefined) {
        const dayLabel = `Dia ${recurrence.day}`
        let timeText = ""
        if (recurrence.hourStart) {
            timeText = recurrence.hourEnd
                ? `: ${recurrence.hourStart} - ${recurrence.hourEnd}`
                : `: ${recurrence.hourStart}`
        }
        const endDateText = recurrence.endDate ? ` até ${formatEventDate(recurrence.endDate, "DD [de] MMMM [de] YYYY")}` : ""
        return `Mensal (${dayLabel}${timeText})${endDateText}`
    }

    return null
}

const DialogEventSummary = ({
    open,
    onOpenChange,
    eventData,
    eventCategories,
    onConfirm,
    isLoading = false
}: TDialogEventSummaryProps) => {
    const getCategoryName = (categoryId: string): string => {
        const category = eventCategories.find(c => c.id === categoryId)
        return category?.name || categoryId
    }
    const handleConfirm = async () => {
        await onConfirm()
    }

    const hasBatches = eventData.batches && eventData.batches.length > 0
    const hasTicketTypes = eventData.ticketTypes && eventData.ticketTypes.length > 0
    const hasRecurrence = !!eventData.recurrence
    const hasDates = eventData.dates && eventData.dates.length > 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-psi-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-psi-primary" />
                        </div>
                        <DialogTitle>Resumo do Evento</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-left">
                        Revise todas as informações antes de publicar. Após a primeira venda, algumas alterações precisarão de suporte.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 flex items-start gap-3">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                            <Info className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-psi-dark/90 leading-relaxed">
                                <strong>Importante:</strong> Após a primeira venda de ingressos, alguns campos como <strong>datas, detalhes de recorrência e horários</strong> não poderão ser alterados diretamente. Para fazer alterações nesses campos, será necessário entrar em contato com o suporte através da plataforma.
                            </p>
                            <p className="text-sm text-psi-dark/80 leading-relaxed mt-2">
                                Verifique se todas as informações estão corretas para evitar transtornos para você e seus clientes. Nossa equipe está sempre pronta para ajudar quando necessário.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-b border-psi-dark/10 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-psi-primary" />
                                <h3 className="font-medium text-psi-dark">Informações Básicas</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-psi-dark/70">Nome:</span>
                                    <span className="ml-2 text-psi-dark font-medium">{eventData.name}</span>
                                </div>
                                <div>
                                    <span className="text-psi-dark/70">Descrição:</span>
                                    <div className="mt-1 text-psi-dark/80 line-clamp-3">{eventData.description}</div>
                                </div>
                                {eventData.categories && eventData.categories.length > 0 && (
                                    <div>
                                        <span className="text-psi-dark/70">Categorias:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {eventData.categories.map((categoryId, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-psi-primary/10 text-psi-primary text-xs font-medium"
                                                >
                                                    <Tag className="h-3 w-3" />
                                                    {getCategoryName(categoryId)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {eventData.location && (
                                    <div>
                                        <span className="text-psi-dark/70">Localização:</span>
                                        <span className="ml-2 text-psi-dark font-medium">{eventData.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasRecurrence && (
                            <div className="border-b border-psi-dark/10 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Repeat className="h-4 w-4 text-psi-primary" />
                                    <h3 className="font-medium text-psi-dark">Recorrência</h3>
                                </div>
                                <div className="text-sm text-psi-dark">
                                    {formatRecurrence(eventData.recurrence)}
                                </div>
                            </div>
                        )}

                        {hasDates && !hasRecurrence && (
                            <div className="border-b border-psi-dark/10 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4 text-psi-primary" />
                                    <h3 className="font-medium text-psi-dark">Datas e Horários</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {eventData.dates?.map((date, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <div className="flex-1">
                                                <div className="text-psi-dark font-medium">
                                                    {formatEventDate(date.date, "DD [de] MMMM [de] YYYY")}
                                                </div>
                                                <div className="text-psi-dark/70 flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatEventTime(date.hourStart, date.hourEnd)}
                                                </div>
                                                {date.hasSpecificPrice && (
                                                    <div className="text-psi-dark/70 mt-1">
                                                        Preço: {formatCurrency(date.price)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasTicketTypes && (
                            <div className="border-b border-psi-dark/10 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Ticket className="h-4 w-4 text-psi-primary" />
                                    <h3 className="font-medium text-psi-dark">Tipos de Ingresso</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {eventData.ticketTypes?.map((type, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <span className="text-psi-dark font-medium">{type.name}</span>
                                                {type.description && (
                                                    <div className="text-psi-dark/70 text-xs mt-0.5">{type.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasBatches && (
                            <div className="border-b border-psi-dark/10 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Ticket className="h-4 w-4 text-psi-primary" />
                                    <h3 className="font-medium text-psi-dark">Lotes</h3>
                                </div>
                                <div className="space-y-4 text-sm">
                                    {eventData.batches?.map((batch, index) => (
                                        <div key={index} className="rounded-lg border border-psi-dark/10 p-3">
                                            <div className="font-medium text-psi-dark mb-2">{batch.name}</div>
                                            <div className="space-y-1 text-psi-dark/70">
                                                <div>
                                                    <span>Período:</span>
                                                    <span className="ml-2">
                                                        {formatEventDate(batch.startDate, "DD [de] MMMM [de] YYYY")}
                                                        {batch.endDate && ` até ${formatEventDate(batch.endDate, "DD [de] MMMM [de] YYYY")}`}
                                                    </span>
                                                </div>
                                                {batch.price !== null && batch.price !== undefined && (
                                                    <div>
                                                        <span>Preço:</span>
                                                        <span className="ml-2 font-medium text-psi-dark">{formatCurrency(batch.price)}</span>
                                                    </div>
                                                )}
                                                {batch.quantity !== null && batch.quantity !== undefined && (
                                                    <div>
                                                        <span>Quantidade:</span>
                                                        <span className="ml-2 font-medium text-psi-dark">{batch.quantity} ingressos</span>
                                                    </div>
                                                )}
                                                {batch.ticketTypes && batch.ticketTypes.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-psi-dark/10">
                                                        <div className="text-xs font-medium text-psi-dark/70 mb-1">Por tipo:</div>
                                                        {batch.ticketTypes.map((type, typeIndex) => {
                                                            const ticketType = eventData.ticketTypes?.[parseInt(type.ticketTypeId)]
                                                            return (
                                                                <div key={typeIndex} className="flex items-center justify-between text-xs">
                                                                    <span className="text-psi-dark/70">
                                                                        {ticketType?.name || `Tipo ${parseInt(type.ticketTypeId) + 1}`}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        {type.price !== null && type.price !== undefined && (
                                                                            <span className="font-medium text-psi-dark">{formatCurrency(type.price)}</span>
                                                                        )}
                                                                        <span className="text-psi-dark/70">x {type.amount}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!hasBatches && (
                            <div className="border-b border-psi-dark/10 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Ticket className="h-4 w-4 text-psi-primary" />
                                    <h3 className="font-medium text-psi-dark">Ingressos</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-psi-dark/70">Quantidade:</span>
                                        <span className="ml-2 font-medium text-psi-dark">{eventData.tickets} ingressos</span>
                                    </div>
                                    {eventData.ticketPrice !== null && eventData.ticketPrice !== undefined && (
                                        <div>
                                            <span className="text-psi-dark/70">Preço:</span>
                                            <span className="ml-2 font-medium text-psi-dark">{formatCurrency(eventData.ticketPrice)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 text-sm">
                            {eventData.isFree && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-medium">
                                    Evento Gratuito
                                </div>
                            )}
                            {eventData.isClientTaxed && (
                                <div className="text-psi-dark/70">
                                    Taxa de serviço: Cliente paga
                                </div>
                            )}
                            {eventData.buyTicketsLimit && (
                                <div className="text-psi-dark/70">
                                    Limite de compra por pessoa: {eventData.buyTicketsLimit} ingressos
                                </div>
                            )}
                            {eventData.maxInstallments && eventData.maxInstallments > 1 && (
                                <div className="text-psi-dark/70">
                                    Parcelamento: até {eventData.maxInstallments}x
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Voltar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Publicando..." : "Já conferi, publicar evento agora"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogEventSummary
}
