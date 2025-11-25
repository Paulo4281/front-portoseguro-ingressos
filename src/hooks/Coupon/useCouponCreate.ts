import { useMutationHook } from "../useMutation"
import { CouponService } from "@/services/Coupon/CouponService"
import type { TApiResponse } from "@/types/TApiResponse"

type TCouponCreatePayload = {
    code: string
    eventId: string
    discountType: "PERCENTAGE" | "FIXED"
    discountValue: number
    expirationDate?: string | null
    usageLimit?: number | null
    minPurchaseValue?: number | null
}

export const useCouponCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TCouponCreatePayload, TApiResponse>({
        mutationFn: (data: TCouponCreatePayload) => CouponService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

