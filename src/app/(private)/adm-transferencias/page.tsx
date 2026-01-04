import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Transferências | Porto Seguro Ingressos",
    description: "Visualize e gerencie todas as transferências da plataforma. Visualize as transferências, as transações externas e as transações internas.",
}

import { AdmTransferenciasPannel } from "@/components/Pages/Private/AdmTransferencias/AdmTransferenciasPannel"

const AdmTransferenciasPage = () => {
    return (
        <>
        <AdmTransferenciasPannel />
        </>
    )
}

export default AdmTransferenciasPage