import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { UserGenres } from "../User/TUser"
import { TTicketDate } from "./TTicketDate"
import type { TPayment } from "@/types/Payment/TPayment"

const TicketStatuses = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "REFUNDED",
    "OVERDUE",
    "USED",
    "PARTIALLY_USED",
    "EXPIRED"
] as const

type TTicketForm = {
    text?: {
        label: string
        answer: string | null
    }[] | null
    email?: {
        label: string
        answer: string | null
    }[] | null
    textArea?: {
        label: string
        answer: string | null
    }[] | null
    select?: {
        label: string
        answer: string | null
    }[] | null
    multiSelect?: {
        label: string
        answer: string | null
    }[] | null
}

type TTicket = {
    id: string
    token: string
    status: typeof TicketStatuses[number]
    eventId: string
    eventBatchId: string
    ticketTypeId: string | null
    userId: string
    paymentId: string | null
    form: TTicketForm | null
    usedAt: string | null
    price: number
    createdAt: string
    updatedAt: string | null

    TicketDates: TTicketDate[]
    Event: TEvent
    EventBatch: TEventBatch
    TicketType?: {
        id: string
        name: string
        description: string | null
    } | null
    Payment?: TPayment | null
}

type TTicketScanResponse = {
    status: "VALID" | "EXPIRED" | "CANCELLED" | "USED"
    description: string | null
}

type TTicketScanLinkGenerateResponse = {
    link: string
}

type TTicketScanLink = {
    id: string
    link: string
    maxUsers: number
    currentUsers: number
    password: string
    createdAt: string
}

type TTicketScanLinkCreate = {
    maxUsers: number
    password: string
}

type TTicketScanLinkDelete = {
    linkId: string
}

type TTicketBuy = {
    eventIds: string[]
    eventDatesIds: {
        eventId: string
        eventDates: {
            eventDateId: string
            amount: number
        }[]
    }[] | null
    eventTicketTypesIds: {
        eventId: string
        ticketTypes: {
            ticketTypeId: string | null
            amount: number
            eventDateId: string | null
        }[]
    }[] | null
    eventTicketAmount: {
        eventId: string
        amount: number
    }[] | null
    eventForms: {
        eventId: string
        answers: {
            ticketNumber: string
            ticketTypeId: string | null
            text: {
                label: string
                answer: string | null
            }[] | null
            email: {
                label: string
                answer: string | null
            }[] | null
            textArea: {
                label: string
                answer: string | null
            }[] | null
            select: {
                label: string
                answer: string | null
            }[] | null
            multiSelect: {
                label: string
                answer: string | null
            }[] | null
        }[]
    }[] | null
    paymentMethod: "CREDIT_CARD" | "PIX"
    ccInfo: {
        number: string
        holderName: string
        exp: string
        cvv: string
        installments: number
        cardId: string | null
    } | null
    couponCodes: {
        eventId: string
        couponCode: string
    }[] | null
    removeTicketHoldIds: string[] | null
    vfc: number | null
}

type TTicketToOrganizer = {
    id: string
    customer: {
        id: string
        name: string
        email: string
        phone: string | null
        document: string | null
        nationality: string | null
        gender: typeof UserGenres[number] | null
        birth: string | null
        image: string | null
    }
    status: typeof TicketStatuses[number]
    ticketType: {
        id: string
        name: string
        description: string | null
    }
    price: number
    form: TTicketForm | null
    createdAt: string
}

type TTicketBuyResponse = {
    pixData?: {
        encodedImage: string
        payload: string
        expirationDate: string
        description: string
    } | null
    paymentId?: string | null
}

type TTicketQRCodeResponse = {
    token: string
}

export type {
    TTicket,
    TTicketBuy,
    TTicketBuyResponse,
    TTicketScanResponse,
    TTicketScanLinkGenerateResponse,
    TTicketScanLink,
    TTicketScanLinkCreate,
    TTicketScanLinkDelete,
    TTicketQRCodeResponse,
    TTicketForm,
    TTicketToOrganizer
}