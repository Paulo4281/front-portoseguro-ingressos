import { useMutationHook } from "../useMutation"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentRefundParams } from "@/types/Payment/TPayment"

export const usePaymentRefund = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<{ billingId: string, params?: TPaymentRefundParams }, TApiResponse<any>>({
        mutationFn: ({ billingId, params }: { billingId: string, params?: TPaymentRefundParams }) => PaymentService.refundPix({ billingId, params })
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}