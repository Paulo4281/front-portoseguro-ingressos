import { useMutationHook } from "../useMutation"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOrganizerReject = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<{ organizerId: string }, TApiResponse>({
        mutationFn: ({ organizerId }) => OrganizerService.rejectOrganizer(organizerId)
    })

    return {
        mutateAsync,
        isPending
    }
}

