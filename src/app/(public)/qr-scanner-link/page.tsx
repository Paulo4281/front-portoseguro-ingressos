import { Metadata } from "next"

export const metadata: Metadata = {
    title: "QR Scanner Link | Porto Seguro Ingressos",
    description: "Escaneie o QR Code do evento para validar ingressos dos participantes.",
}

import { QrScanLinkPannel } from "@/components/Pages/Public/QrScanLink/QrScanLinkPannel"

const QrScanLinkPage = () => {
    return (
        <QrScanLinkPannel />
    )
}

export default QrScanLinkPage