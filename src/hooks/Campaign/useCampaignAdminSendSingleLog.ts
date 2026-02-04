import { useMutationHook } from "../useMutation"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaignAdminSendSingleResponse } from "@/types/Campaign/TCampaignAdmin"

export const useCampaignAdminSendSingleLog = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<TCampaignAdminSendSingleResponse>>({
        mutationFn: (campaignLogId) => CampaignService.sendSingleLog(campaignLogId)
    })

    return {
        mutateAsync,
        isPending
    }
}
