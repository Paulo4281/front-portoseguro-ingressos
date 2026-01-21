import { CRMPannel } from "@/components/Pages/Private/CRM/CRMPannel"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "CRM | Porto Seguro Ingressos",
    description: "Gerencie seus clientes e comunicações",
}

const CRMPage = () => {
    return (
        <>
        <CRMPannel />
        </>
    )
}

export default CRMPage