"use client"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Criar Evento | Porto Seguro Ingressos",
    description: "Crie um novo evento para começar a vender ingressos e atrair novos clientes.",
}

import CriarEventoForm from "@/components/Pages/Private/CriarEvento/CriarEventoForm"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const CriarEventoPage = () => {
    return (
        <VerificationStatusGuard>
            <CriarEventoForm />
        </VerificationStatusGuard>
    )
}

export default CriarEventoPage