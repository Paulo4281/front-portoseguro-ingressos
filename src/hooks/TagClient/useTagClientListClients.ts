import { useQueryHook } from "../useQuery"
import { TagClientService } from "@/services/CRM/TagClientService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTagClientListResponse } from "@/types/TagClient/TTagClient"

type TUseTagClientListClientsParams = {
    tagId: string
    enabled?: boolean
}

export const useTagClientListClients = ({ tagId, enabled = true }: TUseTagClientListClientsParams) => {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQueryHook<TApiResponse<TTagClientListResponse[]>>({
        queryKey: ["tag-client", "list-clients", tagId],
        queryFn: () => TagClientService.listClients(tagId),
        enabled: enabled && !!tagId
    })

    return {
        data,
        isLoading,
        error,
        refetch
    }
}

