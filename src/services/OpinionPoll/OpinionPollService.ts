import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TOpinionPoll, TOpinionPollByCodeResponse } from "@/types/OpinionPoll/TOpinionPoll"

class OpinionPollServiceClass {
    async findAll(): Promise<TApiResponse<TOpinionPoll[]>> {
        const response = (await API.GET({
            prefix: "/opinionpoll",
            url: ""
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar pesquisas de opinião")
        }

        return response
    }

    async findByCode(code: string): Promise<TApiResponse<TOpinionPollByCodeResponse | null>> {
        const response = (await API.GET({
            prefix: "/opinionpoll",
            url: `/${code}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar pesquisa de opinião")
        }

        return response
    }
}

export const OpinionPollService = new OpinionPollServiceClass()

