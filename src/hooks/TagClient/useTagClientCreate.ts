import { useMutationHook } from "../useMutation"
import { TagClientService } from "@/services/CRM/TagClientService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTagClientCreate, TTagClientResponse } from "@/types/TagClient/TTagClient"
import { useQueryClient } from "@tanstack/react-query"

export const useTagClientCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TTagClientCreate, TApiResponse<TTagClientResponse>>({
        mutationFn: (data: TTagClientCreate) => TagClientService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

