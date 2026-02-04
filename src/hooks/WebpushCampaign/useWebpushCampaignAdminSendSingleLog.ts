import { useMutationHook } from "../useMutation"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignAdminSendSingleResponse } from "@/types/Webpush/TWebpushCampaignAdmin"

export const useWebpushCampaignAdminSendSingleLog = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<TWebpushCampaignAdminSendSingleResponse>>({
        mutationFn: (campaignLogId) => WebpushCampaignService.sendSingleLog(campaignLogId)
    })

    return {
        mutateAsync,
        isPending
    }
}
