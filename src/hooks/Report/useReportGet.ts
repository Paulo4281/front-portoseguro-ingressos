import { useQuery } from "@tanstack/react-query"
import { ReportService } from "@/services/CRM/ReportService"
import type { TReportFilters } from "@/types/Report/TReport"

export const useReportGet = (filters?: TReportFilters) => {
    return useQuery({
        queryKey: ["report", filters],
        queryFn: () => ReportService.getReports(filters),
        staleTime: 1000 * 60 * 5
    })
}

