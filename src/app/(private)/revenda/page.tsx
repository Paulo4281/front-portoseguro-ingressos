import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Revenda | Porto Seguro Ingressos",
}

import { RevendaPannel } from "@/components/Pages/Private/Revenda/RevendaPannel"

const RevendaPage = () => {
    return (
        <>
        <RevendaPannel />
        </>
    )
}

export default RevendaPage