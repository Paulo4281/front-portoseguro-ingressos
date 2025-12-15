import { useQueryHook } from "../useQuery"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentAdminListResponse } from "@/types/Payment/TPayment"

type TUsePaymentAdminListParams = {
    offset?: number
    status?: "RECEIVED" | "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED" | "OVERDUE"
}

type TListPaymentsResponse = {
    data: TPaymentAdminListResponse[]
    total: number
    limit: number
    offset: number
}

export const usePaymentAdminList = (params?: TUsePaymentAdminListParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TListPaymentsResponse>>({
        queryKey: ["payment", "admin", "list", params?.offset?.toString() || "", params?.status || ""],
        queryFn: () => PaymentService.listPayments(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}