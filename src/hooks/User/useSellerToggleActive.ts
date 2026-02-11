import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TToggleSellerActivePayload = {
    sellerId: string
    sellerActive: boolean
}

export const useSellerToggleActive = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<TToggleSellerActivePayload, TApiResponse>({
        mutationFn: (data: TToggleSellerActivePayload) => UserService.toggleSellerActive(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sellers"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
