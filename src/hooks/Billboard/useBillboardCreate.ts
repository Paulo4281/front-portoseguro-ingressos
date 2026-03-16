import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { BillboardService } from "@/services/Billboard/BillboardService"
import type { TBillboardCreate } from "@/types/Billboard/TBillboard"
import type { TBillboard } from "@/types/Billboard/TBillboard"
import type { TApiResponse } from "@/types/TApiResponse"

export const useBillboardCreate = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<TBillboardCreate, TApiResponse<TBillboard>>({
        mutationFn: (data: TBillboardCreate) => BillboardService.create(data),
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
