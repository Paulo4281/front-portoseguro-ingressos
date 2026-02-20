import { useQueryHook } from "../useQuery"
import { LeadService } from "@/services/Lead/LeadService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TLead, TLeadFindParams, TPaginatedResponse } from "@/types/Lead/TLead"

export type TUseLeadFindParams = TLeadFindParams & {
    enabled?: boolean
}

export const useLeadFind = (params?: TUseLeadFindParams) => {
    const offset = params?.offset ?? 0

    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TPaginatedResponse<TLead>>>({
        queryKey: ["lead", "find", offset.toString()],
        queryFn: () => LeadService.find({ offset }),
        enabled: params?.enabled ?? true
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

