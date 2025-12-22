import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Configurações | Porto Seguro Ingressos",
    description: "Gerencie as configurações da sua conta e integrações.",
}

import { ConfiguracoesPannel } from "@/components/Pages/Private/Configuracoes/ConfiguracoesPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const ConfiguracoesPage = () => {
    return (
        <VerificationStatusGuard>
            <ConfiguracoesPannel />
        </VerificationStatusGuard>
    )
}

export default ConfiguracoesPage