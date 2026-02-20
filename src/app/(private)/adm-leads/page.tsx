import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Leads | Porto Seguro Ingressos",
    description: ""
}

import { AdmLeadsPannel } from "@/components/Pages/Private/AdmLeads/AdmLeadsPannel"

const AdmLeadsPage = () => {
    return (
        <>
        <AdmLeadsPannel />
        </>
    )
}

export default AdmLeadsPage