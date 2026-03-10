import { useQueryHook } from "../useQuery"
import { NotaFiscalService } from "@/services/NotaFiscal/NotaFiscalService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TNotaFiscalLinkResponse } from "@/types/NotaFiscal/TNotaFiscal"

type TNotaFiscalClientLinksResponse = {
    pdfLink: string | null
    xmlLink: string | null
}

type TUseNotaFiscalFindClientLinksParams = {
    paymentId?: string | null
    enabled?: boolean
}

export const useNotaFiscalFindClientLinks = ({
    paymentId,
    enabled = true
}: TUseNotaFiscalFindClientLinksParams) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TNotaFiscalClientLinksResponse>>({
        queryKey: ["notafiscal", "client-links", paymentId || ""],
        queryFn: async () => {
            if (!paymentId) {
                return {
                    success: true,
                    data: {
                        pdfLink: null,
                        xmlLink: null
                    }
                }
            }

            const [pdfResponse, xmlResponse] = await Promise.all([
                NotaFiscalService.getPdfLinkByClientPaymentId(paymentId),
                NotaFiscalService.getXmlLinkByClientPaymentId(paymentId)
            ])

            return {
                success: true,
                data: {
                    pdfLink: (pdfResponse as TApiResponse<TNotaFiscalLinkResponse>)?.data?.link ?? null,
                    xmlLink: (xmlResponse as TApiResponse<TNotaFiscalLinkResponse>)?.data?.link ?? null
                }
            }
        },
        enabled: enabled && !!paymentId
    })

    return {
        data,
        isLoading,
        isError
    }
}
