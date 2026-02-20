import { useMutationHook } from "../useMutation"
import { LeadService } from "@/services/Lead/LeadService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TLead, TLeadCreateRequest } from "@/types/Lead/TLead"

export const useLeadCreate = () => {
    const { mutateAsync, isPending } = useMutationHook<TLeadCreateRequest, TApiResponse<TLead>>({
        mutationFn: (data) => LeadService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

