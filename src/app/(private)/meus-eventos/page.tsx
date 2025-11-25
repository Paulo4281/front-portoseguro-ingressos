"use client"

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