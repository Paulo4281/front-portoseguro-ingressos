import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "QR Scanner Link | Porto Seguro Ingressos",
    description: "Escaneie o QR Code do evento para validar ingressos dos participantes.",
}

import { QrScanLinkPannel } from "@/components/Pages/Public/QrScanLink/QrScanLinkPannel"

const QrScanLinkPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <QrScanLinkPannel />
        </Suspense>
    )
}

export default QrScanLinkPage