import { useMutationHook } from "../useMutation"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentRefundParams } from "@/types/Payment/TPayment"

export const usePaymentRefundCreditCard = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<{ billingId: string, installmentId: string, params?: TPaymentRefundParams }, TApiResponse<any>>({
        mutationFn: ({ billingId, installmentId, params }: { billingId: string, installmentId: string, params?: TPaymentRefundParams }) => PaymentService.refundCreditCard({ billingId, installmentId, params })
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}

