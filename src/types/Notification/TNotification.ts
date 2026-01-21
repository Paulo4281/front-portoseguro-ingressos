const NotificationSubjects = [
    "PAYMENT_SUCCESS",
    "PAYMENT_FIRST_SOLD_TICKET",
    "PAYMENT_REFUNDED_BY_CUSTOMER",
    "PAYMENT_REFUNDED_BY_ORGANIZER",
    "PAYMENT_REFUNDED_BY_ADMIN_TO_CUSTOMER",
    "PAYMENT_REFUNDED_BY_ADMIN_TO_ORGANIZER",
    "EVENT_DAYS15_WARNING",
    "EVENT_DAYS7_WARNING",
    "EVENT_DAYS3_WARNING",
    "EVENT_AFTER_CUSTOMER",
    "EVENT_AFTER_ORGANIZER",
    "EVENT_CANCELLED_CLIENT",
    "EVENT_POSTPONED_CLIENT",
    "EVENT_CANCELLED_SUPPORT_ORGANIZER",
    "EVENT_POSTPONED_SUPPORT_ORGANIZER",
    "EVENT_BALANCE_RELEASED_TO_ORGANIZER",
    "EVENT_BATCH_ONLINE",
    "REGISTER_APPROVED",
    "REGISTER_REJECTED",
    "SUBSCRIPTION_CRM_PRO_EXPIRED"
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