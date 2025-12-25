import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Ver Eventos | Porto Seguro Ingressos",
    description: "Veja todos os eventos disponíveis em Porto Seguro e compre seus ingressos.",
}

import { VerEventosPannel } from "@/components/Pages/Public/VerEventos/VerEventosPannel"

const VerEventosPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <VerEventosPannel />
        </Suspense>
    )
}

export default VerEventosPage