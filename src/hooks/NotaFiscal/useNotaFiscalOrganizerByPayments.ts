import { useQueries } from "@tanstack/react-query"
import { useMemo } from "react"
import { NotaFiscalService } from "@/services/NotaFiscal/NotaFiscalService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TNotaFiscal } from "@/types/NotaFiscal/TNotaFiscal"

type TUseNotaFiscalOrganizerByPaymentsParams = {
    paymentIds: string[]
    enabled?: boolean
}

export const useNotaFiscalOrganizerByPayments = ({
    paymentIds,
    enabled = true
}: TUseNotaFiscalOrganizerByPaymentsParams) => {
    const uniqueIds = useMemo(() => [...new Set(paymentIds)].filter(Boolean), [paymentIds])

    const results = useQueries({
        queries: uniqueIds.map((paymentId) => ({
            queryKey: ["notafiscal", "organizer-by-payment", paymentId],
            queryFn: () => NotaFiscalService.listOrganizerByPayment(paymentId),
            enabled: enabled && !!paymentId
        }))
    })

    const dataByPaymentId = useMemo(() => {
        const map: Record<string, TNotaFiscal | undefined> = {}
        results.forEach((result, index) => {
            const paymentId = uniqueIds[index]
            if (!paymentId) return
            const response = result.data as TApiResponse<TNotaFiscal[]> | undefined
            const list = response?.data ?? []
            map[paymentId] = list.length > 0 ? list[0] : undefined
        })
        return map
    }, [results, uniqueIds])

    const isLoading = results.some((r) => r.isLoading)
    const refetch = () => results.forEach((r) => r.refetch())

    return {
        dataByPaymentId,
        isLoading,
        refetch
    }
}
