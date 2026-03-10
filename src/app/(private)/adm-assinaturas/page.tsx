import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Assinaturas | Porto Seguro Ingressos",
    description: ""
}

import { AdmAssinaturasPannel } from "@/components/Pages/Private/AdmAssinaturas/AdmAssinaturasPannel"

const AdmAssinaturasPage = () => {
    return (
        <>
        <AdmAssinaturasPannel />
        </>
    )
}

export default AdmAssinaturasPage