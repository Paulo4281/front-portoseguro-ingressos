import { useMutationHook } from "../useMutation"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaignAdminUpdateStatusPayload, TCampaignAdminUpdateStatusResponse } from "@/types/Campaign/TCampaignAdmin"

type TUpdateLogStatusPayload = {
    campaignLogId: string
    data: TCampaignAdminUpdateStatusPayload
}

export const useCampaignAdminUpdateLogStatus = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUpdateLogStatusPayload, TApiResponse<TCampaignAdminUpdateStatusResponse>>({
        mutationFn: ({ campaignLogId, data }) => CampaignService.updateLogStatus(campaignLogId, data)
    })

    return {
        mutateAsync,
        isPending
    }
}
