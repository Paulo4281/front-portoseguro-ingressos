import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Suporte | Porto Seguro Ingressos",
    description: "Entre em contato com nossa equipe de suporte para obter ajuda e resolver qualquer problema que você possa estar enfrentando.",
}

import { SuportePannel } from "@/components/Pages/Private/Suporte/SuportePannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const SuportePage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <SuportePannel />
        </VerificationStatusGuard>
        </>
    )
}

export default SuportePage