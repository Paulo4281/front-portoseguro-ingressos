import { useMutationHook } from "../useMutation"
import { TagClientService } from "@/services/CRM/TagClientService"
import type { TApiResponse } from "@/types/TApiResponse"
import { useQueryClient } from "@tanstack/react-query"

export const useTagClientDelete = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (id: string) => TagClientService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tags"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

