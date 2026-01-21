import { EmailConsentInfo } from "@/components/Pages/Public/EmailConsentInfo/EmailConsentInfo"
import { Suspense } from "react"

const EmailConsentPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <EmailConsentInfo />
        </Suspense>
    )
}

export default EmailConsentPage