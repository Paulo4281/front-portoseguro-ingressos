import { useMutationHook } from "../useMutation"
import { useQueryClient } from "@tanstack/react-query"
import { InternalCampaignService } from "@/services/InternalCampaign/InternalCampaignService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useInternalCampaignDelete = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<{ id: string }>>({
        mutationFn: (id: string) => InternalCampaignService.deleteById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["internal-campaigns"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}
