"use client"

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