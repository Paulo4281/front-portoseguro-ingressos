import { useMutationHook } from "../useMutation"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignAdminUpdateStatusPayload, TWebpushCampaignAdminUpdateStatusResponse } from "@/types/Webpush/TWebpushCampaignAdmin"

type TUpdateLogStatusPayload = {
    campaignLogId: string
    data: TWebpushCampaignAdminUpdateStatusPayload
}

export const useWebpushCampaignAdminUpdateLogStatus = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUpdateLogStatusPayload, TApiResponse<TWebpushCampaignAdminUpdateStatusResponse>>({
        mutationFn: ({ campaignLogId, data }) => WebpushCampaignService.updateLogStatus(campaignLogId, data)
    })

    return {
        mutateAsync,
        isPending
    }
}
