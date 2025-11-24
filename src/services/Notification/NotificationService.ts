import type { TNotification } from "@/types/Notification/TNotification"

const notificationsMock: TNotification[] = [
    {
        id: "1",
        subject: "EVENT",
        message: "Seu evento 'Festival de Verão 2026' foi aprovado e está ativo na plataforma.",
        priority: "high",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false
    },
    {
        id: "2",
        subject: "PAYMENT",
        message: "Repasse de R$ 45.000,00 realizado com sucesso para sua conta bancária.",
        priority: "high",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isRead: false
    },
    {
        id: "3",
        subject: "TICKET",
        message: "Novos ingressos vendidos para o evento 'Show Nacional'. Total: 12 ingressos.",
        priority: "medium",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: false
    },
    {
        id: "4",
        subject: "EVENT",
        message: "Lembrete: O evento 'Maratona do Descobrimento' está próximo. Verifique os detalhes.",
        priority: "low",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true
    },
    {
        id: "5",
        subject: "TICKET",
        message: "Um cliente solicitou reembolso para o evento 'Festival Gastronômico'.",
        priority: "medium",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true
    }
]

class NotificationServiceClass {
    async find(): Promise<TNotification[]> {
        return notificationsMock
    }
}

export const NotificationService = new NotificationServiceClass()