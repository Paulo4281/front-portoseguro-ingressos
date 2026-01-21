import { PesquisaDeOpiniaoPannel } from "@/components/Pages/Private/PesquisaDeOpiniao/PesquisaDeOpiniaoPannel"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pesquisa de Opinião | Porto Seguro Ingressos",
    description: "Visualize os links de pesquisa gerados automaticamente após os eventos e acompanhe as respostas dos clientes",
}

const PesquisaDeOpiniaoPage = () => {
    return (
        <>
        <PesquisaDeOpiniaoPannel />
        </>
    )
}

export default PesquisaDeOpiniaoPage