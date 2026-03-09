import { useQueryHook } from "../useQuery"
import { NotaFiscalService } from "@/services/NotaFiscal/NotaFiscalService"
import type { TApiResponse } from "@/types/TApiResponse"
import type {
    TNotaFiscal,
    TNotaFiscalListOrganizerParams
} from "@/types/NotaFiscal/TNotaFiscal"

type TUseNotaFiscalListOrganizerParams = TNotaFiscalListOrganizerParams & {
    enabled?: boolean
}

export const useNotaFiscalListOrganizer = ({
    status,
    enabled = true
}: TUseNotaFiscalListOrganizerParams = {}) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TNotaFiscal[]>>({
        queryKey: ["notafiscal", "organizer-list", status || ""],
        queryFn: () => NotaFiscalService.listOrganizer({
            status
        }),
        enabled
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
