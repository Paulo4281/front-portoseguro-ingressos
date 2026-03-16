import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { BillboardService } from "@/services/Billboard/BillboardService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useBillboardDelete = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<string, TApiResponse>({
        mutationFn: (id: string) => BillboardService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["billboard-admin"] })
            queryClient.invalidateQueries({ queryKey: ["billboard-client"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
