import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard Revendedor | Porto Seguro Ingressos",
}

import { DashRevendedorPannel } from "@/components/Pages/Private/DashRevendedor/DashRevendedorPannel"

const DashRevendedorPage = () => {
    return (
        <>
        <DashRevendedorPannel />
        </>
    )
}

export default DashRevendedorPage