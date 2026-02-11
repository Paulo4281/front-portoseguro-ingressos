import { useMutationHook } from "../useMutation"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TVerifyInviteResponse } from "@/types/Resale/TResale"

export const useResaleVerifyInvite = () => {
    const { mutateAsync, isPending } = useMutationHook<string, TApiResponse<TVerifyInviteResponse>>({
        mutationFn: (code: string) => ResaleService.verifyInvite(code)
    })

    return {
        mutateAsync,
        isPending
    }
}
