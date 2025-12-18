import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketValidateQrCodeResponse } from "@/types/Ticket/TTicket"

type TTicketValidateQrcodeWorkerInput = {
    qrcodeToken: string
    method: "qr-scan" | "qr-image"
}

export const useTicketValidateQrcodeWorker = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketValidateQrcodeWorkerInput, TApiResponse<TTicketValidateQrCodeResponse>>({
        mutationFn: ({ qrcodeToken, method }: TTicketValidateQrcodeWorkerInput) => TicketService.validateTicketQrCodeWorker(qrcodeToken, method)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}


