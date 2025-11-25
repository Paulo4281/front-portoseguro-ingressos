import { useMutationHook } from "../useMutation"
import { CouponService } from "@/services/Coupon/CouponService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useCouponUpdateIsActive = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (id: string) => CouponService.updateIsActive(id)
    })

    return {
        mutateAsync,
        isPending
    }
}

