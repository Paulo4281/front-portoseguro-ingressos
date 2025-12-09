import { useMutationHook } from "../useMutation"
import { SupportService } from "@/services/Support/SupportService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSupportUpdateStatus } from "@/types/Support/TSupport"
import { useQueryClient } from "@tanstack/react-query"

export const useSupportUpdateStatus = () => {
    const queryClient = useQueryClient()

    return useMutationHook<TSupportUpdateStatus, TApiResponse>({
        mutationFn: (data: TSupportUpdateStatus) => SupportService.updateStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["support", "find", "admin"] })
        }
    })
}

