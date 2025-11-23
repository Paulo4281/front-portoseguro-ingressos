import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"
import type { TEventSalesReport } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseEventGenerateSalesReportParams = {
    eventId: string
    enabled?: boolean
}

export const useEventGenerateSalesReport = ({ eventId, enabled = true }: TUseEventGenerateSalesReportParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TEventSalesReport>>({
        queryKey: ["event", "sales-report", eventId],
        queryFn: () => eventService.generateSalesReport(eventId),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

