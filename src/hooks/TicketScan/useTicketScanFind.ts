import { useQuery } from "@tanstack/react-query"
import { TicketScanService } from "@/services/TicketScan/TicketScanService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketScanPublic } from "@/types/TicketScan/TTicketScan"

export const useTicketScanFind = (enabled: boolean = true) => {
    return useQuery<TApiResponse<TTicketScanPublic[]>>({
        queryKey: ["ticket-scan-list"],
        queryFn: async () => {
            const response = await TicketScanService.list()
            return response
        },
        enabled
    })
}
