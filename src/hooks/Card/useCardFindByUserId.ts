import { useQueryHook } from "../useQuery"
import { CardService } from "@/services/Payment/CardService"
import type { TCard } from "@/types/Card/TCard"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseCardFindByUserIdParams = {
    enabled?: boolean
}

export const useCardFindByUserId = (params?: TUseCardFindByUserIdParams) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TCard[]>>({
        queryKey: ["cards", "user"],
        queryFn: () => CardService.findByUserId(),
        enabled: params?.enabled !== false
    })

    return {
        data,
        isLoading,
        isError,
    }
}