import type { TEventBatch } from "./TEventBatch"
import type { TEventDate } from "./TEventDate"
import type { TRecurrence } from "./TRecurrence"
import type { TRecurrenceDay } from "./TRecurrenceDay"
import type { TEventCategoryEvent } from "./TEventCategoryEvent"
import type { TOrganizer } from "@/types/Organizer/TOrganizer"

type TEvent = {
    id: string
    name: string
    description: string | null
    location: string | null
    image: string
    price: number | null
    tickets: number | null
    userId: string
    organizerId: string
    isClientTaxed: boolean
    isActive: boolean
    isDeleted: boolean
    isCancelled: boolean
    isPostponed: boolean
    createdAt: string
    updatedAt: string | null
    
    EventDate: TEventDate[]
    EventBatch: TEventBatch[]
    EventCategoryEvent: TEventCategoryEvent[]
    Recurrence: TRecurrence | null
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