import { useQueryHook } from "../useQuery"
import { PartnerService } from "@/services/Partner/PartnerService"
import type { TPartner } from "@/types/Partner/TPartner"
import type { TApiResponse } from "@/types/TApiResponse"

export const usePartnerFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TPartner[]>>({
        queryKey: ["partners"],
        queryFn: () => PartnerService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}
