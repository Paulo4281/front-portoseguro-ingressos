import { useQueryHook } from "../useQuery"
import { AccessService } from "@/services/Access/AccessService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TLoginLogListResponse } from "@/types/Access/TAccess"

type TUseAccessListParams = {
    offset?: number
    from?: string
    to?: string
}

export const useAccessList = (params?: TUseAccessListParams) => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TLoginLogListResponse>>({
        queryKey: [
            "access",
            "list",
            (params?.offset ?? 0).toString(),
            params?.from ?? "",
            params?.to ?? ""
        ],
        queryFn: () => AccessService.list({
            offset: params?.offset ?? 0,
            from: params?.from,
            to: params?.to
        })
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

