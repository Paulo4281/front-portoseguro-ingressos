import { useMutationHook } from "../useMutation"
import { PartnerService } from "@/services/Partner/PartnerService"
import type { TPartnerUpdate } from "@/types/Partner/TPartner"
import type { TApiResponse } from "@/types/TApiResponse"

export const usePartnerUpdate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TPartnerUpdate, TApiResponse>({
        mutationFn: (data: TPartnerUpdate) => PartnerService.update(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
