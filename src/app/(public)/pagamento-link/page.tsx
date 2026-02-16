import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pagamento Link | Porto Seguro Ingressos",
    description: "Pagamento via link de pagamento",
}

import { PagamentoLinkInfo } from "@/components/Pages/Public/PagamentoLink/PagamentoLinkInfo"

const PagamentoLinkPage = () => {
    return (
        <>
        <PagamentoLinkInfo />
        </>
    )
}

export default PagamentoLinkPage