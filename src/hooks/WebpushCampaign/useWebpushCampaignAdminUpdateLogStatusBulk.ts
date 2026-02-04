import { useMutationHook } from "../useMutation"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignAdminBulkUpdateStatusPayload, TWebpushCampaignAdminBulkUpdateStatusResponse } from "@/types/Webpush/TWebpushCampaignAdmin"

export const useWebpushCampaignAdminUpdateLogStatusBulk = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TWebpushCampaignAdminBulkUpdateStatusPayload, TApiResponse<TWebpushCampaignAdminBulkUpdateStatusResponse>>({
        mutationFn: (data) => WebpushCampaignService.updateLogStatusBulk(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
