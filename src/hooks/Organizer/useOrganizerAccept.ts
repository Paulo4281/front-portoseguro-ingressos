import { useMutationHook } from "../useMutation"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOrganizerAccept = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<{ organizerId: string }, TApiResponse>({
        mutationFn: (organizerId: string) => OrganizerService.acceptOrganizer(organizerId)
    })

    return {
        mutateAsync,
        isPending
    }
}

