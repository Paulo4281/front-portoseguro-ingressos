import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TEventSalesReport } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseEventGenerateSalesReportParams = {
    eventId: string
    eventDateId?: string
    enabled?: boolean
}

export const useEventGenerateSalesReport = ({ eventId, eventDateId, enabled = true }: TUseEventGenerateSalesReportParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TEventSalesReport>>({
        queryKey: ["event", "sales-report", eventId, eventDateId ?? ""],
        queryFn: () => EventService.generateSalesReport(eventId, eventDateId),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

