import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Redefinir Senha | Porto Seguro Ingressos",
    description: "Redefina sua senha para continuar explorando eventos incríveis.",
}

import { RedefinirSenhaLogForm } from "@/components/Pages/Private/RedefinirSenhaLog/RedefinirSenhaLogForm"

const RedefinirSenhaLogPage = () => {
    return (
        <>
        <RedefinirSenhaLogForm />
        </>
    )
}

export default RedefinirSenhaLogPage