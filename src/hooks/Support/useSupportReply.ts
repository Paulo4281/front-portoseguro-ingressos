import { useMutationHook } from "../useMutation"
import { SupportService } from "@/services/Support/SupportService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSupportReply } from "@/types/Support/TSupport"
import { useQueryClient } from "@tanstack/react-query"

export const useSupportReply = () => {
    const queryClient = useQueryClient()

    return useMutationHook<TSupportReply, TApiResponse>({
        mutationFn: (data: TSupportReply) => SupportService.reply(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["support", "find", "admin"] })
        }
    })
}

