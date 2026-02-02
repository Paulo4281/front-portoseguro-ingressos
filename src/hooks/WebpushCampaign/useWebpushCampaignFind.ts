import { useQueryHook } from "../useQuery"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignListResponse } from "@/types/Webpush/TWebpushCampaign"

type TUseWebpushCampaignFindParams = {
    offset?: number
}

export const useWebpushCampaignFind = ({ offset = 0 }: TUseWebpushCampaignFindParams) => {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQueryHook<TApiResponse<TWebpushCampaignListResponse>>({
        queryKey: ["webpush-campaign", "find", offset],
        queryFn: () => WebpushCampaignService.findAll(offset)
    })

    return {
        data,
        isLoading,
        error,
        refetch
    }
}
