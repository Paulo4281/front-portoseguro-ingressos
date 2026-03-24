import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Acessos | Porto Seguro Ingressos",
    description: ""
}

import { AdmAcessosPannel } from "@/components/Pages/Private/AdmAcessos/AdmAcessosPannel"

const AdmAcessosPage = () => {
    return (
        <>
        <AdmAcessosPannel />
        </>
    )
}

export default AdmAcessosPage