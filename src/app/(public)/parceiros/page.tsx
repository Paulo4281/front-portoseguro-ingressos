import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Parceiros | Porto Seguro Ingressos",
    description: "Parceiros da plataforma para organizadores e participantes.",
}

import { ParceirosInfo } from "@/components/Pages/Public/Parceiros/ParceirosInfo"

const ParceirosPage = () => {
    return (
        <>
        <ParceirosInfo />
        </>
    )
}

export default ParceirosPage