import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type {
    TNotaFiscalListAdminParams,
    TNotaFiscalListOrganizerParams,
    TNotaFiscalUploadByAdmin
} from "@/types/NotaFiscal/TNotaFiscal"

class NotaFiscalServiceClass {
    // CUSTOMER
    async getPdfLinkByClientPaymentId(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: `/pdf/client/${encodeURIComponent(paymentId)}`
        }))?.data
        return response
    }

    async getXmlLinkByClientPaymentId(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: `/xml/client/${encodeURIComponent(paymentId)}`
        }))?.data
        return response
    }

    async requestClientNotaFiscal(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/notafiscal",
            url: `/request/client/${encodeURIComponent(paymentId)}`
        }))?.data
        return response
    }

    // ORGANIZER
    async getPdfLinkByOrganizerId(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: `/pdf/organizer/${encodeURIComponent(id)}`
        }))?.data
        return response
    }

    async getXmlLinkByOrganizerId(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: `/xml/organizer/${encodeURIComponent(id)}`
        }))?.data
        return response
    }

    async uploadPdfByOrganizer(paymentId: string, file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        formData.append("paymentId", paymentId)
        formData.append("file", file)

        const response = (await API.POST_FILE({
            prefix: "/notafiscal",
            url: "/pdf/by-organizer",
            formData
        }))?.data
        return response
    }

    async uploadXmlByOrganizer(paymentId: string, file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        formData.append("paymentId", paymentId)
        formData.append("file", file)

        const response = (await API.POST_FILE({
            prefix: "/notafiscal",
            url: "/xml/by-organizer",
            formData
        }))?.data
        return response
    }

    async requestOrganizerNotaFiscal(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/notafiscal",
            url: `/request/organizer/${encodeURIComponent(id)}`
        }))?.data
        return response
    }

    async listOrganizer(params?: TNotaFiscalListOrganizerParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: "/all-nf/organizer",
            params
        }))?.data
        return response
    }

    async listOrganizerByPayment(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: `/all-nf/organizer/clients/${encodeURIComponent(paymentId)}`
        }))?.data
        return response
    }

    async deletePdfByOrganizer(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/notafiscal",
            url: `/pdf/organizer/${encodeURIComponent(id)}`
        }))?.data
        return response
    }

    async deleteXmlByOrganizer(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/notafiscal",
            url: `/xml/organizer/${encodeURIComponent(id)}`
        }))?.data
        return response
    }

    // ADMIN
    async listAdmin(params?: TNotaFiscalListAdminParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notafiscal",
            url: "/all-nf/admin",
            params: params
        }))?.data
        return response
    }

    async uploadPdfByAdmin(params: TNotaFiscalUploadByAdmin, file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        if (params.id) formData.append("id", params.id)
        if (params.userIdOwner) formData.append("userIdOwner", params.userIdOwner)
        if (params.yearReference !== undefined) formData.append("yearReference", params.yearReference.toString())
        if (params.monthReference !== undefined) formData.append("monthReference", params.monthReference.toString())
        formData.append("file", file)

        const response = (await API.POST_FILE({
            prefix: "/notafiscal",
            url: "/pdf/by-admin",
            formData
        }))?.data
        return response
    }

    async uploadXmlByAdmin(params: TNotaFiscalUploadByAdmin, file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        if (params.id) formData.append("id", params.id)
        if (params.userIdOwner) formData.append("userIdOwner", params.userIdOwner)
        if (params.yearReference !== undefined) formData.append("yearReference", params.yearReference.toString())
        if (params.monthReference !== undefined) formData.append("monthReference", params.monthReference.toString())
        formData.append("file", file)

        const response = (await API.POST_FILE({
            prefix: "/notafiscal",
            url: "/xml/by-admin",
            formData
        }))?.data
        return response
    }

    async deletePdfByAdmin(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/notafiscal",
            url: `/pdf/admin/${encodeURIComponent(id)}`
        }))?.data
        return response
    }

    async deleteXmlByAdmin(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/notafiscal",
            url: `/xml/admin/${encodeURIComponent(id)}`
        }))?.data
        return response
    }
}

export const NotaFiscalService = new NotaFiscalServiceClass()
