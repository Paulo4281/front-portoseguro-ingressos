import { useMutationHook } from "../useMutation"
import { CouponService } from "@/services/Coupon/CouponService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useCouponDelete = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (id: string) => CouponService.deleteById(id)
    })

    return {
        mutateAsync,
        isPending
    }
}