import { useQueryHook } from "../useQuery"
import { CampaignService } from "@/services/CRM/CampaignService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaignAdminListResponse } from "@/types/Campaign/TCampaignAdmin"

type TUseCampaignAdminListParams = {
    offset?: number
    userId?: string
    startDate?: string
    endDate?: string
}

export const useCampaignAdminList = (params: TUseCampaignAdminListParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TCampaignAdminListResponse>>({
        queryKey: [
            "campaigns-admin",
            params.offset?.toString() || "0",
            params.userId || "",
            params.startDate || "",
            params.endDate || ""
        ],
        queryFn: () => CampaignService.findAllAdmin(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
