import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Notas Fiscais | Porto Seguro Ingressos",
    description: ""
}

import { AdmNotasFiscaisPannel } from "@/components/Pages/Private/AdmNotasFiscais/AdmNotasFiscaisPannel"

const AdmNotasFiscaisPage = () => {
    return (
        <>
        <AdmNotasFiscaisPannel />
        </>
    )
}

export default AdmNotasFiscaisPage