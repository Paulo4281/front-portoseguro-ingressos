"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Background } from "@/components/Background/Background"
import { UserService } from "@/services/User/UserService"
import { CheckCircle2, MailX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const EmailConsentInfo = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("t")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleUnsubscribe = async () => {
            if (!token) {
                setError("Token inválido ou não fornecido")
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                await UserService.updateEmailMarketingConsentByToken(token)
                setIsSuccess(true)
            } catch (error: any) {
                setError(error?.response?.data?.message || "Erro ao processar descadastramento. Tente novamente.")
            } finally {
                setIsLoading(false)
            }
        }

        if (token) {
            handleUnsubscribe()
        } else {
            setError("Token inválido ou não fornecido")
        }
    }, [token])

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container mx-auto px-4 py-24 mt-[80px]">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl border border-psi-primary/20 p-8
                    sm:p-12 shadow-sm">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="h-12 w-12 text-psi-primary animate-spin" />
                                <p className="text-psi-dark/70">Processando descadastramento...</p>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-psi-dark">Descadastrado com sucesso</h2>
                                    <p className="text-psi-dark/70">
                                        Você não receberá mais e-mails de marketing da plataforma e dos organizadores.
                                    </p>
                                    <p className="text-sm text-psi-dark/60 mt-4">
                                        Você ainda receberá e-mails importantes sobre seus ingressos e eventos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                    <MailX className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-semibold text-psi-dark">Erro ao processar</h2>
                                    <p className="text-psi-dark/70">{error}</p>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Tentar novamente
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    EmailConsentInfo
}
