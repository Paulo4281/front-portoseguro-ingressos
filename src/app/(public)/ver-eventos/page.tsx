import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ver Eventos | Porto Seguro Ingressos",
    description: "Veja todos os eventos disponíveis em Porto Seguro e compre seus ingressos.",
}

import { VerEventosPannel } from "@/components/Pages/Public/VerEventos/VerEventosPannel"

const VerEventosPage = () => {
    return (
        <>
            <VerEventosPannel />
        </>
    )
}

export default VerEventosPage