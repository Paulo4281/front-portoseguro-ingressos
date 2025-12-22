import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Eventos | Porto Seguro Ingressos",
    description: ""
}

import { EventosAdminPannel } from "@/components/Pages/Private/EventosAdmin/EventosAdminPannel"

const AdmEventosPage = () => {
    return (
        <>
        <EventosAdminPannel />
        </>
    )
}

export default AdmEventosPage