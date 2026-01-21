import { PesquisaPannel } from "@/components/Pages/Public/Pesquisa/PesquisaPannel"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Pesquisa de Satisfação | Porto Seguro Ingressos",
    description: "Deixe sua opinião sobre o evento que você participou",
}

const PesquisaPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <PesquisaPannel />
        </Suspense>
    )
}

export default PesquisaPage