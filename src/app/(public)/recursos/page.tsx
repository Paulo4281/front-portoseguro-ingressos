import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Recursos | Porto Seguro Ingressos",
    description: "Recursos da plataforma para organizadores e participantes.",
}

import { RecursosInfo } from "@/components/Pages/Public/Recursos/RecursosInfo"

const RecursosPage = () => {
    return <RecursosInfo />
}

export default RecursosPage