import { useMutationHook } from "../useMutation"
import { OrganizerService } from "@/services/Organizer/OrganizerService"
import type { TApiResponse } from "@/types/TApiResponse"
import { useQueryClient } from "@tanstack/react-query"

export const useOrganizerUpdateVerificationStatus = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<{ organizerId: string; status: "APPROVED" | "REJECTED" }, TApiResponse>({
        mutationFn: ({ organizerId, status }) => OrganizerService.updateVerificationStatus(organizerId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["organizers"] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

