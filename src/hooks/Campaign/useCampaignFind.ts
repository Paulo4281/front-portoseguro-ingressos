import { useQueryHook } from "../useQuery"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TCampaignListResponse } from "@/types/Campaign/TCampaign"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseCampaignFindParams = {
    offset?: number
}

export const useCampaignFind = (params?: TUseCampaignFindParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TCampaignListResponse>>({
        queryKey: ["campaigns", params?.offset?.toString() || "0"],
        queryFn: () => CampaignService.findAll(params?.offset || 0)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

