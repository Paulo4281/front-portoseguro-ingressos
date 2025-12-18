import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketValidateQrCodeResponse } from "@/types/Ticket/TTicket"

type TTicketValidateQrcodeOrganizerInput = {
    qrcodeToken: string
    method: "qr-scan" | "qr-image"
}

export const useTicketValidateQrcodeOrganizer = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketValidateQrcodeOrganizerInput, TApiResponse<TTicketValidateQrCodeResponse>>({
        mutationFn: ({ qrcodeToken, method }: TTicketValidateQrcodeOrganizerInput) => TicketService.validateTicketQrCodeOrganizer(qrcodeToken, method)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}


