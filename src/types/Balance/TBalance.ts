export type TBalanceResponse = {
    currentValue: number
    balances: {
        value: number
        description: string | null
        createdAt: string
    }[]
}

export type TBalanceDatesAdminListResponse = {
    date: string
}

export type TBalanceVerifyBalanceIsReleasedResponse = {
    isReleased: boolean
}

/** Resposta do saldo atual do revendedor (GET /resale/seller-balance/current) */
export type TSellerBalanceEntry = {
    value: number
    paymentId: string
    withdrawalAuthorized: boolean
    createdAt: string
    eventName: string | null
    installmentDescription: string | null
    /** Data prevista para liberação do valor (quando withdrawalAuthorized ainda é false) */
    estimatedCreditDate: string | null
}

export type TSellerBalanceResponse = {
    currentValue: number
    balances: TSellerBalanceEntry[]
}

