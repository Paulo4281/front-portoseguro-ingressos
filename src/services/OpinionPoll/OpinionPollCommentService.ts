import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TOpinionPollCommentCreate, TOpinionPollCommentResponse } from "@/types/OpinionPollComment/TOpinionPollComment"

class OpinionPollCommentServiceClass {
    async create(data: TOpinionPollCommentCreate): Promise<TApiResponse<TOpinionPollCommentResponse>> {
        const response = (await API.POST({
            prefix: "/opinionpoll-comment",
            url: "",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar avaliação")
        }

        return response
    }

    async findByUserId(opinionPollId: string): Promise<TApiResponse<TOpinionPollCommentResponse | null>> {
        const response = (await API.GET({
            prefix: "/opinionpoll-comment",
            url: "",
            params: {
                opinionPollId
            }
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar avaliação do usuário")
        }

        return response
    }
}

export const OpinionPollCommentService = new OpinionPollCommentServiceClass()

