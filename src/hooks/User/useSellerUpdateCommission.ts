import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TUpdateSellerCommissionPayload = {
    sellerId: string
    sellerCommissionRate: number
}

export const useSellerUpdateCommission = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<TUpdateSellerCommissionPayload, TApiResponse>({
        mutationFn: (data: TUpdateSellerCommissionPayload) => UserService.updateSeller(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sellers"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
