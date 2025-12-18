import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketValidate } from "@/types/Ticket/TTicket"

type TTicketValidateOrganizerInput = {
    ticketId: string
}

export const useTicketValidateOrganizer = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketValidateOrganizerInput, TApiResponse<TTicketValidate>>({
        mutationFn: ({ ticketId }: TTicketValidateOrganizerInput) => TicketService.validateTicketOrganizer(ticketId)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}


