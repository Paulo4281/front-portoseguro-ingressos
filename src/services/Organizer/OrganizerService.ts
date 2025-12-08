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

    async acceptOrganizer(organizerId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/accept-organizer",
            data: { organizerId }
        }))?.data

        return response
    }

    async rejectOrganizer(organizerId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/reject-organizer",
            data: { organizerId }
        }))?.data

        return response
    }

    async update(payload: TOrganizerUpdate): Promise<AxiosResponse["data"]> {
        const formData = new FormData()

        console.log(payload)

        if (payload.firstName) formData.append("firstName", payload.firstName)
        if (payload.lastName) formData.append("lastName", payload.lastName)
        if (payload.birth !== undefined) formData.append("birth", payload.birth || "")
        if (payload.document !== undefined) formData.append("document", payload.document || "")
        if (payload.nationality !== undefined) formData.append("nationality", payload.nationality || "")
        if (payload.gender !== undefined) formData.append("gender", payload.gender || "")
        if (payload.companyName !== undefined) formData.append("companyName", payload.companyName || "")
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
        if (payload.instagramUrl !== undefined) formData.append("instagramUrl", payload.instagramUrl || "")
        if (payload.facebookUrl !== undefined) formData.append("facebookUrl", payload.facebookUrl || "")
        if (payload.supportEmail !== undefined) formData.append("supportEmail", payload.supportEmail || "")
        if (payload.supportPhone !== undefined) formData.append("supportPhone", payload.supportPhone || "")

        if (payload.address) {
            if (payload.address.street !== undefined) formData.append("address[street]", payload.address.street || "")
            if (payload.address.number !== undefined) formData.append("address[number]", payload.address.number || "")
            if (payload.address.complement !== undefined) formData.append("address[complement]", payload.address.complement || "")
            if (payload.address.neighborhood !== undefined) formData.append("address[neighborhood]", payload.address.neighborhood || "")
            if (payload.address.city !== undefined) formData.append("address[city]", payload.address.city || "")
            if (payload.address.state !== undefined) formData.append("address[state]", payload.address.state || "")
            if (payload.address.country !== undefined) formData.append("address[country]", payload.address.country || "")
            if (payload.address.zipCode !== undefined) formData.append("address[zipCode]", payload.address.zipCode || "")
        }

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

