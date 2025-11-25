import { useQueryHook } from "../useQuery"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TOrganizer } from "@/types/Organizer/TOrganizer"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOrganizerFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TOrganizer>>({
        queryKey: ["organizer"],
        queryFn: () => OrganizerService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}

