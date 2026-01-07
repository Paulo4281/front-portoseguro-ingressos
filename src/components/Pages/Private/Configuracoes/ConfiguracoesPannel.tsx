"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { Facebook, Key, Save, HelpCircle } from "lucide-react"
import { useMetaUpdateFacebookPixel } from "@/hooks/Meta/useMetaUpdateFacebookPixel"
import { useMetaGetFacebookPixel } from "@/hooks/Meta/useMetaGetFacebookPixel"
import { Toast } from "@/components/Toast/Toast"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const ConfiguracoesPannel = () => {
    const [facebookPixelId, setFacebookPixelId] = useState("")
    const [facebookAccessToken, setFacebookAccessToken] = useState("")
    const [isTutorialDialogOpen, setIsTutorialDialogOpen] = useState(false)
    const { mutateAsync: updateMeta, isPending } = useMetaUpdateFacebookPixel()
    const { data: metaData, isLoading: isLoadingMeta, refetch } = useMetaGetFacebookPixel()

    useEffect(() => {
        if (metaData?.data) {
            if (metaData.data.facebookPixelId) {
                setFacebookPixelId(metaData.data.facebookPixelId)
            }
            if (metaData.data.facebookAccessToken) {
                setFacebookAccessToken(metaData.data.facebookAccessToken)
            }
        }
    }, [metaData])

    const handleSave = async () => {
        if (!facebookPixelId.trim() || !facebookAccessToken.trim()) {
            Toast.error("Por favor, preencha todos os campos.")
            return
        }

        try {
            const response = await updateMeta({
                facebookPixelId: facebookPixelId.trim(),
                facebookAccessToken: facebookAccessToken.trim()
            })

            if (response?.success) {
                Toast.success("Configurações do Facebook Pixel salvas com sucesso!")
                refetch()
            } else {
                Toast.error("Erro ao salvar as configurações. Verifique se os dados estão corretos.")
            }
        } catch (error) {
            console.error("Erro ao salvar configurações do Facebook Pixel:", error)
            Toast.error("Erro ao salvar as configurações. Tente novamente.")
        }
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-12 mt-[80px]">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-psi-primary
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
                                    <h2 className="text-lg font-medium text-psi-dark">Meta Ads (Facebook)</h2>
                                    <p className="text-sm text-psi-dark/60">Configure o Facebook Pixel e Access Token para criar campanhas no Meta Ads</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="facebook-pixel-id" className="text-sm font-medium text-psi-dark flex items-center gap-2">
                                        <Facebook className="w-4 h-4 text-psi-primary" />
                                        Facebook Pixel ID
                                    </label>
                                    {isLoadingMeta ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <Input
                                            id="facebook-pixel-id"
                                            type="text"
                                            placeholder="Ex: 123456789012345"
                                            value={facebookPixelId}
                                            onChange={(e) => setFacebookPixelId(e.target.value)}
                                            className="w-full"
                                        />
                                    )}
                                    <p className="text-xs text-psi-dark/50">
                                        O ID do seu Facebook Pixel. Você pode encontrá-lo no Gerenciador de Eventos do Facebook.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="facebook-access-token" className="text-sm font-medium text-psi-dark flex items-center gap-2">
                                            <Key className="w-4 h-4 text-psi-primary" />
                                            Facebook Access Token
                                        </label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsTutorialDialogOpen(true)}
                                            className="text-xs text-psi-primary hover:text-psi-primary/80 hover:bg-psi-primary/5"
                                        >
                                            <HelpCircle className="w-3.5 h-3.5 mr-1" />
                                            Como obter o token de acesso
                                        </Button>
                                    </div>
                                    {isLoadingMeta ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <Input
                                            id="facebook-access-token"
                                            type="password"
                                            placeholder="Ex: EAABwzLix... (token será oculto)"
                                            value={facebookAccessToken}
                                            onChange={(e) => setFacebookAccessToken(e.target.value)}
                                            className="w-full"
                                        />
                                    )}
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
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <LoadingButton />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Salvar Configurações
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isTutorialDialogOpen} onOpenChange={setIsTutorialDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                <HelpCircle className="h-5 w-5 text-psi-primary" />
                            </div>
                            Como obter o token de acesso do Facebook
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Siga os passos abaixo para obter o token de acesso do Facebook através do Business Manager.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-3">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-semibold text-psi-primary">1</span>
                                </div>
                                <h3 className="text-base font-medium text-psi-dark">Primeira etapa</h3>
                                <p>Acesse o seu Gerenciador de Eventos do Facebook e escolha sua conta de negócios.</p>
                            </div>
                            <div className="relative w-full rounded-lg border border-psi-primary/20 bg-psi-primary/5 overflow-hidden">
                                <Image
                                    src="/images/tutorials/meta-facebook-pixel/etapa-01-business-manager.jpg"
                                    alt="Etapa 01 - Business Manager"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-semibold text-psi-primary">2</span>
                                </div>
                                <h3 className="text-base font-medium text-psi-dark">Segunda etapa</h3>
                                <p>Clique em "Fontes de dados" e selecione o Pixel que será usado para criar campanhas.</p>
                            </div>
                            <div className="relative w-full rounded-lg border border-psi-primary/20 bg-psi-primary/5 overflow-hidden">
                                <Image
                                    src="/images/tutorials/meta-facebook-pixel/etapa-02-business-manager.jpg"
                                    alt="Etapa 02 - Business Manager"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-sm font-semibold text-psi-primary">3</span>
                                </div>
                                <h3 className="text-base font-medium text-psi-dark">Terceira etapa</h3>
                                <p>Desça até a seção "Configurar integração direta" e clique em "Gerar token de acesso".</p>
                            </div>
                            <div className="relative w-full rounded-lg border border-psi-primary/20 bg-psi-primary/5 overflow-hidden">
                                <Image
                                    src="/images/tutorials/meta-facebook-pixel/etapa-03-business-manager.jpg"
                                    alt="Etapa 03 - Business Manager"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    ConfiguracoesPannel
}
