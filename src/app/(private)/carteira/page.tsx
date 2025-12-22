import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Carteira | Porto Seguro Ingressos",
    description: "Visualize seu saldo disponível para saque e movimentações. Gerencie suas transações e pagamentos com segurança e praticidade.",
}

import { CarteiraPannel } from "@/components/Pages/Private/Carteira/CarteiraPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const CarteiraPage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <CarteiraPannel />
        </VerificationStatusGuard>
        </>
    )
}

export default CarteiraPage