import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { BillboardService } from "@/services/Billboard/BillboardService"
import type { TBillboardUpdate } from "@/types/Billboard/TBillboard"
import type { TBillboard } from "@/types/Billboard/TBillboard"
import type { TApiResponse } from "@/types/TApiResponse"

export const useBillboardUpdate = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<TBillboardUpdate, TApiResponse<TBillboard>>({
        mutationFn: (data: TBillboardUpdate) => BillboardService.update(data),
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
