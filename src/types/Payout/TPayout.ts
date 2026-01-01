export const PayoutStatus = [
    "PROCESSING",
    "PAID",
    "FAILED"
] as const

export type TPayoutStatus = typeof PayoutStatus[number]

export type TPayoutListResponse = {
    value: number
    paidAt: string | null
    createdAt: string
}

export type TPayoutWithdrawResponse = {
    status: TPayoutStatus
}

