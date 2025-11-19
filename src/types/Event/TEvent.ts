import { TEventBatch } from "./TEventBatch"

type TEventDate = {
    id: string
    date: string
    hourStart: string
    hourEnd: string | null
    eventId: string
    createdAt: string
    updatedAt: string | null
}

type TRecurrenceDay = {
    id: string
    day: number
    hourStart: string
    hourEnd: string | null
    recurrenceId: string
    createdAt: string
    updatedAt: string | null
}

type TRecurrence = {
    id: string
    type: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY"
    hourStart: string | null
    hourEnd: string | null
    endDate: string | null
    eventId: string
    createdAt: string
    updatedAt: string | null
    RecurrenceDay: TRecurrenceDay[]
} | null

type TEventCategoryEvent = {
    eventId: string
    categoryId: string
    createdAt: string
}

type TOrganizer = {
    id: string
    name: string
    createdAt: string
    updatedAt: string | null
    userId: string
}

type TEvent = {
    id: string
    name: string
    description: string | null
    location: string | null
    image: string
    price: number | null
    tickets: number
    userId: string
    organizerId: string
    createdAt: string
    updatedAt: string | null
    EventDate: TEventDate[]
    EventBatch: TEventBatch[]
    EventCategoryEvent: TEventCategoryEvent[]
    Recurrence: TRecurrence
    Organizer: TOrganizer
}

export type {
    TEvent,
    TEventDate,
    TRecurrence,
    TRecurrenceDay,
    TEventCategoryEvent,
    TOrganizer
}