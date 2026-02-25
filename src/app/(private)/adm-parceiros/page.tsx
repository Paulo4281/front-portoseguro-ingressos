import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Parceiros | Porto Seguro Ingressos",
    description: "Visualize e gerencie todos os parceiros da plataforma. Adicione, edite e remova parceiros.",
}

import { AdmParceirosPannel } from "@/components/Pages/Private/AdmParceiros/AdmParceirosPannel"

const AdmParceirosPage = () => {
    return (
        <>
        <AdmParceirosPannel />
        </>
    )
}

export default AdmParceirosPage