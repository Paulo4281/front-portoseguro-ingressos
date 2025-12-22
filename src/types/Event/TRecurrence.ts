type TRecurrence = {
    id: string
    type: "DAILY" | "WEEKLY" | "MONTHLY"
    hourStart: string | null
    hourEnd: string | null
    endDate: string | null
    day: number | null
    eventId: string
    createdAt: string
    updatedAt: string | null
}

export type {
    TRecurrence
}