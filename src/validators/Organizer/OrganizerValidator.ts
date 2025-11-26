import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

export const OrganizerUpdateValidator = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    birth: z.string().nullable().optional().or(z.literal("")),
    document: z.string().nullable().optional(),

    companyName: z.string().nullable().optional(),
    companyDocument: z.string().nullable().optional(),
    companyAddress: z.string().nullable().optional(),
    description: z.string().max(600, { error: "A descrição deve ter no máximo 600 caracteres" }).nullable().optional().or(z.literal("")),
    logo: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    bankId: z.string().uuid().nullable().optional().or(z.literal("")),
    bankAccountName: z.string().nullable().optional(),
    bankAccountOwnerName: z.string().nullable().optional(),
    bankAccountOwnerBirth: z.string().nullable().optional().or(z.literal("")),
    bankAccountOwnerDocumentType: z.enum(["CPF", "CNPJ"]).nullable().optional(),
    bankAccountOwnerDocument: z.string().nullable().optional(),
    bankAccountAgency: z.string().nullable().optional(),
    bankAccountNumber: z.string().nullable().optional(),
    bankAccountDigit: z.string().nullable().optional(),
    bankAccountType: z.enum(["CONTA_CORRENTE", "CONTA_POUPANCA"]).nullable().optional(),
    pixAddressKey: z.string().nullable().optional(),
    pixAddressType: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "EVP"]).nullable().optional(),
    payoutMethod: z.enum(["PIX", "BANK_ACCOUNT"]).nullable().optional(),
    identityDocumentFronUrl: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    identityDocumentBackUrl: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    identityDocumentSelfieUrl: z.union([z.string(), z.instanceof(File)]).nullable().optional(),
    instagramUrl: z.string().url({ error: DefaultFormErrors.required }).nullable().optional().or(z.literal("")),
    facebookUrl: z.string().url({ error: DefaultFormErrors.required }).nullable().optional().or(z.literal("")),
    supportEmail: z.email({ error: DefaultFormErrors.required }).nullable().optional(),
    supportPhone: z.string().nullable().optional(),
    verificationStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).nullable().optional(),
}).superRefine((data, ctx) => {
    const hasBankAccount = !!(
        data.bankId &&
        data.bankAccountName &&
        data.bankAccountOwnerName &&
        data.bankAccountOwnerDocument &&
        data.bankAccountAgency &&
        data.bankAccountNumber &&
        data.bankAccountDigit &&
        data.bankAccountType
    )

    const hasPix = !!(data.pixAddressKey && data.pixAddressType)

    if (!hasBankAccount && !hasPix) {
        ctx.addIssue({
            code: "custom",
            path: ["pixAddressKey"],
            message: "É necessário informar pelo menos uma conta bancária ou chave PIX"
        })
    }

    if (hasBankAccount && !data.bankAccountOwnerBirth) {
        ctx.addIssue({
            code: "custom",
            path: ["bankAccountOwnerBirth"],
            message: "Data de nascimento do titular é obrigatória"
        })
    }

    const hasFrontDoc = data.identityDocumentFronUrl instanceof File || (typeof data.identityDocumentFronUrl === "string" && data.identityDocumentFronUrl.length > 0)
    const hasBackDoc = data.identityDocumentBackUrl instanceof File || (typeof data.identityDocumentBackUrl === "string" && data.identityDocumentBackUrl.length > 0)
    const hasSelfieDoc = data.identityDocumentSelfieUrl instanceof File || (typeof data.identityDocumentSelfieUrl === "string" && data.identityDocumentSelfieUrl.length > 0)

    if (!hasFrontDoc) {
        ctx.addIssue({
            code: "custom",
            path: ["identityDocumentFronUrl"],
            message: "Foto da frente do RG é obrigatória"
        })
    }

    if (!hasBackDoc) {
        ctx.addIssue({
            code: "custom",
            path: ["identityDocumentBackUrl"],
            message: "Foto do verso do RG é obrigatória"
        })
    }

    if (!hasSelfieDoc) {
        ctx.addIssue({
            code: "custom",
            path: ["identityDocumentSelfieUrl"],
            message: "Selfie segurando o RG é obrigatória"
        })
    }

    if (!data.supportEmail && !data.supportPhone) {
        ctx.addIssue({
            code: "custom",
            path: ["supportEmail"],
            message: "É necessário informar pelo menos um email ou telefone de suporte"
        })
    }

    if (hasBankAccount && hasPix && !data.payoutMethod) {
        ctx.addIssue({
            code: "custom",
            path: ["payoutMethod"],
            message: "Selecione o método de pagamento preferido"
        })
    }
})

export type TOrganizerUpdate = z.infer<typeof OrganizerUpdateValidator>

