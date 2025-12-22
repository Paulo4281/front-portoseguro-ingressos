import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Meus Eventos | Porto Seguro Ingressos",
    description: "Acompanhe todos os eventos que você está participando. Veja detalhes, confirme presença e mantenha-se informado sobre as próximas oportunidades.",
}

import { MeusEventosPannel } from "@/components/Pages/Private/MeusEventos/MeusEventosPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const MeusEventosPage = () => {
    return (
        <VerificationStatusGuard>
            <MeusEventosPannel />
        </VerificationStatusGuard>
    )
}

export default MeusEventosPage