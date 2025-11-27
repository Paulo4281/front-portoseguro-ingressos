import { useMutationHook } from "../useMutation"
import { CouponService } from "@/services/Coupon/CouponService"
import type { TApiResponse } from "@/types/TApiResponse"

type TCouponUpdatePayload = {
    code?: string
    discountType?: "PERCENTAGE" | "FIXED"
    discountValue?: number
    expirationDate?: string | null
    usageLimit?: number | null
}

type TCouponUpdateParams = {
    id: string
    data: TCouponUpdatePayload
}

export const useCouponUpdate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TCouponUpdateParams, TApiResponse>({
        mutationFn: ({ id, data }: TCouponUpdateParams) => CouponService.update(id, data)
    })

    return {
        mutateAsync,
        isPending
    }
}

