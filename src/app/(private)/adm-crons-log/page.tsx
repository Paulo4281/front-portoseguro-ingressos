import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gerenciar Cron Jobs | Porto Seguro Ingressos",
    description: ""
}

import { AdmCronsLogPannel } from "@/components/Pages/Private/AdmCronsLog/AdmCronsLogPannel"

const AdmCronsLog = () => {
    return (
        <>
        <AdmCronsLogPannel />
        </>
    )
}

export default AdmCronsLog