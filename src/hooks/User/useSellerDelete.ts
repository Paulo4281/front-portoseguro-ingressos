import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TDeleteSellerPayload = {
    sellerId: string
}

export const useSellerDelete = () => {
    const queryClient = useQueryClient()

    const { mutateAsync, isPending } = useMutationHook<TDeleteSellerPayload, TApiResponse>({
        mutationFn: (data: TDeleteSellerPayload) => UserService.deleteSeller(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sellers"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
