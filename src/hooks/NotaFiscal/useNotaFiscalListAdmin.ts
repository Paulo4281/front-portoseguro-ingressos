import { useQueryHook } from "../useQuery"
import { NotaFiscalService } from "@/services/NotaFiscal/NotaFiscalService"
import type { TApiResponse } from "@/types/TApiResponse"
import type {
    TNotaFiscalListAdminParams,
    TNotaFiscalListAdminResponse
} from "@/types/NotaFiscal/TNotaFiscal"

type TUseNotaFiscalListAdminParams = TNotaFiscalListAdminParams & {
    enabled?: boolean
}

export const useNotaFiscalListAdmin = ({
    offset = 0,
    status,
    userIdOwner,
    enabled = true
}: TUseNotaFiscalListAdminParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TNotaFiscalListAdminResponse>>({
        queryKey: ["notafiscal", "admin-list", offset.toString(), status || "", userIdOwner || ""],
        queryFn: () => NotaFiscalService.listAdmin({
            offset,
            status,
            userIdOwner
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
