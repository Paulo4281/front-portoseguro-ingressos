import { useMutationHook } from "../useMutation"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaign, TCampaignCreate } from "@/types/Campaign/TCampaign"
import { useQueryClient } from "@tanstack/react-query"

export const useCampaignCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TCampaignCreate, TApiResponse<TCampaign>>({
        mutationFn: (data: TCampaignCreate) => CampaignService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["campaigns"] })
            queryClient.invalidateQueries({ queryKey: ["campaign-quota"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

