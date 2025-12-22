import { CadastroForm } from "@/components/Pages/Public/Cadastro/CadastroForm"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Cadastro | Porto Seguro Ingressos",
    description: "Crie sua conta para começar a explorar eventos incríveis.",
}

const CadastroPage = () => {
    return (
        <CadastroForm />
    )
}

export default CadastroPage