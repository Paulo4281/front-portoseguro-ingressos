import { useQueryHook } from "../useQuery"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TUser } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"

type TFindOrganizersParams = {
    offset?: number
    name?: string
    verificationStatus?: "PENDING" | "APPROVED" | "REJECTED"
    createdAt?: string
}

type TPaginatedResponse<T> = {
    data: T[]
    total: number
    offset: number
    limit: number
}

export const useOrganizerFind = (params?: TFindOrganizersParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TPaginatedResponse<TUser>>>({
        queryKey: ["organizers", JSON.stringify(params)],
        queryFn: () => OrganizerService.find(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

