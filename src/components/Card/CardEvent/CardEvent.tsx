import Link from "next/link"
import { Calendar, Clock, MapPin, Ticket, Repeat, Tag } from "lucide-react"
import { Card } from "@/components/Card/Card"
import type { TEvent, TBatch } from "@/types/Event/TEvent"

type TCardEventProps = {
    event: TEvent
}

const CardEvent = (
    {
        event
    }: TCardEventProps
) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(price)
    }

    const getDateRange = (dates: TEvent["dates"]) => {
        if (dates.length === 0) return null

        const sortedDates = [...dates].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        const firstDate = formatDate(sortedDates[0].date)
        const lastDate = formatDate(sortedDates[sortedDates.length - 1].date)

        if (dates.length === 1) {
            return firstDate
        }

        return `${firstDate} - ${lastDate}`
    }

    const formatRecurrence = (recurrence: TEvent["recurrence"]) => {
        if (!recurrence || recurrence.type === "NONE") return null

        const recurrenceLabels = {
            DAILY: "Diário",
            WEEKLY: "Semanal",
            MONTHLY: "Mensal"
        }

        const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

        let label = recurrenceLabels[recurrence.type]

        if (recurrence.type === "WEEKLY" && recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
            const days = recurrence.daysOfWeek.map(day => dayLabels[day]).join(", ")
            label = `${label} (${days})`
        }

        return label
    }

    const firstDate = event.dates.length > 0 ? event.dates[0] : null

    const getActiveBatch = (batches: TEvent["batches"]): TBatch | null => {
        if (!batches || batches.length === 0) return null

        const now = new Date()
        const activeBatch = batches.find(batch => {
            const startDate = new Date(batch.startDate)
            const endDate = batch.endDate ? new Date(batch.endDate) : null
            
            const isAfterStart = now >= startDate
            const isBeforeEnd = !endDate || now <= endDate
            
            return batch.isActive && isAfterStart && isBeforeEnd
        })

        return activeBatch || null
    }

    const activeBatch = getActiveBatch(event.batches)

    return (
        <Card className="h-full flex flex-col">
            <div className="relative w-full h-48 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2">
                    {event.name}
                </h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{getDateRange(event.dates)}</span>
                            {event.dates.length > 1 && (
                                <span className="text-xs text-muted-foreground/70">
                                    ({event.dates.length} datas)
                                </span>
                            )}
                        </div>
                        
                        {firstDate && firstDate.hourStart && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {firstDate.hourStart}
                                    {firstDate.hourEnd && ` - ${firstDate.hourEnd}`}
                                </span>
                            </div>
                        )}
                    </div>

                    {event.recurrence && event.recurrence.type !== "NONE" && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <Repeat className="h-4 w-4" />
                            <span>{formatRecurrence(event.recurrence)}</span>
                        </div>
                    )}
                    
                    {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    )}

                    {activeBatch && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2 mt-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-semibold text-card-foreground">
                                        {activeBatch.name}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-primary">
                                    {formatPrice(activeBatch.price)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

export {
    CardEvent 
}