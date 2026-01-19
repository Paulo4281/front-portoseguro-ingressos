type TTemplatePlan = "FREE" | "PRO"

type TTemplateResponse = {
    id: string
    code: string
    name: string
    subject: string
    body: string
    plan: TTemplatePlan
    createdAt: string
    updatedAt: string | null
}

type TTemplateListResponse = TTemplateResponse[]

export type {
    TTemplateResponse,
    TTemplateListResponse,
    TTemplatePlan
}

