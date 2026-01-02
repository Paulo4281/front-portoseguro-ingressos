export const PayoutStatus = [
    "PROCESSING",
    "PAID",
    "FAILED"
] as const

export const PayoutMethod = [
    "PIX",
    "BANK_TRANSFER"
] as const

export type TPayoutStatus = typeof PayoutStatus[number]
export type TPayoutMethod = typeof PayoutMethod[number]

export type TPayoutListResponse = {
    value: number
    paidAt: string | null
    createdAt: string
}

export type TPayoutWithdrawResponse = {
    status: TPayoutStatus
}

export type TPayoutAdminListResponse = {
    id: string
    grossValue: number
    netValue: number
    transactionFee: number
    status: TPayoutStatus
    method: TPayoutMethod
    transferObject: any | null
    failReason: string | null
    externalTransactionId: string | null
    paidAt: string | null
    userId: string
    createdAt: string
    updatedAt: string | null
    User: {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string | null
        document: string | null
        Organizer: {
            id: string
            companyName: string
            companyDocument: string | null
        } | null
    }
}

