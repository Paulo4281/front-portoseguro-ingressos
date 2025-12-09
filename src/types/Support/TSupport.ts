type TSupportSubject = 
    | "ACCOUNT_ISSUES"
    | "PAYMENT_ISSUES"
    | "EVENT_MANAGEMENT"
    | "EVENT_POSTPONEMENT"
    | "EVENT_CANCELLATION"
    | "TICKET_SALES"
    | "TECHNICAL_ISSUES"
    | "FEATURE_REQUEST"
    | "OTHER"

type TSupportStatus = "PENDING" | "NOT_SOLVED" | "SOLVED"

type TSupport = {
    id: string
    code: string
    subject: TSupportSubject
    description: string
    additionalInfo?: any | null
    image?: string | null
    status: TSupportStatus
    answer?: string | null
    answerAt?: string | null
    answeredBy?: string | null
    userId: string
    createdAt: string
    updatedAt?: string | null
    User?: {
        id: string
        firstName: string
        lastName: string
        email: string
    }
}

type TSupportCreate = {
    subject: TSupportSubject
    description: string
    image?: File | null
    additionalInfo?: any
}

type TSupportFindOrganizerParams = {
    offset?: number
    status?: TSupportStatus
}

type TSupportFindAdminParams = {
    offset?: number
    status?: TSupportStatus
    subject?: TSupportSubject
    userId?: string
}

type TSupportReply = {
    id: string
    answer: string
}

type TSupportUpdateStatus = {
    id: string
    status: TSupportStatus
}

type TPaginatedResponse<T> = {
    data: T[]
    total: number
    offset: number
    limit: number
}

type TSupportFindResponse = TPaginatedResponse<TSupport>

export type {
    TSupport,
    TSupportCreate,
    TSupportFindResponse,
    TSupportFindOrganizerParams,
    TSupportFindAdminParams,
    TSupportReply,
    TSupportUpdateStatus,
    TSupportSubject,
    TSupportStatus,
    TPaginatedResponse
}
