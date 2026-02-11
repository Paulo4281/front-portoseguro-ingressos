import { Metadata } from "next"
import { Suspense } from "react"
import { DefinirSenhaInfo } from "@/components/Pages/Public/DefinirSenha/DefinirSenhaInfo"

export const metadata: Metadata = {
    title: "Definir Senha | Porto Seguro Ingressos",
    description: "Defina sua senha para acessar sua conta.",
}

const DefinirSenhaPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <DefinirSenhaInfo />
        </Suspense>
    )
}

export default DefinirSenhaPage