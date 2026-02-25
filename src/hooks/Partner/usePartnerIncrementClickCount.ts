import { useMutationHook } from "../useMutation"
import { PartnerService } from "@/services/Partner/PartnerService"
import type { TPartnerIncrementClickCount } from "@/types/Partner/TPartner"
import type { TApiResponse } from "@/types/TApiResponse"

export const usePartnerIncrementClickCount = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TPartnerIncrementClickCount, TApiResponse>({
        mutationFn: (data: TPartnerIncrementClickCount) => PartnerService.incrementClickCount(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
