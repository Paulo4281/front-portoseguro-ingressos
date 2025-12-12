import { useQueryHook } from "../useQuery"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentStatusResponse } from "@/types/Payment/TPayment"

export const usePaymentVerifyStatus = (paymentId: string) => {
    const {
        data,
        isLoading,
        isFetching,
        refetch
    } = useQueryHook<TApiResponse<TPaymentStatusResponse>>({
        queryKey: ["payment-verify-status", paymentId],
        queryFn: () => PaymentService.verifyPaymentStatus(paymentId),
        enabled: !!paymentId
    }) 

    return {
        data,
        isLoading,
        isFetching,
        refetch
    }
}