import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Redefinir Senha Confirmar | Porto Seguro Ingressos",
    description: "Confirme sua senha para continuar explorando eventos incríveis.",
}

import SenhaRedefinirConfirmarForm from "@/components/Pages/Public/SenhaRedefinirConfirmar/SenhaRedefinirConfirmarForm"

const SenhaRedefinirConfirmarPage = () => {
    return (
        <>
        <SenhaRedefinirConfirmarForm />
        </>
    )
}

export default SenhaRedefinirConfirmarPage