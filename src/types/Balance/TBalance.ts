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

