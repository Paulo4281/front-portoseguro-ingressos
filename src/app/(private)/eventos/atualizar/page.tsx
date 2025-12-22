import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Atualizar Evento | Porto Seguro Ingressos",
    description: "Edite as informações do seu evento para continuar vendendo ingressos e atraindo novos clientes.",
}

import { AtualizarEventoForm } from "@/components/Pages/Private/AutalizarEvento/AtualizarEventoForm"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const AtualizarEventoPage = () => {

    return (
        <VerificationStatusGuard>
            <AtualizarEventoForm  />
        </VerificationStatusGuard>
    )
}

export default AtualizarEventoPage