import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TBillboard, TBillboardListItem, TBillboardCreate, TBillboardUpdate } from "@/types/Billboard/TBillboard"

class BillboardServiceClass {
    /** Lista para o front (público). GET /billboard/client */
    async getClient(): Promise<TApiResponse<TBillboard[]>> {
        const response = await API.GET({
            prefix: "/billboard",
            url: "/client"
        })
        return response?.data ?? { success: false, message: "Não foi possível listar os billboards" }
    }

    /** Lista todos (admin). GET /billboard/ */
    async find(): Promise<TApiResponse<TBillboardListItem[]>> {
        const response = await API.GET({
            prefix: "/billboard",
            url: ""
        })
        return response?.data ?? { success: false, message: "Não foi possível listar os billboards" }
    }

    /** Cria billboard (admin). POST /billboard/ */
    async create(payload: TBillboardCreate): Promise<TApiResponse<TBillboard>> {
        const formData = new FormData()
        formData.append("type", payload.type)
        formData.append("frontendAreaId", payload.frontendAreaId)
        formData.append("altText", payload.altText)
        if (payload.gotoLink != null && payload.gotoLink !== "") formData.append("gotoLink", payload.gotoLink)
        formData.append("image", payload.image)

        const response = await API.POST_FILE({
            prefix: "/billboard",
            url: "",
            data: {},
            formData
        })
        return response?.data ?? { success: false, message: "Não foi possível criar o billboard" }
    }

    /** Atualiza billboard (admin). PUT /billboard/ */
    async update(payload: TBillboardUpdate): Promise<TApiResponse<TBillboard>> {
        const formData = new FormData()
        formData.append("id", payload.id)
        if (payload.type != null) formData.append("type", payload.type)
        if (payload.altText != null) formData.append("altText", payload.altText)
        if (payload.gotoLink !== undefined) formData.append("gotoLink", payload.gotoLink ?? "")
        if (payload.image) formData.append("image", payload.image)

        const response = await API.PUT_FILE({
            prefix: "/billboard",
            url: "",
            data: {},
            formData
        })
        return response?.data ?? { success: false, message: "Não foi possível atualizar o billboard" }
    }

    /** Remove billboard e imagem no bucket (admin). DELETE /billboard/:id */
    async delete(id: string): Promise<TApiResponse> {
        const response = await API.DELETE({
            prefix: "/billboard",
            url: `/${id}`
        })
        return response?.data ?? { success: false, message: "Não foi possível excluir o billboard" }
    }
}

export const BillboardService = new BillboardServiceClass()
