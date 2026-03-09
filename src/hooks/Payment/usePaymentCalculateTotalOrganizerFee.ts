import { useQueryHook } from "../useQuery"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentCalculateTotalOrganizerFeeResponse } from "@/types/Payment/TPayment"

type TUsePaymentCalculateTotalOrganizerFeeParams = {
    userId: string
    yearReference: number
    monthReference: number
    enabled?: boolean
}

export const usePaymentCalculateTotalOrganizerFee = (params: TUsePaymentCalculateTotalOrganizerFeeParams) => {
    const { userId, yearReference, monthReference, enabled = true } = params

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TPaymentCalculateTotalOrganizerFeeResponse>>({
        queryKey: ["payment", "calculate-total-organizer-fee", userId, String(yearReference), String(monthReference)],
        queryFn: () => PaymentService.calculateTotalOrganizerFee({ userId, yearReference, monthReference }),
        enabled: enabled && !!userId && !!yearReference && !!monthReference
    })

    return {
        data: data?.data,
        isLoading,
        isError,
        refetch
    }
}
