import type { TCoupon, TCouponCheckRequest } from "@/types/Coupon/TCoupon"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"

type TCouponCreatePayload = {
    code: string
    eventName: string
    eventId?: string
    discountType: TCoupon["discountType"]
    discountValue: number
    expirationDate?: string | null
    usageLimit?: number | null
    minPurchaseValue?: number | null
}

type TCouponUpdatePayload = Partial<Omit<TCoupon, "id" | "createdAt" | "usageCount">> & {
    usageCount?: number
}

const now = new Date()

let mockCoupons: TCoupon[] = [
    {
        id: "cps-001",
        code: "PORTO10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        expirationDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 150,
        usageCount: 87,
        minPurchaseValue: 15000,
        isActive: true,
        eventId: "evt-ax1",
        eventName: "Festival Beira Mar",
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: null
    },
    {
        id: "cps-002",
        code: "SUNSETVIP",
        discountType: "FIXED",
        discountValue: 8000,
        expirationDate: null,
        usageLimit: null,
        usageCount: 42,
        minPurchaseValue: 25000,
        isActive: true,
        eventId: "evt-ax2",
        eventName: "Sunset Privé Trancoso",
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: null
    },
    {
        id: "cps-003",
        code: "CARAIVA20",
        discountType: "PERCENTAGE",
        discountValue: 20,
        expirationDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        usageLimit: 50,
        usageCount: 18,
        minPurchaseValue: null,
        isActive: false,
        eventId: "evt-ax3",
        eventName: "Caraíva Experience",
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: null
    }
]

const generateId = () => `cps-${Math.random().toString(36).substring(2, 10)}`

class CouponServiceClass {
    async find(): Promise<TApiResponse<TCoupon[]>> {
        return {
            success: true,
            data: mockCoupons
        }
    }

    async check(data: TCouponCheckRequest): Promise<AxiosResponse["data"]> {
        console.log(data)
    }

    async create(payload: TCouponCreatePayload): Promise<TApiResponse<TCoupon>> {
        const newCoupon: TCoupon = {
            id: generateId(),
            code: payload.code.toUpperCase(),
            discountType: payload.discountType,
            discountValue: payload.discountValue,
            expirationDate: payload.expirationDate || null,
            usageLimit: payload.usageLimit ?? null,
            usageCount: 0,
            minPurchaseValue: payload.minPurchaseValue ?? null,
            isActive: true,
            eventId: payload.eventId || `evt-${generateId()}`,
            eventName: payload.eventName,
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        mockCoupons = [newCoupon, ...mockCoupons]

        return {
            success: true,
            data: newCoupon
        }
    }

    async update(id: string, payload: TCouponUpdatePayload): Promise<TApiResponse<TCoupon>> {
        const couponIndex = mockCoupons.findIndex((coupon) => coupon.id === id)
        if (couponIndex === -1) {
            return {
                success: false,
                message: "Cupom não encontrado"
            }
        }

        const updatedCoupon: TCoupon = {
            ...mockCoupons[couponIndex],
            ...payload,
            updatedAt: new Date().toISOString()
        }

        mockCoupons[couponIndex] = updatedCoupon

        return {
            success: true,
            data: updatedCoupon
        }
    }
}

export const CouponService = new CouponServiceClass()