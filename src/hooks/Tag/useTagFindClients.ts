import { useQueryHook } from "../useQuery"
import { TagService } from "@/services/CRM/TagService"
import type { TApiResponse } from "@/types/TApiResponse"

type TTagClientInfo = {
    id: string
    userId: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    tagClientId: string
    createdAt: string
}

export const useTagFindClients = (tagId: string | undefined) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TTagClientInfo[]>>({
        queryKey: ["tag-clients", tagId || ""],
        queryFn: () => TagService.findClientsByTagId(tagId!),
        enabled: !!tagId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

export type { TTagClientInfo }

