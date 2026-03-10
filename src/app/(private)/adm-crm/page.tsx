import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar CRM | Porto Seguro Ingressos",
    description: ""
}

import { AdmCrmManagerPannel } from "@/components/Pages/Private/AdmCrmManager/AdmCrmManagerPannel"

const AdmCRMPage = () => {
    return (
        <>
        <AdmCrmManagerPannel />
        </>
    )
}

export default AdmCRMPage