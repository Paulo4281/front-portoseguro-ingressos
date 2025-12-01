type TWallet = {
    value: number
}

type TWalletHistory = {
    date: string
    value: number
    type: "RECEIVED" | "PAYOUT"
    eventName?: string
}

export type {
    TWallet,
    TWalletHistory
}