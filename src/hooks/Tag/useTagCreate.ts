import { useMutationHook } from "../useMutation"
import { TagService } from "@/services/CRM/TagService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTagCreate, TTagResponse } from "@/types/Tag/TTag"
import { useQueryClient } from "@tanstack/react-query"

export const useTagCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TTagCreate, TApiResponse<TTagResponse>>({
        mutationFn: (data: TTagCreate) => TagService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

