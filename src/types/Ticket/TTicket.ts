import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"

type TTicket = {
    id: string
    status: "PENDING" | "PAID" | "CANCELLED" | "USED" | "EXPIRED"
    eventId: string
    eventBatchId: string | null
    userId: string
    price: number
    createdAt: string
    updatedAt: string | null

    event: TEvent
    eventBatch: TEventBatch | null
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
    vfc: number | null
}

type TTicketBuyResponse = {
    pixQrCode: string | null
    isConfirmed: boolean
}

export type {
    TTicket,
    TTicketBuy,
    TTicketBuyResponse,
    TTicketScanResponse,
    TTicketScanLinkGenerateResponse,
    TTicketScanLink,
    TTicketScanLinkCreate,
    TTicketScanLinkDelete
}