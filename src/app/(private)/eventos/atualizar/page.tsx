"use client"

import { useSearchParams } from "next/navigation"
import { AtualizarEventoForm } from "@/components/Pages/Private/AutalizarEvento/AtualizarEventoForm"

const AtualizarEventoPage = () => {
    const searchParams = useSearchParams()
    const eventId = searchParams.get("id")

    if (!eventId) {
        return (
            <div className="flex items-center justify-center min-h-screen mt-[80px]">
                <p className="text-psi-dark/60">ID do evento não fornecido</p>
            </div>
        )
    }

    return <AtualizarEventoForm eventId={eventId} />
}

export default AtualizarEventoPage