import CadastroConfirmarForm from "@/components/Pages/Public/CadastroConfirmar/CadastroConfirmarForm"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Cadastro Confirmar | Porto Seguro Ingressos",
    description: "Confirme seu cadastro para começar a explorar eventos incríveis.",
}

const CadastroConfirmarPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <CadastroConfirmarForm />
        </Suspense>
    )
}

export default CadastroConfirmarPage