import { useQueryHook } from "../useQuery"
import { ClientService } from "@/services/Client/ClientService"
import type { TFindOrganizerClientsCrmResponse } from "@/types/Client/TClient"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseOrganizerFindClientsCrmParams = {
    offset: number
    search?: string
    tagId?: string
    eventId?: string
}

export const useOrganizerFindClientsCrm = (params: TUseOrganizerFindClientsCrmParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TFindOrganizerClientsCrmResponse>>({
        queryKey: ["clients-crm", params.offset.toString(), params.search || "", params.tagId || "", params.eventId || ""],
        queryFn: () => ClientService.findOrganizerClientsCrm(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

