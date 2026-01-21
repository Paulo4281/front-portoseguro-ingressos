import { useMutationHook } from "../useMutation"
import { TagService } from "@/services/CRM/TagService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTagUpdate } from "@/types/Tag/TTag"
import { useQueryClient } from "@tanstack/react-query"

type TTagUpdateParams = {
    id: string
    data: TTagUpdate
}

export const useTagUpdate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TTagUpdateParams, TApiResponse>({
        mutationFn: ({ id, data }: TTagUpdateParams) => TagService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

