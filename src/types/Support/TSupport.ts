type TSupportSubject = 
    | "ACCOUNT_ISSUES"
    | "PAYMENT_ISSUES"
    | "EVENT_MANAGEMENT"
    | "TICKET_SALES"
    | "TECHNICAL_PROBLEMS"
    | "FEATURE_REQUEST"
    | "OTHER"

type TSupportStatus = "PENDING" | "ANSWERED"

type TSupport = {
    id: string
    subject: TSupportSubject
    description: string
    image?: string | null
    status: TSupportStatus
    answer?: string | null
    createdAt: string
    updatedAt: string
}

type TSupportCreate = {
    subject: TSupportSubject
    description: string
    image?: File | null
}

type TSupportFindResponse = {
    data: TSupport[]
    total: number
}

export type {
    TSupport,
    TSupportCreate,
    TSupportFindResponse,
    TSupportSubject,
    TSupportStatus
}
