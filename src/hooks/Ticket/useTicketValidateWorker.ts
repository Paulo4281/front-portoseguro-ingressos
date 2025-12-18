import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketValidate } from "@/types/Ticket/TTicket"

type TTicketValidateWorkerInput = {
    ticketId: string
}

export const useTicketValidateWorker = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketValidateWorkerInput, TApiResponse<TTicketValidate>>({
        mutationFn: ({ ticketId }: TTicketValidateWorkerInput) => TicketService.validateTicketWorker(ticketId)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}


