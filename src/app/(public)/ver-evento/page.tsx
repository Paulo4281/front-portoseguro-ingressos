"use client"

import { useSearchParams } from "next/navigation"
import { VerEventoInfo } from "@/components/Pages/Public/VerEvento/VerEventoInfo"

const VerEventoPage = () => {
    const searchParams = useSearchParams()
    const eventId = searchParams.get("id")

    if (!eventId) {
        return (
            <div className="flex items-center justify-center min-h-screen mt-[80px]">
                <p className="text-psi-dark/60">Evento não encontrado</p>
            </div>
        )
    }

    return <VerEventoInfo eventId={eventId} />
}

export default VerEventoPage
