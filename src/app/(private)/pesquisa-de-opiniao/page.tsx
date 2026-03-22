import { PesquisaDeOpiniaoPannel } from "@/components/Pages/Private/PesquisaDeOpiniao/PesquisaDeOpiniaoPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pesquisa de Opinião | Porto Seguro Ingressos",
    description: "Visualize os links de pesquisa gerados automaticamente após os eventos e acompanhe as respostas dos clientes",
}

const PesquisaDeOpiniaoPage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <PesquisaDeOpiniaoPannel />
        </VerificationStatusGuard>
        </>
    )
}

export default PesquisaDeOpiniaoPage