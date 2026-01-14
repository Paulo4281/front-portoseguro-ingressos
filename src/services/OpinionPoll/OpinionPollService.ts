import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TOpinionPoll, TOpinionPollListResponse } from "@/types/OpinionPoll/TOpinionPoll"

const MOCK_OPINION_POLLS: TOpinionPoll[] = [
    {
        id: "poll-1",
        eventId: "event-1",
        eventName: "Show de Rock em Porto Seguro",
        eventDate: "2024-01-15T20:00:00Z",
        link: "https://portoseguroingressos.com.br/pesquisa?id=abc123def456",
        totalResponses: 45,
        averageRating: 4.6,
        responses: [
            {
                id: "response-1",
                customerName: "João Silva",
                customerEmail: "joao@email.com",
                rating: 5,
                comment: "Evento incrível! Adorei a organização e a qualidade do som.",
                createdAt: "2024-01-16T10:30:00Z"
            },
            {
                id: "response-2",
                customerName: "Maria Santos",
                customerEmail: "maria@email.com",
                rating: 4,
                comment: "Muito bom, só achei que poderia ter mais opções de comida.",
                createdAt: "2024-01-16T11:15:00Z"
            },
            {
                id: "response-3",
                customerName: "Pedro Costa",
                customerEmail: "pedro@email.com",
                rating: 5,
                createdAt: "2024-01-16T12:00:00Z"
            },
            {
                id: "response-4",
                customerName: "Ana Oliveira",
                customerEmail: "ana@email.com",
                rating: 3,
                comment: "Evento razoável, mas esperava mais.",
                createdAt: "2024-01-16T14:20:00Z"
            },
            {
                id: "response-5",
                customerName: "Carlos Mendes",
                customerEmail: "carlos@email.com",
                rating: 5,
                comment: "Perfeito! Já estou ansioso para o próximo evento.",
                createdAt: "2024-01-16T15:45:00Z"
            }
        ],
        createdAt: "2024-01-15T21:00:00Z"
    },
    {
        id: "poll-2",
        eventId: "event-2",
        eventName: "Festa na Praia - Verão 2024",
        eventDate: "2024-02-10T18:00:00Z",
        link: "https://portoseguroingressos.com.br/pesquisa?id=xyz789ghi012",
        totalResponses: 32,
        averageRating: 4.3,
        responses: [
            {
                id: "response-6",
                customerName: "Fernanda Lima",
                customerEmail: "fernanda@email.com",
                rating: 5,
                comment: "Melhor festa da temporada! Ambiente perfeito.",
                createdAt: "2024-02-11T09:00:00Z"
            },
            {
                id: "response-7",
                customerName: "Roberto Alves",
                customerEmail: "roberto@email.com",
                rating: 4,
                createdAt: "2024-02-11T10:30:00Z"
            },
            {
                id: "response-8",
                customerName: "Juliana Ferreira",
                customerEmail: "juliana@email.com",
                rating: 4,
                comment: "Gostei muito, mas o som poderia ser melhor.",
                createdAt: "2024-02-11T11:15:00Z"
            }
        ],
        createdAt: "2024-02-10T19:00:00Z"
    },
    {
        id: "poll-3",
        eventId: "event-3",
        eventName: "Workshop de Gastronomia",
        eventDate: "2024-03-05T14:00:00Z",
        link: "https://portoseguroingressos.com.br/pesquisa?id=mno345pqr678",
        totalResponses: 18,
        averageRating: 4.8,
        responses: [
            {
                id: "response-9",
                customerName: "Lucas Martins",
                customerEmail: "lucas@email.com",
                rating: 5,
                comment: "Workshop excelente! Aprendi muito e me diverti.",
                createdAt: "2024-03-06T08:00:00Z"
            },
            {
                id: "response-10",
                customerName: "Patricia Souza",
                customerEmail: "patricia@email.com",
                rating: 5,
                comment: "Superou minhas expectativas!",
                createdAt: "2024-03-06T09:30:00Z"
            },
            {
                id: "response-11",
                customerName: "Ricardo Nunes",
                customerEmail: "ricardo@email.com",
                rating: 4,
                createdAt: "2024-03-06T10:15:00Z"
            }
        ],
        createdAt: "2024-03-05T15:00:00Z"
    }
]

class OpinionPollServiceClass {
    async findAll(): Promise<TApiResponse<TOpinionPollListResponse>> {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return {
            success: true,
            data: {
                data: MOCK_OPINION_POLLS,
                total: MOCK_OPINION_POLLS.length
            }
        }
    }

    async findByEventId(eventId: string): Promise<TApiResponse<TOpinionPoll>> {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const poll = MOCK_OPINION_POLLS.find(p => p.eventId === eventId)
        
        if (!poll) {
            throw new Error("Pesquisa de opinião não encontrada")
        }

        return {
            success: true,
            data: poll
        }
    }
}

export const OpinionPollService = new OpinionPollServiceClass()

