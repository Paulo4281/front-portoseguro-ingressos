import type { TCoupon, TCouponCheckRequest } from "@/types/Coupon/TCoupon"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"
import { API } from "@/api/api"

type TCouponCreatePayload = {
    code: string
    eventId: string
    discountType: TCoupon["discountType"]
    discountValue: number
    expirationDate?: string | null
    usageLimit?: number | null
}

type TCouponUpdatePayload = {
    code?: string
    discountType?: TCoupon["discountType"]
    discountValue?: number
    expirationDate?: string | null
    usageLimit?: number | null
}

class CouponServiceClass {
    async find(): Promise<AxiosResponse["data"]> {
        const response = await API.GET({
            prefix: "/coupon",
            url: ""
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível buscar os cupons"
        }
    }

    async check(data: TCouponCheckRequest): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/coupon",
            url: "/check",
            data: data
        }))?.data
        return response
    }

    async create(payload: TCouponCreatePayload): Promise<AxiosResponse["data"]> {
        const expirationDate = payload.expirationDate 
            ? payload.expirationDate.split("T")[0] 
            : null

        const response = await API.POST({
            prefix: "/coupon",
            url: "",
            data: {
                code: payload.code.toUpperCase(),
                eventId: payload.eventId,
                discountType: payload.discountType,
                discountValue: payload.discountValue,
                expirationDate,
                usageLimit: payload.usageLimit ?? null,
            }
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível criar o cupom"
        }
    }

    async update(id: string, payload: TCouponUpdatePayload): Promise<AxiosResponse["data"]> {
        const updateData: TCouponUpdatePayload = {}

        if (payload.code !== undefined) {
            updateData.code = payload.code.toUpperCase()
        }
        if (payload.discountType !== undefined) {
            updateData.discountType = payload.discountType
        }
        if (payload.discountValue !== undefined) {
            updateData.discountValue = payload.discountValue
        }
        if (payload.expirationDate !== undefined) {
            updateData.expirationDate = payload.expirationDate 
                ? payload.expirationDate.split("T")[0] 
                : null
        }
        if (payload.usageLimit !== undefined) {
            updateData.usageLimit = payload.usageLimit ?? null
        }

        const response = await API.PUT({
            prefix: "/coupon",
            url: `/${id}`,
            data: updateData
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível atualizar o cupom"
        }
    }

    async updateIsActive(id: string): Promise<AxiosResponse["data"]> {
        const response = await API.PATCH({
            prefix: "/coupon",
            url: `/${id}`,
            data: {}
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível atualizar o status do cupom"
        }
    }

    async deleteById(id: string): Promise<AxiosResponse["data"]> {
        const response = await API.DELETE({
            prefix: "/coupon",
            url: `/${id}`
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível excluir o cupom"
        }
    }
}

export const CouponService = new CouponServiceClass()