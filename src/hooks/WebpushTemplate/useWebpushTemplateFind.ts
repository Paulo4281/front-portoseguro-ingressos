import { useQueryHook } from "../useQuery"
import { WebpushTemplateService } from "@/services/CRM/WebpushTemplateService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushTemplateListResponse } from "@/types/Webpush/TWebpushTemplate"

export const useWebpushTemplateFind = () => {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQueryHook<TApiResponse<TWebpushTemplateListResponse>>({
        queryKey: ["webpush-template", "find"],
        queryFn: () => WebpushTemplateService.findAll()
    })

    return {
        data,
        isLoading,
        error,
        refetch
    }
}
