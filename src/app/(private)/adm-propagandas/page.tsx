import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Propagandas | Porto Seguro Ingressos",
    description: "Visualize e gerencie todos os parceiros da plataforma. Adicione, edite e remova parceiros.",
}

import { AdmPropagandasPannel } from "@/components/Pages/Private/AdmPropagandas/AdmPropagandasPannel"

const AdmPropagandasPage = () => {
    return (
        <>
        <AdmPropagandasPannel />
        </>
    )
}

export default AdmPropagandasPage