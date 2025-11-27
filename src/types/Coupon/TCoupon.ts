type TCoupon = {
    id: string
    code: string
    discountType: "PERCENTAGE" | "FIXED"
    discountValue: number
    expirationDate?: string | null
    usageLimit?: number | null
    usageCount: number
    isActive: boolean
    eventId: string
    eventName: string
    createdAt: string
    updatedAt?: string | null
}

type TCouponCheckRequest = {
    code: string
    eventId: string
}

type TCouponCheckResponse = {
    id: string
    discountType: "PERCENTAGE" | "FIXED"
    discountValue: number
}

export type {
    TCoupon,
    TCouponCheckResponse,
    TCouponCheckRequest
}