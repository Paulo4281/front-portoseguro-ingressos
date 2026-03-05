import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Campanhas Internas | Porto Seguro Ingressos",
    description: ""
}

import { AdmCampanhasInternalPannel } from "@/components/Pages/Private/AdmCampanhasInternas/AdmCampanhasInternalPannel"

const AdmCampanhasInternasPage = () => {
    return (
        <>
        <AdmCampanhasInternalPannel />
        </>
    )
}

export default AdmCampanhasInternasPage