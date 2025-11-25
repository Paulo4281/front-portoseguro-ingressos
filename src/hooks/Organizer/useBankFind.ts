import { useQueryHook } from "../useQuery"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TBank } from "@/types/Organizer/TOrganizer"
import type { TApiResponse } from "@/types/TApiResponse"

export const useBankFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TBank[]>>({
        queryKey: ["banks"],
        queryFn: () => OrganizerService.findBanks()
    })

    return {
        data,
        isLoading,
        isError
    }
}

