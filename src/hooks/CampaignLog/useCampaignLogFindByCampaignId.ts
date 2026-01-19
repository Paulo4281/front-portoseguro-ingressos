import { useQueryHook } from "../useQuery"
import { CampaignLogService } from "@/services/CRM/CampaignLogService"
import type { TCampaignLog } from "@/types/CampaignLog/TCampaignLog"
import type { TApiResponse } from "@/types/TApiResponse"

export const useCampaignLogFindByCampaignId = (campaignId: string | undefined) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TCampaignLog[]>>({
        queryKey: ["campaign-logs", campaignId || ""],
        queryFn: () => CampaignLogService.findByCampaignId(campaignId!),
        enabled: !!campaignId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

