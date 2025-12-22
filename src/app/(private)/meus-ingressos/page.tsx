import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Meus Ingressos | Porto Seguro Ingressos",
    description: "Acompanhe o status dos seus ingressos, confirme pagamentos, acesse QR Codes e compartilhe com seus amigos.",
}

import { MeusIngressosPannel } from "@/components/Pages/Private/MeusIngressos/MeusIngressosPannel"

const MeusIngressosPage = () => {
    return (
        <>
        <MeusIngressosPannel />
        </>
    )
}

export default MeusIngressosPage