import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Redefinir Senha | Porto Seguro Ingressos",
    description: "Redefina sua senha para continuar explorando eventos incríveis.",
}

import { SenhaRedefinirForm } from "@/components/Pages/Public/SenhaRedefinir/SenhaRedefinirForm"

const SenhaRedefinirPage = () => {
    return (
        <>
        <SenhaRedefinirForm />
        </>
    )
}

export default SenhaRedefinirPage