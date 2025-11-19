import { TEventBatch } from "./TEventBatch"

type TEventDate = {
    date: string
    hourStart: string
    hourEnd: string | null
}

type TRecurrenceDay = {
    day: number
    hourStart: string
    hourEnd?: string | null
}

type TRecurrence = {
    type: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY"
    hourStart?: string
    hourEnd?: string | null
    daysOfWeek?: TRecurrenceDay[]
    endDate?: string | null
} | null

type TEvent = {
    id: string
    name: string
    description: string
    categories: string[]
    dates: TEventDate[]
    location: string | null
    image: string
    tickets: number
    recurrence: TRecurrence
    batches: TEventBatch[] | null
    createdAt: string
    updatedAt: string | null
}

export type {
    TEvent,
    TEventDate,
    TRecurrence,
    TRecurrenceDay
}