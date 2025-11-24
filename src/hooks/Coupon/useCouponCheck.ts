import { useMutationHook } from "../useMutation"
import { CouponService } from "@/services/Coupon/CouponService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCouponCheckResponse, TCouponCheckRequest } from "@/types/Coupon/TCoupon"

export const useCouponCheck = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TCouponCheckRequest, TApiResponse<TCouponCheckResponse>>({
        mutationFn: (data: TCouponCheckRequest) => CouponService.check(data)
    })

    return {
        mutateAsync,
        isPending
    }
}