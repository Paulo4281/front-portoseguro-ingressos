import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Clientes | Porto Seguro Ingressos",
    description: "Visualize e gerencie todos os clientes da plataforma. Acompanhe informações detalhadas de cada cliente, incluindo eventos comprados, pagamentos e status de verificação.",
}

import { ClientsPannel } from "@/components/Pages/Private/Clients/ClientsPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const ClientsPage = () => {
    return (
        <VerificationStatusGuard>
            <ClientsPannel />
        </VerificationStatusGuard>
    )
}

export default ClientsPage