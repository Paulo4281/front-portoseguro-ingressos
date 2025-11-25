import { useQueryHook } from "../useQuery"
import { LeadService } from "@/services/Lead/LeadService"
import type { TLead } from "@/types/Lead/TLead"
import type { TApiResponse } from "@/types/TApiResponse"

export const useLeadFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TLead[]>>({
        queryKey: ["leads"],
        queryFn: () => LeadService.find()
    })  

    return {
        data,
        isLoading,
        isError
    }
}