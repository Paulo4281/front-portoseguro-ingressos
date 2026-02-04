import { useMutationHook } from "../useMutation"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaignAdminSendNowResponse } from "@/types/Campaign/TCampaignAdmin"

export const useCampaignAdminSendNow = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<TCampaignAdminSendNowResponse>>({
        mutationFn: (campaignId) => CampaignService.sendNow(campaignId)
    })

    return {
        mutateAsync,
        isPending
    }
}
