import type { WebpushTemplatePlans } from "@/types/Webpush/TWebpushTypes"

type TWebpushTemplateResponse = {
    id: string
    code: string
    name: string
    title: string
    body: string
    variables: Record<string, any> | null
    plan: WebpushTemplatePlans
    createdAt: string
    updatedAt: string | null
}

type TWebpushTemplateListResponse = TWebpushTemplateResponse[]

export type {
    TWebpushTemplateResponse,
    TWebpushTemplateListResponse
}
