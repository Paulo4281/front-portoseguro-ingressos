import { useMutationHook } from "../useMutation"
import { PayoutService } from "@/services/Payout/PayoutService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPayoutWithdrawResponse } from "@/types/Payout/TPayout"

export const usePayoutWithdraw = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<void, TApiResponse<TPayoutWithdrawResponse>>({
        mutationFn: () => PayoutService.withdraw()
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}

