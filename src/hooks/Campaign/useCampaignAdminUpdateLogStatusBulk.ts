import { useMutationHook } from "../useMutation"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaignAdminBulkUpdateStatusPayload, TCampaignAdminBulkUpdateStatusResponse } from "@/types/Campaign/TCampaignAdmin"

export const useCampaignAdminUpdateLogStatusBulk = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TCampaignAdminBulkUpdateStatusPayload, TApiResponse<TCampaignAdminBulkUpdateStatusResponse>>({
        mutationFn: (data) => CampaignService.updateLogStatusBulk(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
