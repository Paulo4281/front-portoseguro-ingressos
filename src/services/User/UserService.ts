import { API } from "@/api/api"
import type { TUserCreate, TUserResetPasswordByCode, TUserResetPassword, TUserUpdate, TUserConfirmSocial } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResaleSalesByEvent, TRevendaChartSalesBySeller, TSellerListItem } from "@/types/Resale/TResale"
import type { AxiosResponse } from "axios"

class UserServiceClass {
    async create(data: TUserCreate): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/",
            data: data
        }))?.data
        return response
    }

    /** Cria CUSTOMER por revendedor (Auth + Seller). Gera confirmPasswordCode e envia e-mail. */
    async createCustomer(data: {
        firstName: string
        lastName: string
        email: string
        phone: string
        document: string
    }): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/create-customer",
            data
        }))?.data
        return response
    }

    /** Define senha com código recebido por e-mail (rota pública). */
    async confirmPassword(code: string, password: string): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: `/confirm-password/${encodeURIComponent(code)}`,
            data: { password }
        }))?.data
        return response
    }

    async checkEmailExists(email: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/check-email-exists",
            data: { email }
        }))?.data
        return response
    }

    async checkPassword(password: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/check-password",
            data: { password }
        }))?.data
        return response
    }

    async checkPasswordAdmin(password: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/check-password-admin",
            data: { password }
        }))?.data
        return response
    }

    async resetPassword(data: TUserResetPassword): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/reset-password",
            data: data
        }))?.data
        return response
    }

    async resetPasswordByCode(data: TUserResetPasswordByCode): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/reset-password-by-code",
            data: data
        }))?.data
        return response
    }

    async loginWithGoogle(googleAuthToken: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/user",
            url: `/google/sub/${googleAuthToken}`
        }))?.data
        return response
    }

    async confirmSocial(data: TUserConfirmSocial): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/confirm-social/google",
            data: data
        }))?.data
        return response
    }

    async update(data: TUserUpdate): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/",
            data: data
        }))?.data
        return response
    }

    async updateEmailMarketingConsentByToken(token: string): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/user",
            url: "/update-email-marketing-consent-by-token",
            data: { token }
        }))?.data
        return response
    }

    async updateEmailMarketingConsentByUser(): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/user",
            url: "/update-email-marketing-consent-by-user"
        }))?.data
        return response
    }

    async uploadProfilePicture(file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        formData.append("image", file)

        const response = (await API.POST_FILE({
            prefix: "/user",
            url: "/upload-profile-picture",
            formData
        }))?.data
        return response
    }

    async updateWebpush(data: { endpoint: string; p256dh: string; auth: string }): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/webpush",
            data: data
        }))?.data
        return response
    }

    async getOrganizerSupportInfo(organizerId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/user",
            url: `/organizer/get-support-info/${organizerId}`
        }))?.data
        return response
    }

    async createSeller(data: {
        firstName: string
        lastName: string
        email: string
        phone: string
        document: string
        password: string
        invitationCode: string
    }): Promise<TApiResponse> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/create-seller",
            data
        }))?.data
        return response
    }

    async listSellers(): Promise<TApiResponse<TSellerListItem[]>> {
        const response = (await API.GET({
            prefix: "/user",
            url: "/list-sellers"
        }))?.data
        return response
    }

    async toggleSellerActive(data: { sellerId: string; sellerActive: boolean }): Promise<TApiResponse> {
        const response = (await API.PATCH({
            prefix: "/user",
            url: "/toggle-seller-active",
            data
        }))?.data
        return response
    }

    async updateSeller(data: { sellerId: string; sellerCommissionRate: number }): Promise<TApiResponse> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/update-seller",
            data
        }))?.data
        return response
    }

    async deleteSeller(data: { sellerId: string }): Promise<TApiResponse> {
        const response = (await API.PATCH({
            prefix: "/user",
            url: "/delete-seller",
            data
        }))?.data
        return response
    }

    /** Métricas: vendas (ingressos + receita) por revendedor. GET /user/organizer/resale/chart-sales-by-seller */
    async getOrganizerResaleChartSalesBySeller(): Promise<TApiResponse<TRevendaChartSalesBySeller[]>> {
        const response = (await API.GET({
            prefix: "/user",
            url: "/organizer/resale/chart-sales-by-seller"
        }))?.data
        return response
    }

    /** Métricas: vendas por evento por revendedor (eficiência). GET /user/organizer/resale/sales-by-event */
    async getOrganizerResaleSalesByEvent(): Promise<TApiResponse<TResaleSalesByEvent[]>> {
        const response = (await API.GET({
            prefix: "/user",
            url: "/organizer/resale/sales-by-event"
        }))?.data
        return response
    }

    async updateSellerPayoutConfig(data: {
        sellerBankId?: string | null
        sellerBankAccountName?: string | null
        sellerBankAccountOwnerName?: string | null
        sellerBankAccountOwnerBirth?: string | null
        sellerBankAccountOwnerDocumentType?: "CPF" | "CNPJ" | null
        sellerBankAccountOwnerDocument?: string | null
        sellerBankAccountAgency?: string | null
        sellerBankAccountNumber?: string | null
        sellerBankAccountDigit?: string | null
        sellerBankAccountType?: "CONTA_CORRENTE" | "CONTA_POUPANCA" | null
        sellerPixAddressKey?: string | null
        sellerPixAddressType?: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP" | null
        sellerPayoutMethod?: "PIX" | "BANK_ACCOUNT" | null
    }): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/seller-payout-config",
            data
        }))?.data
        return response
    }
}

export const UserService = new UserServiceClass()