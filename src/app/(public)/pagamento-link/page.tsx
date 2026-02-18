import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Pagamento Link | Porto Seguro Ingressos",
    description: "Pagamento via link de pagamento",
}

import { PagamentoLinkInfo } from "@/components/Pages/Public/PagamentoLink/PagamentoLinkInfo"

const PagamentoLinkPage = () => {
    return (
        <Suspense fallback={null}>
            <PagamentoLinkInfo />
        </Suspense>
    )
}

export default PagamentoLinkPage