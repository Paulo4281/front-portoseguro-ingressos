import { useMutationHook } from "../useMutation"
import { TagService } from "@/services/CRM/TagService"
import type { TApiResponse } from "@/types/TApiResponse"
import { useQueryClient } from "@tanstack/react-query"

export const useTagDelete = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (id: string) => TagService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

