"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { Facebook, Key, Save } from "lucide-react"

const ConfiguracoesPannel = () => {
    const [facebookPixelId, setFacebookPixelId] = useState("")
    const [facebookAccessToken, setFacebookAccessToken] = useState("")

    const handleSave = () => {
        console.log("Salvar configurações:", { facebookPixelId, facebookAccessToken })
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-12 mt-[80px]">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-psi-primary
                        sm:text-4xl">Configurações</h1>
                        <p className="text-sm text-psi-dark/60">Gerencie as configurações da sua conta e integrações</p>
                    </div>

                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                    sm:p-8 shadow-sm">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-[#E4E6F0]">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Facebook className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-psi-dark">Meta Ads (Facebook)</h2>
                                    <p className="text-sm text-psi-dark/60">Configure o Facebook Pixel e Access Token para criar campanhas no Meta Ads</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="facebook-pixel-id" className="text-sm font-medium text-psi-dark flex items-center gap-2">
                                        <Facebook className="w-4 h-4 text-psi-primary" />
                                        Facebook Pixel ID
                                    </label>
                                    <Input
                                        id="facebook-pixel-id"
                                        type="text"
                                        placeholder="Ex: 123456789012345"
                                        value={facebookPixelId}
                                        onChange={(e) => setFacebookPixelId(e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-psi-dark/50">
                                        O ID do seu Facebook Pixel. Você pode encontrá-lo no Gerenciador de Eventos do Facebook.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="facebook-access-token" className="text-sm font-medium text-psi-dark flex items-center gap-2">
                                        <Key className="w-4 h-4 text-psi-primary" />
                                        Facebook Access Token
                                    </label>
                                    <Input
                                        id="facebook-access-token"
                                        type="password"
                                        placeholder="Ex: EAABwzLix... (token será oculto)"
                                        value={facebookAccessToken}
                                        onChange={(e) => setFacebookAccessToken(e.target.value)}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-psi-dark/50">
                                        O token de acesso do Facebook para autenticação nas APIs do Meta Ads.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-[#E4E6F0]">
                                <Button
                                    onClick={handleSave}
                                    variant="primary"
                                    size="lg"
                                    className="gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Salvar Configurações
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    ConfiguracoesPannel
}
