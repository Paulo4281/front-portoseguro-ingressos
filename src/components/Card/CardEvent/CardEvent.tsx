import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, Repeat, Tag } from "lucide-react"
import { Card } from "@/components/Card/Card"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TEvent, TRecurrenceDay } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"

type TCardEventProps = {
    event: TEvent
}

const CardEvent = (
    {
        event
    }: TCardEventProps
) => {
    const getDateRange = (dates: TEvent["EventDate"]) => {
        if (!dates || !Array.isArray(dates) || dates.length === 0) return null

        const sortedDates = [...dates].sort((a, b) => 
            getDateOrderValue(a?.date) - getDateOrderValue(b?.date)
        )

        const firstDate = formatEventDate(sortedDates[0]?.date, "DD [de] MMMM [de] YYYY")
        const lastDate = formatEventDate(sortedDates[sortedDates.length - 1]?.date, "DD MMM")

        if (dates.length === 1) {
            return firstDate
        }

        return `${firstDate} - ${lastDate}`
    }

    const formatRecurrenceInfo = (recurrence: TEvent["Recurrence"]) => {
        if (!recurrence || recurrence.type === "NONE") return null

        const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

        if (recurrence.type === "DAILY") {
            if (recurrence.hourStart) {
                return {
                    type: "DAILY",
                    text: recurrence.hourEnd 
                        ? `${recurrence.hourStart} - ${recurrence.hourEnd}`
                        : recurrence.hourStart
                }
            }
            return { type: "DAILY", text: "Diário" }
        }

        if (recurrence.type === "WEEKLY") {
            if (recurrence.RecurrenceDay && recurrence.RecurrenceDay?.length > 0) {
                const timesText = recurrence.RecurrenceDay
                    .map((dayData: TRecurrenceDay) => {
                        if (dayData.hourStart) {
                            return dayData.hourEnd 
                                ? `${dayLabels[dayData.day]}: ${dayData.hourStart} - ${dayData.hourEnd}`
                                : `${dayLabels[dayData.day]}: ${dayData.hourStart}`
                        }
                        return dayLabels[dayData.day]
                    })
                    .join(" | ")

                return {
                    type: "WEEKLY",
                    text: timesText
                }
            }
            return { type: "WEEKLY", text: "Semanal" }
        }

        if (recurrence.type === "MONTHLY") {
            if (recurrence.RecurrenceDay && recurrence.RecurrenceDay?.length > 0) {
                const daysText = recurrence.RecurrenceDay
                    .map((dayData: TRecurrenceDay) => {
                        const dayLabel = `Dia ${dayData.day}`
                        if (dayData.hourStart) {
                            return dayData.hourEnd
                                ? `${dayLabel}: ${dayData.hourStart} - ${dayData.hourEnd}`
                                : `${dayLabel}: ${dayData.hourStart}`
                        }
                        return dayLabel
                    })
                    .join(" | ")

                return {
                    type: "MONTHLY",
                    text: daysText
                }
            }
            return { type: "MONTHLY", text: "Mensal" }
        }

        return null
    }

    const getActiveBatch = (batches: TEvent["EventBatch"]): TEventBatch | null => {
        if (!batches || batches?.length === 0) return null

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

    const activeBatch = getActiveBatch(event.EventBatch)
    const recurrenceInfo = formatRecurrenceInfo(event.Recurrence)
    const isRecurrent = event.Recurrence && event.Recurrence.type !== "NONE"
    const firstDate = event.EventDate && Array.isArray(event.EventDate) && event.EventDate.length > 0 ? event.EventDate[0] : null

    return (
        <Link href={`/ver-evento?id=${event.id}`} className="block h-full">
            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 group">
                <div className="relative w-full h-56 overflow-hidden bg-psi-dark/5">
                    <img
                        src={ImageUtils.getEventImageUrl(event.image)}
                        alt={event.name}
                        className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    {activeBatch && (
                        <div className="absolute top-3 right-3">
                            <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-psi-primary/20 shadow-sm">
                                <Tag className="h-3 w-3 text-psi-primary" />
                                <span className="text-xs font-semibold text-psi-dark">
                                    {activeBatch.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-psi-dark mb-3 line-clamp-2 leading-tight group-hover:text-psi-primary transition-colors">
                        {event.name}
                    </h3>

                    <div className="space-y-2.5 flex-1">
                        {!isRecurrent && (
                            <>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-psi-dark/70">
                                    <Calendar className="h-4 w-4 text-psi-primary shrink-0" />
                                    <span className="font-medium">{getDateRange(event.EventDate)}</span>
                                    {event.EventDate && Array.isArray(event.EventDate) && event.EventDate.length > 1 && (
                                        <span className="text-xs text-psi-dark/50">
                                            • {event.EventDate.length} datas
                                        </span>
                                    )}
                                </div>
                                
                                {firstDate && (
                                    <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                        <Clock className="h-4 w-4 text-psi-primary shrink-0" />
                                        <span>
                                            {formatEventTime(firstDate.hourStart, firstDate.hourEnd)}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        {isRecurrent && recurrenceInfo && (
                            <div className="flex items-start gap-2 text-sm text-psi-dark/70">
                                <Clock className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-psi-primary">
                                            {recurrenceInfo.type === "DAILY" && "Diário"}
                                            {recurrenceInfo.type === "WEEKLY" && "Semanal"}
                                            {recurrenceInfo.type === "MONTHLY" && "Mensal"}
                                        </span>
                                        <span className="text-psi-dark/50">•</span>
                                        <span className="whitespace-pre-line leading-relaxed">{recurrenceInfo.text}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {event.location && (
                            <div className="flex items-center gap-2 text-sm text-psi-dark/70 pt-1">
                                <MapPin className="h-4 w-4 text-psi-primary shrink-0" />
                                <span className="line-clamp-1">{event.location}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export {
    CardEvent 
}
