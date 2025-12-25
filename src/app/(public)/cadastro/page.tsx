import { CadastroForm } from "@/components/Pages/Public/Cadastro/CadastroForm"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Cadastro | Porto Seguro Ingressos",
    description: "Crie sua conta para começar a explorar eventos incríveis.",
}

const CadastroPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <CadastroForm />
        </Suspense>
    )
}

export default CadastroPage