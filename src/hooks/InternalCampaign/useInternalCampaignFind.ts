import { useQueryHook } from "../useQuery"
import { InternalCampaignService } from "@/services/InternalCampaign/InternalCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TInternalCampaignListItem, TInternalCampaignPaginatedResponse } from "@/types/InternalCampaign/TInternalCampaign"

type TUseInternalCampaignFindParams = {
    offset?: number
}

export const useInternalCampaignFind = (params?: TUseInternalCampaignFindParams) => {
    const offset = params?.offset ?? 0

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TInternalCampaignPaginatedResponse & { data: Array<TInternalCampaignListItem & { link: string }> }>>({
        queryKey: ["internal-campaigns", String(offset)],
        queryFn: () => InternalCampaignService.find(offset)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
