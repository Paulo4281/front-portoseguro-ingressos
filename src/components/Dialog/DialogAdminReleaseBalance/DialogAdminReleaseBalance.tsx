"use client"

import { useState, useEffect, useMemo } from "react"
import { Wallet, Calendar } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { TEvent } from "@/types/Event/TEvent"
import { formatEventDate, formatEventTime } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { useBalanceListDatesByEvent } from "@/hooks/Balance/useBalanceListDatesByEvent"

type TDialogAdminReleaseBalanceProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: TEvent | null
    onConfirm: (eventDateId: string | null) => void
}

const DialogAdminReleaseBalance = ({
    open,
    onOpenChange,
    event,
    onConfirm
}: TDialogAdminReleaseBalanceProps) => {
    const [selectedEventDateId, setSelectedEventDateId] = useState<string | null>(null)
    const isRecurrent = !!event?.Recurrence

    const { data: balancesDatesData, isLoading: isLoadingBalancesDates } = useBalanceListDatesByEvent(
        event?.id || null,
        open && isRecurrent && !!event?.id
    )

    const paidDates = useMemo(() => {
        if (!balancesDatesData?.data) return []
        return balancesDatesData.data.map(item => {
            const date = new Date(item.date)
            return date.toISOString().split('T')[0]
        })
    }, [balancesDatesData])

    const availableEventDates = useMemo(() => {
        if (!event?.EventDates) return []
        return event.EventDates.filter(ed => ed.date)
    }, [event])

    useEffect(() => {
        if (!open) {
            setSelectedEventDateId(null)
        }
    }, [open])

    const handleConfirm = () => {
        if (isRecurrent && !selectedEventDateId) {
            return
        }
        onConfirm(isRecurrent ? selectedEventDateId : null)
    }

    const isDatePaid = (eventDateId: string) => {
        const eventDate = availableEventDates.find(ed => ed.id === eventDateId)
        if (!eventDate?.date) return false
        
        try {
            const eventDateObj = new Date(eventDate.date)
            const eventDateStr = eventDateObj.toISOString().split('T')[0]
            return paidDates.includes(eventDateStr)
        } catch {
            return false
        }
    }

    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-emerald-600" />
                        Liberar Saldo do Evento
                    </DialogTitle>
                    <DialogDescription>
                        Esta ação irá liberar o saldo por completo para o organizador do evento "{event.name}".
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {isRecurrent ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">
                                Selecione a data do evento <span className="text-destructive">*</span>
                            </label>
                            {isLoadingBalancesDates ? (
                                <p className="text-sm text-psi-dark/60">Carregando datas...</p>
                            ) : (
                                <Select
                                    value={selectedEventDateId || ""}
                                    onValueChange={setSelectedEventDateId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione uma data" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableEventDates.map((eventDate) => {
                                            const isPaid = isDatePaid(eventDate.id)
                                            const dateStr = eventDate.date 
                                                ? formatEventDate(eventDate.date, "DD/MM/YYYY")
                                                : "Data não definida"
                                            const timeStr = formatEventTime(eventDate.hourStart, eventDate.hourEnd)
                                            
                                            return (
                                                <SelectItem
                                                    key={eventDate.id}
                                                    value={eventDate.id}
                                                    disabled={isPaid}
                                                    className={isPaid ? "opacity-50 cursor-not-allowed" : ""}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>
                                                            {dateStr} {timeStr && `- ${timeStr}`}
                                                        </span>
                                                        {isPaid && (
                                                            <span className="text-xs text-psi-dark/60 ml-2">
                                                                (Já repassada)
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            )}
                            {availableEventDates.length === 0 && !isLoadingBalancesDates && (
                                <p className="text-sm text-psi-dark/60">
                                    Nenhuma data disponível para este evento.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                            <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                <Calendar className="h-4 w-4 text-psi-primary" />
                                <span>O saldo será liberado para todo o evento.</span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={isRecurrent && !selectedEventDateId}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogAdminReleaseBalance
}

