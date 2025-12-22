"use client"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Cupons | Porto Seguro Ingressos",
    description: "Gerencie cupons de desconto e promoções. Crie, edite e expire cupons para incentivar compras e atrair novos clientes.",
}

import { CuponsPannel } from "@/components/Pages/Private/Cupons/CuponsPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const CuponsPage = () => {
    return (
        <VerificationStatusGuard>
            <CuponsPannel />
        </VerificationStatusGuard>
    )
}

export default CuponsPage