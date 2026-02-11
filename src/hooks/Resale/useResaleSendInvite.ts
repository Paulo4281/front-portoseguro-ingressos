import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResaleCreatePayload } from "@/types/Resale/TResale"

export const useResaleSendInvite = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<TResaleCreatePayload, TApiResponse>({
        mutationFn: (data: TResaleCreatePayload) => ResaleService.sendInvite(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seller-invites"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
