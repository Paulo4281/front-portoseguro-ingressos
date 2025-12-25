import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Redefinir Senha | Porto Seguro Ingressos",
    description: "Redefina sua senha para continuar explorando eventos incríveis.",
}

import { RedefinirSenhaLogForm } from "@/components/Pages/Private/RedefinirSenhaLog/RedefinirSenhaLogForm"

const RedefinirSenhaLogPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <RedefinirSenhaLogForm />
        </Suspense>
    )
}

export default RedefinirSenhaLogPage