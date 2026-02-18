import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Gerenciar Usuários | Porto Seguro Ingressos",
    description: "",
}

import { AdmOrganizadoresPannel } from "@/components/Pages/Private/AdmOrganizadores/AdmOrganizadoresPannel"

const AdmOrganizadoresPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <AdmOrganizadoresPannel />
        </Suspense>
    )
}

export default AdmOrganizadoresPage