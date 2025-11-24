type TNotification = {
    id: string
    subject: "EVENT" | "TICKET" | "PAYMENT"
    message: string
    priority: "low" | "medium" | "high"
    createdAt: string
    isRead?: boolean
}

export type {
    TNotification
}