import { useQueryHook } from "../useQuery"
import { BalanceService } from "@/services/Balance/BalanceService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TBalanceVerifyBalanceIsReleasedResponse } from "@/types/Balance/TBalance"

export const useBalanceVerifyIsReleased = (eventId: string | null, enabled: boolean = true) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TBalanceVerifyBalanceIsReleasedResponse>>({
        queryKey: ["balance", "verify-is-released", eventId || ""],
        queryFn: () => BalanceService.verifyBalanceIsReleased(eventId!),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

