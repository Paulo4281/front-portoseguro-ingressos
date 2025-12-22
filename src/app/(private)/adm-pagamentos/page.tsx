import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Pagamentos | Porto Seguro Ingressos",
    description: "",
}

import { AdmPagamentosPannel } from "@/components/Pages/Private/AdmPagamentos/AdmPagamentosPannel"

const AdmPagamentosPage = () => {
    return (
        <>
        <AdmPagamentosPannel />
        </>
    )
}

export default AdmPagamentosPage