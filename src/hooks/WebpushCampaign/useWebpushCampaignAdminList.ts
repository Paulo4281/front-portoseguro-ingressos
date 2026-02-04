import { useQueryHook } from "../useQuery"
import { WebpushCampaignService } from "@/services/CRM/WebpushCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignAdminListResponse } from "@/types/Webpush/TWebpushCampaignAdmin"

type TUseWebpushCampaignAdminListParams = {
    offset?: number
    userId?: string
    startDate?: string
    endDate?: string
}

export const useWebpushCampaignAdminList = (params: TUseWebpushCampaignAdminListParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TWebpushCampaignAdminListResponse>>({
        queryKey: [
            "webpush-campaigns-admin",
            params.offset?.toString() || "0",
            params.userId || "",
            params.startDate || "",
            params.endDate || ""
        ],
        queryFn: () => WebpushCampaignService.findAllAdmin(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
