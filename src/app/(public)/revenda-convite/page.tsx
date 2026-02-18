import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Convite de Revendedor | Porto Seguro Ingressos",
}

import { RevendaConviteInfo } from "@/components/Pages/Public/Revenda/RevendaConviteInfo"

const RevendaConvitePage = () => {
    return (
        <Suspense fallback={null}>
            <RevendaConviteInfo />
        </Suspense>
    )
}

export default RevendaConvitePage