import { useQueryHook } from "../useQuery"
import { WebpushCampaignLogService } from "@/services/CRM/WebpushCampaignLogService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignLogListResponse } from "@/types/Webpush/TWebpushCampaignLog"

export const useWebpushCampaignLogFindByCampaignId = (campaignId?: string) => {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQueryHook<TApiResponse<TWebpushCampaignLogListResponse>>({
        queryKey: ["webpush-campaign-log", "find", campaignId],
        queryFn: () => WebpushCampaignLogService.findByCampaignId(campaignId || ""),
        enabled: !!campaignId
    })

    return {
        data,
        isLoading,
        error,
        refetch
    }
}
