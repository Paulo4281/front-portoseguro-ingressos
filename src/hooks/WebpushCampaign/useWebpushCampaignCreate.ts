import { useMutationHook } from "../useMutation"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaign, TWebpushCampaignCreate } from "@/types/Webpush/TWebpushCampaign"

export const useWebpushCampaignCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TWebpushCampaignCreate, TApiResponse<TWebpushCampaign>>({
        mutationFn: (data) => WebpushCampaignService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
