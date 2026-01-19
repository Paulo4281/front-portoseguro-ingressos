import { useQueryHook } from "../useQuery"
import { TemplateService } from "@/services/CRM/TemplateService"
import type { TTemplateListResponse } from "@/types/Template/TTemplate"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTemplateFind = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TTemplateListResponse>>({
        queryKey: ["templates"],
        queryFn: () => TemplateService.findAll()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

