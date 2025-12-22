import { CasosDeUsoInfo } from "@/components/Pages/Public/CasosDeUso/CasosDeUsoInfo"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Casos de Uso | Porto Seguro Ingressos",
    description: "Veja como nossa plataforma pode transformar seus eventos e alcançar novos clientes.",
}

const CasosDeUsoPage = () => {
    return (
        <CasosDeUsoInfo />
    )
}

export default CasosDeUsoPage