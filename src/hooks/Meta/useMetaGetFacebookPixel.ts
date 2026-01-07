import { useQueryHook } from "../useQuery"
import { MetaService, type TMetaFacebookPixelGetResponse } from "@/services/Meta/MetaService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useMetaGetFacebookPixel = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TMetaFacebookPixelGetResponse>>({
        queryKey: ["meta", "facebook-pixel"],
        queryFn: () => MetaService.getFacebookPixel(),
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

