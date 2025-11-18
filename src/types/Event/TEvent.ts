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

type TBatch = {
    id: string
    name: string
    price: number
    quantity: number
    startDate: string
    endDate: string | null
    isActive: boolean
}

type TEvent = {
    id: string
    name: string
    description: string
    dates: TEventDate[]
    location: string | null
    image: string
    tickets: number
    recurrence: TRecurrence
    batches: TBatch[] | null
    createdAt: string
    updatedAt: string | null
}

export type {
    TEvent,
    TEventDate,
    TRecurrence,
    TRecurrenceDay,
    TBatch
}