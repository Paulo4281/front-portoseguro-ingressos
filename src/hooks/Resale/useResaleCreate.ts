import { useMutationHook } from "../useMutation"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResale, TResaleCreatePayload } from "@/types/Resale/TResale"
import { useQueryClient } from "@tanstack/react-query"

export const useResaleCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TResaleCreatePayload, TApiResponse<TResale>>({
        mutationFn: (data: TResaleCreatePayload) => ResaleService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resales"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
