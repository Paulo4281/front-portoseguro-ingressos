import CadastroConfirmarForm from "@/components/Pages/Public/CadastroConfirmar/CadastroConfirmarForm"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Cadastro Confirmar | Porto Seguro Ingressos",
    description: "Confirme seu cadastro para começar a explorar eventos incríveis.",
}

const CadastroConfirmarPage = () => {
    return (
        <CadastroConfirmarForm />
    )
}

export default CadastroConfirmarPage