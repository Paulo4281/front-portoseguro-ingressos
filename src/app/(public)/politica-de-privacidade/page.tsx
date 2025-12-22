import { PoliticaDePrivacidadeInfo } from "@/components/Pages/Public/PoliticaDePrivacidade/PoliticaDePrivacidadeInfo"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Política de Privacidade | Porto Seguro Ingressos",
    description: "Política de Privacidade do Porto Seguro Ingressos",
}

const PoliticaDePrivacidadePage = () => {
    return (
        <>
        <PoliticaDePrivacidadeInfo />
        </>
    )
}

export default PoliticaDePrivacidadePage