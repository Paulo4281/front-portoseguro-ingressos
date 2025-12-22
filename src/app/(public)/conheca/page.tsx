import { ConhecaInfo } from "@/components/Pages/Public/Conheca/ConhecaInfo"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Conheça a Maion Digital | Porto Seguro Ingressos",
    description: "A venda de ingressos online desempenha um papel crucial no sucesso de eventos e organizadores, especialmente em um cenário cada vez mais digital. Nos últimos anos, a transformação digital tem revolucionado a maneira como eventos são divulgados e ingressos são comercializados.",
}

const ConhecaPage = () => {
    return (
        <ConhecaInfo />
    )
}

export default ConhecaPage