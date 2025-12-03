import { useQueryHook } from "../useQuery"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TTicketToOrganizer } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseTicketFindToOrganizerParams = {
    eventId: string
    offset?: number
    limit?: number
    search?: string
    status?: string
    enabled?: boolean
}

type TTicketFindToOrganizerResponse = {
    data: TTicketToOrganizer[]
    total: number
    limit: number
    offset: number
}

export const useTicketFindToOrganizer = ({
    eventId,
    offset = 0,
    limit = 30,
    search,
    status,
    enabled = true
}: TUseTicketFindToOrganizerParams) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TTicketFindToOrganizerResponse>>({
        queryKey: ["tickets", "to-organizer", eventId, offset.toString(), limit.toString(), search || "", status || ""],
        queryFn: () => TicketService.findByEventIdToOrganizer(eventId, offset, limit, search, status),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isError,
    }
}