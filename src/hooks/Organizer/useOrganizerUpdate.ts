import { useMutationHook } from "../useMutation"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TOrganizerUpdate } from "@/validators/Organizer/OrganizerValidator"

export const useOrganizerUpdate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TOrganizerUpdate, TApiResponse>({
        mutationFn: (data: TOrganizerUpdate) => OrganizerService.update(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

