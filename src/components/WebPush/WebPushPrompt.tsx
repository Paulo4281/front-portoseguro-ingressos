"use client"

import { useEffect, useState } from "react"
import { useWebPushNotification } from "@/hooks/WebPush/useWebPushNotification"
import { Button } from "@/components/ui/button"
import { Bell, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const WebPushPrompt = () => {
    const { shouldShowPrompt, requestPermission, isSupported } = useWebPushNotification()
    const [isOpen, setIsOpen] = useState(false)
    const [hasShownBefore, setHasShownBefore] = useState(false)

    useEffect(() => {
        if (shouldShowPrompt && !hasShownBefore && isSupported) {
            const hasShown = localStorage.getItem("webpush_prompt_shown")
            if (!hasShown) {
                setTimeout(() => {
                    setIsOpen(true)
                }, 2000)
            }
        }
    }, [shouldShowPrompt, hasShownBefore, isSupported])

    const handleAccept = async () => {
        const success = await requestPermission()
        if (success) {
            localStorage.setItem("webpush_prompt_shown", "true")
            setIsOpen(false)
            setHasShownBefore(true)
        }
    }

    const handleDismiss = () => {
        localStorage.setItem("webpush_prompt_shown", "true")
        setIsOpen(false)
        setHasShownBefore(true)
    }

    if (!shouldShowPrompt || !isSupported) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-psi-primary/10 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-psi-primary" />
                        </div>
                        <DialogTitle>Receber Notificações</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Gostaria de receber notificações sobre seus eventos, ingressos e atualizações importantes?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-sm text-psi-dark/70">
                        Ao ativar as notificações, você receberá alertas sobre:
                    </p>
                    <ul className="space-y-2 text-sm text-psi-dark/70">
                        <li className="flex items-start gap-2">
                            <span className="text-psi-primary mt-1">•</span>
                            <span>Confirmação de compra de ingressos</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-psi-primary mt-1">•</span>
                            <span>Atualizações sobre seus eventos</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-psi-primary mt-1">•</span>
                            <span>Lembretes importantes</span>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-psi-dark/10">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleDismiss}
                    >
                        Agora não
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleAccept}
                    >
                        Ativar notificações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export {
    WebPushPrompt
}

