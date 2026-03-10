import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { InternalCampaignService } from "@/services/InternalCampaign/InternalCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TInternalCampaign, TInternalCampaignUpdate } from "@/types/InternalCampaign/TInternalCampaign"

export const useInternalCampaignUpdate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TInternalCampaignUpdate, TApiResponse<TInternalCampaign & { link: string }>>({
        mutationFn: (data: TInternalCampaignUpdate) => InternalCampaignService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["internal-campaigns"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
