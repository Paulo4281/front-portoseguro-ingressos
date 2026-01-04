"use client"

import { useEffect, useState } from "react"
import { useUserUpdateWebpush } from "@/hooks/User/useUserUpdateWebpush"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { Toast } from "@/components/Toast/Toast"

export const useWebPushNotification = () => {
    const { user } = useAuthStore()
    const { mutateAsync: updateWebpush } = useUserUpdateWebpush()
    const [isSupported, setIsSupported] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission | null>(null)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

    const registerServiceWorker = async () => {
        if ("serviceWorker" in navigator) {
            try {
                const registration = await navigator.serviceWorker.register("/sw.js")
                console.log("Service Worker registrado com sucesso:", registration.scope)
            } catch (error) {
                console.error("Erro ao registrar Service Worker:", error)
            }
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true)
            setPermission(Notification.permission)
            registerServiceWorker()
        }
    }, [])

    const requestPermission = async (): Promise<boolean> => {
        if (!isSupported) {
            Toast.error("Seu navegador não suporta notificações push")
            return false
        }

        try {
            const permission = await Notification.requestPermission()
            setPermission(permission)

            if (permission === "granted") {
                return await subscribeUser()
            } else if (permission === "denied") {
                Toast.error("Permissão de notificações negada")
                return false
            } else {
                Toast.info("Permissão de notificações não foi concedida")
                return false
            }
        } catch (error) {
            console.error("Erro ao solicitar permissão:", error)
            Toast.error("Erro ao solicitar permissão de notificações")
            return false
        }
    }

    const subscribeUser = async (): Promise<boolean> => {
        try {
            const registration = await navigator.serviceWorker.ready

            const existingSubscription = await registration.pushManager.getSubscription()
            if (existingSubscription) {
                setSubscription(existingSubscription)
                return await saveSubscription(existingSubscription)
            }

            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            if (!vapidPublicKey) {
                console.error("VAPID_PUBLIC_KEY não configurada")
                Toast.error("Configuração de notificações não encontrada")
                return false
            }

            const newSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer
            })

            setSubscription(newSubscription)
            return await saveSubscription(newSubscription)
        } catch (error) {
            console.error("Erro ao criar assinatura:", error)
            Toast.error("Erro ao configurar notificações")
            return false
        }
    }

    const saveSubscription = async (subscription: PushSubscription): Promise<boolean> => {
        try {
            const subscriptionData = {
                endpoint: subscription.endpoint,
                p256dh: arrayBufferToBase64(subscription.getKey("p256dh")!),
                auth: arrayBufferToBase64(subscription.getKey("auth")!)
            }

            await updateWebpush(subscriptionData)
            Toast.success("Notificações ativadas com sucesso!")
            return true
        } catch (error) {
            console.error("Erro ao salvar assinatura:", error)
            Toast.error("Erro ao salvar configuração de notificações")
            return false
        }
    }

    const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

        const rawData = window.atob(base64)
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray
    }

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(buffer)
        let binary = ""
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
    }

    const shouldShowPrompt = (): boolean => {
        if (!isSupported) return false
        if (!user) return false
        if (user.role !== "CUSTOMER" && user.role !== "ORGANIZER") return false
        if (permission === "granted") return false
        if (permission === "denied") return false
        return true
    }

    return {
        isSupported,
        permission,
        subscription,
        requestPermission,
        shouldShowPrompt: shouldShowPrompt()
    }
}

