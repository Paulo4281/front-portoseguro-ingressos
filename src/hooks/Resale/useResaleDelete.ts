import { useMutationHook } from "../useMutation"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import { useQueryClient } from "@tanstack/react-query"

export const useResaleDelete = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (id: string) => ResaleService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seller-invites"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
