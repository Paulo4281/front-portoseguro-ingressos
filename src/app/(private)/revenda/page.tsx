import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Revenda | Porto Seguro Ingressos",
}

import { RevendaPannel } from "@/components/Pages/Private/Revenda/RevendaPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const RevendaPage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <RevendaPannel />
        </VerificationStatusGuard>
        </>
    )
}

export default RevendaPage