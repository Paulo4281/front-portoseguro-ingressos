import { TRecurrenceDay } from "./TEvent"

type TRecurrence = {
    id: string
    type: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY"
    hourStart: string | null
    hourEnd: string | null
    endDate: string | null
    eventId: string
    createdAt: string
    updatedAt: string | null
    RecurrenceDays: TRecurrenceDay[]
}

export type {
    TRecurrence
}