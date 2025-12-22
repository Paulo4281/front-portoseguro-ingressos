import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Suporte | Porto Seguro Ingressos",
    description: "Visualize e gerencie todos os chamados de suporte da plataforma. Responda aos usuários e atualize o status dos chamados.",
}

import { SupportAdminPannel } from "@/components/Pages/Private/SupportAdmin/SupportAdminPannel"

const AdmSuportePage = () => {
    return (
        <>
        <SupportAdminPannel />
        </>
    )
}

export default AdmSuportePage