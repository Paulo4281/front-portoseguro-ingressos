import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { InternalCampaignService } from "@/services/InternalCampaign/InternalCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TInternalCampaign, TInternalCampaignCreate } from "@/types/InternalCampaign/TInternalCampaign"

export const useInternalCampaignCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TInternalCampaignCreate, TApiResponse<TInternalCampaign & { link: string }>>({
        mutationFn: (data: TInternalCampaignCreate) => InternalCampaignService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["internal-campaigns"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
