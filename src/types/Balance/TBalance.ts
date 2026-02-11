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
}

export type TSellerBalanceResponse = {
    currentValue: number
    list: TSellerBalanceEntry[]
}

