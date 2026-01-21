import { AjudaInfo } from "@/components/Pages/Public/Ajuda/AjudaInfo"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ajuda | Porto Seguro Ingressos",
    description: "Ajuda para o uso da plataforma Porto Seguro Ingressos",
}

const AjudaPage = () => {
    return (
        <>
        <AjudaInfo />
        </>
    )
}

export default AjudaPage