import { useMutationHook } from "../useMutation"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignAdminSendNowResponse } from "@/types/Webpush/TWebpushCampaignAdmin"

export const useWebpushCampaignAdminSendNow = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<TWebpushCampaignAdminSendNowResponse>>({
        mutationFn: (campaignId) => WebpushCampaignService.sendNow(campaignId)
    })

    return {
        mutateAsync,
        isPending
    }
}
