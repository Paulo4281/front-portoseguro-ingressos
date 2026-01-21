import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { UserGenres } from "../User/TUser"
import { TTicketDate } from "./TTicketDate"
import type { PaymentGatewayBillingStatuses, PaymentMethods, TPayment } from "@/types/Payment/TPayment"

const TicketCancelledBy = [
    "ORGANIZER",
    "CUSTOMER",
    "ADMIN"
] as const

const TicketStatuses = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "REFUNDED",
    "REFUND_REQUESTED",
    "OVERDUE",
    "USED",
    "PARTIALLY_USED",
    "EXPIRED",
    "FAILED"
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

type TTicketValidationInfo = {
    validatedAt?: string | null
    validatedByOrganizer?: boolean
    method?: "qr-scan" | "qr-image" | "button" | null
    code?: string | null
    ip?: string | null
    name?: string | null
    location?: string | null
} | null

type TTicket = {
    id: string
    code: string
    price: number
    token: string
    status: typeof TicketStatuses[number]
    eventId: string
    eventBatchId: string
    ticketTypeId: string | null
    userId: string
    paymentId: string | null
    form: TTicketForm | null
    validationInfo?: TTicketValidationInfo
    usedAt: string | null
    refundReason: string | null
    refundedBy: string | null
    refundedAt: string | null
    refundStatus: string | null
    refundReceiptUrl: string | null
    refundEndToEndIndentifier: string | null
    isInsured?: boolean | null
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

type TTicketValidateQrCodeResponse = {
    isValid: boolean
    reason: string | null
    ticketId?: string | null
    validationInfo?: TTicketValidationInfo
}

type TTicketValidate = {
    isValid: boolean
    reason: string | null
    ticketId?: string | null
    validationInfo?: TTicketValidationInfo
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
    isInsured?: boolean
}

type TTicketToOrganizer = {
    id: string
    code: string
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
    payment: {
        id: string
        code: string
        method: typeof PaymentMethods[number]
        status: typeof PaymentGatewayBillingStatuses[number]
        paidAt: string | null
    } | null
    status: typeof TicketStatuses[number]
    ticketType: {
        id: string
        name: string
        description: string | null
    }
    eventDate: {
        id: string | null
        date: string | null
    } | null
    price: number
    form: TTicketForm | null
    validationInfo?: TTicketValidationInfo
    cancelledBy: typeof TicketCancelledBy[number] | null
    cancelledAt: string | null
    refundReason: string | null
    refundedBy: string | null
    refundedAt: string | null
    refundStatus: string | null
    refundReceiptUrl: string | null
    refundEndToEndIndentifier: string | null
    createdAt: string
}

type TTicketCustomerRequestRefundResponse = {
    refunded: boolean
    reason?: string
}

type TTicketOrganizerRequestRefundResponse = {
    refunded: boolean
    reason?: string
}

type TTicketBuyResponse = {
    pixData?: {
        encodedImage: string
        payload: string
        expirationDate: string
        description: string
    } | null
    paymentId?: string | null
    confirmedByCreditCard?: boolean
    isCreditCardError?: boolean
}

type TTicketQRCodeResponse = {
    token: string
}

export type {
    TTicket,
    TTicketBuy,
    TTicketBuyResponse,
    TTicketScanResponse,
    TTicketValidateQrCodeResponse,
    TTicketValidate,
    TTicketScanLinkGenerateResponse,
    TTicketScanLink,
    TTicketScanLinkCreate,
    TTicketScanLinkDelete,
    TTicketQRCodeResponse,
    TTicketForm,
    TTicketValidationInfo,
    TTicketToOrganizer,
    TTicketOrganizerRequestRefundResponse,
    TTicketCustomerRequestRefundResponse
}

export {
    TicketCancelledBy
}