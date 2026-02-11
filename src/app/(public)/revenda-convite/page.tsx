import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Convite de Revendedor | Porto Seguro Ingressos",
}

import { RevendaConviteInfo } from "@/components/Pages/Public/Revenda/RevendaConviteInfo"

const RevendaConvitePage = () => {
    return <RevendaConviteInfo />
}

export default RevendaConvitePage