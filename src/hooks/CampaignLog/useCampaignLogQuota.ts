import { useQueryHook } from "../useQuery"
import { CampaignLogService } from "@/services/CRM/CampaignLogService"
import type { TCampaignQuota } from "@/types/CampaignLog/TCampaignLog"
import type { TApiResponse } from "@/types/TApiResponse"

export const useCampaignLogQuota = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TCampaignQuota>>({
        queryKey: ["campaign-quota"],
        queryFn: () => CampaignLogService.getQuota()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

