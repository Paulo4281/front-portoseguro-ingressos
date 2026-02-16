import { useQueryHook } from "../useQuery"
import { ClientService } from "@/services/Client/ClientService"
import type { TFindOrganizerClientsResponse } from "@/types/Client/TClient"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseOrganizerFindClientsParams = {
    offset?: number
    search?: string
    isSeller?: boolean
}

export const useOrganizerFindClients = (params?: TUseOrganizerFindClientsParams) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TFindOrganizerClientsResponse>>({
        queryKey: ["clients", params?.offset?.toString() || "", params?.search || ""],
        queryFn: () => ClientService.findOrganizerClients(params),
        enabled: params?.isSeller
    })  

    return {
        data,
        isLoading,
        isError
    }
}