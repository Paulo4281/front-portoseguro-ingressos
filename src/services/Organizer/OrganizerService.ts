import type { TOrganizer, TBank } from "@/types/Organizer/TOrganizer"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"
import { API } from "@/api/api"
import type { TOrganizerUpdate } from "@/validators/Organizer/OrganizerValidator"

type TFindOrganizersParams = {
    offset?: number
    name?: string
    verificationStatus?: "PENDING" | "APPROVED" | "REJECTED"
    createdAt?: string
}

class OrganizerServiceClass {
    async find(params?: TFindOrganizersParams): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string | number> = {}
        
        if (params?.offset !== undefined) queryParams.offset = params.offset
        if (params?.name) queryParams.name = params.name
        if (params?.verificationStatus) queryParams.verificationStatus = params.verificationStatus
        if (params?.createdAt) queryParams.createdAt = params.createdAt

        const response = (await API.GET({
            prefix: "/user",
            url: "/organizers",
            params: queryParams
        }))?.data

        return response
    }

    async updateVerificationStatus(organizerId: string, status: "APPROVED" | "REJECTED"): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/user",
            url: `/organizers/${organizerId}/verification-status`,
            data: { verificationStatus: status }
        }))?.data

        return response
    }

    async update(payload: TOrganizerUpdate): Promise<AxiosResponse["data"]> {
        const formData = new FormData()

        if (payload.firstName) formData.append("firstName", payload.firstName)
        if (payload.lastName) formData.append("lastName", payload.lastName)
        if (payload.birth) formData.append("birth", payload.birth)
        if (payload.document) formData.append("document", payload.document)
        if (payload.companyName) formData.append("companyName", payload.companyName)
        if (payload.companyDocument) formData.append("companyDocument", payload.companyDocument)
        if (payload.companyAddress) formData.append("companyAddress", payload.companyAddress)
        if (payload.bankId) formData.append("bankId", payload.bankId)
        if (payload.bankAccountName) formData.append("bankAccountName", payload.bankAccountName)
        if (payload.bankAccountOwnerName) formData.append("bankAccountOwnerName", payload.bankAccountOwnerName)
        if (payload.bankAccountOwnerBirth) formData.append("bankAccountOwnerBirth", payload.bankAccountOwnerBirth)
        if (payload.bankAccountOwnerDocument) formData.append("bankAccountOwnerDocument", payload.bankAccountOwnerDocument)
        if (payload.bankAccountAgency) formData.append("bankAccountAgency", payload.bankAccountAgency)
        if (payload.bankAccountNumber) formData.append("bankAccountNumber", payload.bankAccountNumber)
        if (payload.bankAccountDigit) formData.append("bankAccountDigit", payload.bankAccountDigit)
        if (payload.bankAccountType) formData.append("bankAccountType", payload.bankAccountType)
        if (payload.pixAddressKey) formData.append("pixAddressKey", payload.pixAddressKey)
        if (payload.pixAddressType) formData.append("pixAddressType", payload.pixAddressType)
        if (payload.payoutMethod) formData.append("payoutMethod", payload.payoutMethod)
        if (payload.identityDocumentFronUrl) {
            if (payload.identityDocumentFronUrl instanceof File) {
                formData.append("identityDocumentFront", payload.identityDocumentFronUrl)
            } else {
                formData.append("identityDocumentFronUrl", payload.identityDocumentFronUrl)
            }
        }
        if (payload.identityDocumentBackUrl) {
            if (payload.identityDocumentBackUrl instanceof File) {
                formData.append("identityDocumentBack", payload.identityDocumentBackUrl)
            } else {
                formData.append("identityDocumentBackUrl", payload.identityDocumentBackUrl)
            }
        }
        if (payload.identityDocumentSelfieUrl) {
            if (payload.identityDocumentSelfieUrl instanceof File) {
                formData.append("identityDocumentSelfie", payload.identityDocumentSelfieUrl)
            } else {
                formData.append("identityDocumentSelfieUrl", payload.identityDocumentSelfieUrl)
            }
        }
        if (payload.description && payload.description.trim()) formData.append("description", payload.description.trim())
        if (payload.logo) {
            if (payload.logo instanceof File) {
                formData.append("logo", payload.logo)
            } else {
                formData.append("logoUrl", payload.logo)
            }
        }
        if (payload.instagramUrl) formData.append("instagramUrl", payload.instagramUrl)
        if (payload.facebookUrl) formData.append("facebookUrl", payload.facebookUrl)
        if (payload.supportEmail) formData.append("supportEmail", payload.supportEmail)
        if (payload.supportPhone) formData.append("supportPhone", payload.supportPhone)

        const response = (await API.POST_FILE({
            prefix: "/user",
            url: "/update-organizer",
            formData
        }))?.data

        return response
    }

    async findBanks(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/bank",
            url: ""
        }))?.data

        return response
    }
}

export const OrganizerService = new OrganizerServiceClass()

