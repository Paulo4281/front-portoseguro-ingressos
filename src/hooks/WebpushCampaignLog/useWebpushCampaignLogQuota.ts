import { useQueryHook } from "../useQuery"
import { WebpushCampaignLogService } from "@/services/CRM/WebpushCampaignLogService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignLogQuota } from "@/types/Webpush/TWebpushCampaignLog"

export const useWebpushCampaignLogQuota = () => {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQueryHook<TApiResponse<TWebpushCampaignLogQuota>>({
        queryKey: ["webpush-campaign-log", "quota"],
        queryFn: () => WebpushCampaignLogService.getQuota()
    })

    return {
        data,
        isLoading,
        error,
        refetch
    }
}
