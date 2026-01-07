import { useMutationHook } from "../useMutation"
import { MetaService } from "@/services/Meta/MetaService"
import type { TApiResponse } from "@/types/TApiResponse"

type TMetaCheckParams = {
    facebookPixelId: string
    facebookAccessToken: string
}

export const useMetaUpdateFacebookPixel = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TMetaCheckParams, TApiResponse<null>>({
        mutationFn: (params) => MetaService.check(params)
    })

    return {
        mutateAsync,
        isPending
    }
}

