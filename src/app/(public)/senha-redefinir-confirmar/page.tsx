import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Redefinir Senha Confirmar | Porto Seguro Ingressos",
    description: "Confirme sua senha para continuar explorando eventos incríveis.",
}

import SenhaRedefinirConfirmarForm from "@/components/Pages/Public/SenhaRedefinirConfirmar/SenhaRedefinirConfirmarForm"

const SenhaRedefinirConfirmarPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <SenhaRedefinirConfirmarForm />
        </Suspense>
    )
}

export default SenhaRedefinirConfirmarPage