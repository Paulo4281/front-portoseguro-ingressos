import { CRMPannel } from "@/components/Pages/Private/CRM/CRMPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "CRM | Porto Seguro Ingressos",
    description: "Gerencie seus clientes e comunicações",
}

const CRMPage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <CRMPannel />
        </VerificationStatusGuard>
        </>
    )
}

export default CRMPage