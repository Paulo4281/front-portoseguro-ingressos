"use client"

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