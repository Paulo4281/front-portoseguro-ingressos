import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TSupportCreate, TSupportFindResponse, TSupport } from "@/types/Support/TSupport"
import type { TApiResponse } from "@/types/TApiResponse"

const mockSupports: TSupport[] = [
    {
        id: "support-1",
        subject: "PAYMENT_ISSUES",
        description: "Não consegui receber o repasse do último evento. O valor deveria ter sido transferido há 3 dias mas ainda não caiu na minha conta.",
        image: null,
        status: "ANSWERED",
        answer: "Olá! Verificamos sua solicitação e identificamos que o repasse foi processado com sucesso. O valor de R$ 1.250,00 foi transferido para a conta cadastrada (Banco: 001, Agência: 1234, Conta: 56789-0) no dia 15/01/2025. Por favor, verifique o extrato bancário ou entre em contato com seu banco caso não tenha recebido. Se o problema persistir, podemos reenviar o comprovante da transferência.",
        createdAt: "2025-01-10T14:30:00Z",
        updatedAt: "2025-01-12T10:15:00Z"
    },
    {
        id: "support-2",
        subject: "TECHNICAL_PROBLEMS",
        description: "Ao tentar criar um novo evento, a página fica travada quando clico no botão de salvar. Já tentei em diferentes navegadores e o problema persiste.",
        image: null,
        status: "ANSWERED",
        answer: "Obrigado por reportar o problema! Nossa equipe técnica identificou e corrigiu o bug. Por favor, limpe o cache do navegador (Ctrl+Shift+Delete) e tente novamente. Se o problema continuar, envie um print da tela para que possamos investigar melhor.",
        createdAt: "2025-01-08T09:20:00Z",
        updatedAt: "2025-01-09T16:45:00Z"
    },
    {
        id: "support-3",
        subject: "EVENT_MANAGEMENT",
        description: "Gostaria de saber se é possível editar a data de um evento que já foi publicado e tem ingressos vendidos. Preciso adiar o evento por 1 semana.",
        image: null,
        status: "PENDING",
        answer: null,
        createdAt: "2025-01-15T11:00:00Z",
        updatedAt: "2025-01-15T11:00:00Z"
    },
    {
        id: "support-4",
        subject: "TICKET_SALES",
        description: "Um cliente comprou ingressos mas não recebeu o email com os QR Codes. Como posso reenviar os ingressos para ele?",
        image: null,
        status: "ANSWERED",
        answer: "Você pode reenviar os ingressos diretamente pela plataforma. Acesse a área de ingressos do evento, localize o cliente pelo nome ou email, e clique na opção 'Reenviar ingressos'. Os QR Codes serão enviados automaticamente para o email cadastrado na compra.",
        createdAt: "2025-01-05T16:30:00Z",
        updatedAt: "2025-01-06T09:20:00Z"
    },
    {
        id: "support-5",
        subject: "FEATURE_REQUEST",
        description: "Seria muito útil ter uma opção para exportar relatórios de vendas em Excel. Isso facilitaria muito minha gestão financeira.",
        image: null,
        status: "PENDING",
        answer: null,
        createdAt: "2025-01-14T13:45:00Z",
        updatedAt: "2025-01-14T13:45:00Z"
    },
    {
        id: "support-6",
        subject: "ACCOUNT_ISSUES",
        description: "Esqueci minha senha e não estou conseguindo recuperar. O email de recuperação não está chegando.",
        image: null,
        status: "ANSWERED",
        answer: "Verificamos e o email de recuperação foi enviado com sucesso. Por favor, verifique sua caixa de spam e lixeira. Se ainda não encontrar, entre em contato novamente que podemos reenviar ou alterar manualmente sua senha.",
        createdAt: "2025-01-03T08:15:00Z",
        updatedAt: "2025-01-03T14:30:00Z"
    }
]

class SupportServiceClass {
    async create(data: TSupportCreate): Promise<AxiosResponse["data"]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newSupport: TSupport = {
                    id: `support-${Date.now()}`,
                    subject: data.subject,
                    description: data.description,
                    image: data.image ? `support-image-${Date.now()}.jpg` : null,
                    status: "PENDING",
                    answer: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }

                mockSupports.unshift(newSupport)

                const response: TApiResponse<TSupport> = {
                    success: true,
                    data: newSupport
                }

                resolve(response)
            }, 500)
        })
    }

    async find(): Promise<AxiosResponse["data"]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const response: TApiResponse<TSupportFindResponse> = {
                    success: true,
                    data: {
                        data: mockSupports,
                        total: mockSupports.length
                    }
                }
                resolve(response)
            }, 300)
        })
    }
}

export const SupportService = new SupportServiceClass()
