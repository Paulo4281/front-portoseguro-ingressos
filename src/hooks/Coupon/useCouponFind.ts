import { useQueryHook } from "../useQuery"
import { CouponService } from "@/services/Coupon/CouponService"
import type { TCoupon } from "@/types/Coupon/TCoupon"
import type { TApiResponse } from "@/types/TApiResponse"

export const useCouponFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TCoupon[]>>({
        queryKey: ["coupons"],
        queryFn: () => CouponService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}