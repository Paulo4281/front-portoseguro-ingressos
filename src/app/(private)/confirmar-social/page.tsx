import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Confirmar Social | Porto Seguro Ingressos",
    description: "Complete seu cadastro para começar a explorar eventos incríveis.",
}

import { ConfirmarSocialPannel } from "@/components/Pages/Private/ConfirmarSocial/ConfirmarSocialPannel"

const ConfirmarSocialPage = () => {
    return <ConfirmarSocialPannel />
}

export default ConfirmarSocialPage