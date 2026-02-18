import { useQueryHook } from "../useQuery"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentMySalesItem } from "@/types/Payment/TPayment"

export const usePaymentMySales = () => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TPaymentMySalesItem[]>>({
        queryKey: ["payment", "my-sales"],
        queryFn: () => PaymentService.mySales()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
