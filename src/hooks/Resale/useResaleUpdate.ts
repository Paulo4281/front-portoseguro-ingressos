import { useMutationHook } from "../useMutation"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResale, TResaleUpdatePayload } from "@/types/Resale/TResale"
import { useQueryClient } from "@tanstack/react-query"

type TResaleUpdateParams = {
    id: string
    data: TResaleUpdatePayload
}

export const useResaleUpdate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TResaleUpdateParams, TApiResponse<TResale>>({
        mutationFn: ({ id, data }: TResaleUpdateParams) => ResaleService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resales"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
