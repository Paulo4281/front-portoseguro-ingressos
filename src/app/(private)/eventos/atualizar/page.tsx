import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Atualizar Evento | Porto Seguro Ingressos",
    description: "Edite as informações do seu evento para continuar vendendo ingressos e atraindo novos clientes.",
}

import { AtualizarEventoForm } from "@/components/Pages/Private/AutalizarEvento/AtualizarEventoForm"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const AtualizarEventoPage = () => {

    return (
        <VerificationStatusGuard>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
                <AtualizarEventoForm  />
            </Suspense>
        </VerificationStatusGuard>
    )
}

export default AtualizarEventoPage