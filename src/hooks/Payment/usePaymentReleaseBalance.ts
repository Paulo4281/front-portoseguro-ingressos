import { useMutationHook } from "../useMutation"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentReleaseBalanceParams, TPaymentReleaseBalanceResponse } from "@/types/Payment/TPayment"

export const usePaymentReleaseBalance = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TPaymentReleaseBalanceParams, TApiResponse<TPaymentReleaseBalanceResponse>>({
        mutationFn: (params) => PaymentService.releaseBalance(params)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}

