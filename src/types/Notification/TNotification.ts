const NotificationSubjects = [
    "PAYMENT_SUCCESS",
    "DAYS_15_WARNING",
    "DAYS_7_WARNING",
    "DAYS_3_WARNING",
    "AFTER_EVENT"
] as const

type TNotificationSubject = typeof NotificationSubjects[number]
type TNotificationImportance = "LOW" | "MEDIUM" | "HIGH"

type TNotification = {
    id: string
    subject: TNotificationSubject
    templateData: Record<string, string>
    importance: TNotificationImportance
    message?: string
    isRead: boolean
    userId: string
    createdAt: string
    updatedAt: string | null
}

export type {
    TNotification,
    TNotificationImportance,
    TNotificationSubject
}