type TTemplatePlan = "FREE" | "PRO"

type TTemplateResponse = {
    id: string
    code: string
    name: string
    subject: string
    variables: Record<string, string>
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

