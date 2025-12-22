import { TermosECondicoesInfo } from "@/components/Pages/Public/TermosECondicoes/TermosECondicoesInfo"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Termos e Condições | Porto Seguro Ingressos",
    description: "Termos e Condições de uso do Porto Seguro Ingressos",
}

const TermosECondicoesPage = () => {
    return (
        <>
        <TermosECondicoesInfo />
        </>
    )
}

export default TermosECondicoesPage