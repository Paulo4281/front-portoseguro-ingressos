import { PesquisaPannel } from "@/components/Pages/Public/Pesquisa/PesquisaPannel"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Pesquisa de Satisfação | Porto Seguro Ingressos",
    description: "Deixe sua opinião sobre o evento que você participou",
}

const PesquisaPage = () => {
    return (
        <>
        <PesquisaPannel />
        </>
    )
}

export default PesquisaPage