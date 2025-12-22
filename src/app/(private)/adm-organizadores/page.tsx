import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Organizadores | Porto Seguro Ingressos",
    description: "",
}

import { AdmOrganizadoresPannel } from "@/components/Pages/Private/AdmOrganizadores/AdmOrganizadoresPannel"

const AdmOrganizadoresPage = () => {
    return (
        <>
        <AdmOrganizadoresPannel />
        </>
    )
}

export default AdmOrganizadoresPage