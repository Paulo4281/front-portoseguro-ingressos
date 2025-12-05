import { useMutationHook } from "../useMutation"
import { SupportService } from "@/services/Support/SupportService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSupportCreate, TSupport } from "@/types/Support/TSupport"
import { useQueryClient } from "@tanstack/react-query"

export const useSupportCreate = () => {
    const queryClient = useQueryClient()

    return useMutationHook<TSupportCreate, TApiResponse<TSupport>>({
        mutationFn: (data: TSupportCreate) => SupportService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["support", "find"] })
        }
    })
}

