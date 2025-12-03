import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TTicket, TTicketBuy, TTicketScanLinkGenerateResponse, TTicketScanResponse, TTicketScanLink, TTicketScanLinkCreate, TTicketScanLinkDelete, TTicketQRCodeResponse } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

const mockTicketScanResponse: TApiResponse<TTicketScanResponse> = {
    success: true,
    data: {
        status: "VALID",
        description: null
    }
}

const mockTicketScanLinkGenerateResponse: TApiResponse<TTicketScanLinkGenerateResponse> = {
    success: true,
    data: {
        link: "https://www.google.com"
    }
}

const mockScanLinks: TTicketScanLink[] = []

class TicketServiceClass {
    async buy(data: TTicketBuy): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: "/buy",
            data: data
        }))?.data
        return response
    }

    async scan(): Promise<AxiosResponse["data"]> {
        return mockTicketScanResponse
    }

    async generateScanLink(): Promise<AxiosResponse["data"]> {
        return mockTicketScanLinkGenerateResponse
    }

    async createScanLink(data: TTicketScanLinkCreate): Promise<AxiosResponse["data"]> {
        const newLink: TTicketScanLink = {
            id: `link-${Date.now()}`,
            link: `${window.location.origin}/qr-scan-link/${Date.now()}`,
            maxUsers: data.maxUsers,
            currentUsers: 0,
            password: data.password,
            createdAt: new Date().toISOString()
        }
        mockScanLinks.push(newLink)
        return {
            success: true,
            data: newLink
        }
    }

    async getScanLinks(): Promise<AxiosResponse["data"]> {
        return {
            success: true,
            data: mockScanLinks
        }
    }

    async deleteScanLink(data: TTicketScanLinkDelete): Promise<AxiosResponse["data"]> {
        const index = mockScanLinks.findIndex(link => link.id === data.linkId)
        if (index >= 0) {
            mockScanLinks.splice(index, 1)
        }
        return {
            success: true,
            data: null
        }
    }

    async scanWithData(qrData: string): Promise<AxiosResponse["data"]> {
        console.log("Enviando dados do QR Code para o servidor:", qrData)
        return mockTicketScanResponse
    }

    async getTicketQRCode(ticketId: string): Promise<AxiosResponse["data"]> {
        const mockJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6InRpY2tldC0xIiwiaWF0IjoxNzM1NzY4MDAwfQ.mock"
        
        return {
            success: true,
            data: {
                t: mockJWT
            } as TTicketQRCodeResponse
        }
    }

    async findByUserId(userId: string): Promise<TApiResponse<TTicket[]> | any> {
        if (!userId) {
            return {
                success: false,
                data: []
            }
        }

        const mockTickets: TTicket[] = [
            {
                id: "ticket-1",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6InRpY2tldC0xIn0.mock",
                status: "CONFIRMED",
                eventId: "event-1",
                eventBatchId: "batch-1",
                eventDateId: "date-1",
                ticketTypeId: null,
                userId: userId,
                paymentId: "payment-1",
                form: null,
                usedAt: null,
                price: 5000,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                event: {
                    id: "event-1",
                    name: "Festival de Verão 2026",
                    description: "O maior festival de verão de Porto Seguro",
                    location: "Praia de Taperapuã",
                    image: "https://static-cse.canva.com/blob/1534622/eventocorporativo1.45438858.jpg",
                    price: 5000,
                    tickets: null,
                    userId: "organizer-1",
                    organizerId: "organizer-1",
                    isFree: false,
                    isClientTaxed: true,
                    maxInstallments: 9,
                    isActive: true,
                    isDeleted: false,
                    isOnline: false,
                    isCancelled: false,
                    isPostponed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    form: null,
                    isFormForEachTicket: false,
                    buyTicketsLimit: 10,
                    EventDates: [
                        {
                            id: "date-1",
                            date: "2026-02-15T00:00:00.000Z",
                            hourStart: "18:00",
                            hourEnd: "23:00",
                            eventId: "event-1",
                            hasSpecificPrice: false,
                            price: null,
                            EventDateTicketTypePrices: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: null
                        }
                    ],
                    EventBatches: [],
                    EventCategoryEvents: [],
                    TicketTypes: [],
                    Recurrence: null,
                    Organizer: {
                        id: "organizer-1",
                        userId: "user-1",
                        companyName: "Organizador Exemplo",
                        companyDocument: null,
                        companyAddress: null,
                        description: null,
                        logo: null,
                        bankId: null,
                        bankAccountName: null,
                        bankAccountOwnerName: null,
                        bankAccountOwnerBirth: null,
                        bankAccountOwnerDocument: null,
                        bankAccountAgency: null,
                        bankAccountNumber: null,
                        bankAccountDigit: null,
                        bankAccountType: null,
                        pixAddressKey: null,
                        pixAddressType: null,
                        payoutMethod: null,
                        identityDocumentFront: null,
                        identityDocumentBack: null,
                        identityDocumentSelfie: null,
                        instagramUrl: null,
                        facebookUrl: null,
                        supportEmail: null,
                        supportPhone: null,
                        verificationStatus: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: null
                    } as any
                },
                eventBatch: {
                    id: "batch-1",
                    eventId: "event-1",
                    startDate: "2026-01-01T00:00:00.000Z",
                    endDate: "2026-02-10T00:00:00.000Z",
                    isActive: true,
                    name: "Lote Promocional",
                    price: 5000,
                    tickets: 100,
                    autoActivateNext: false,
                    accumulateUnsold: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    EventBatchTicketTypes: []
                }
            },
            {
                id: "ticket-2",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6InRpY2tldC0yIn0.mock",
                status: "CONFIRMED",
                eventId: "event-2",
                eventBatchId: "batch-2",
                eventDateId: "date-2",
                ticketTypeId: "ticket-type-1",
                userId: userId,
                paymentId: "payment-2",
                price: 8000,
                form: {
                    text: [
                        { label: "Nome completo", answer: "João Silva" },
                        { label: "CPF", answer: "123.456.789-00" }
                    ],
                    email: [
                        { label: "E-mail de contato", answer: "joao@example.com" }
                    ],
                    textArea: [
                        { label: "Observações especiais", answer: "Preciso de acesso para cadeirante" }
                    ],
                    select: [
                        { label: "Como conheceu o evento?", answer: "Redes sociais" }
                    ],
                    multiSelect: null
                },
                usedAt: null,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                event: {
                    id: "event-2",
                    name: "Show Nacional em Porto Seguro",
                    description: "Grande show com artistas nacionais",
                    location: "Arena Porto Seguro",
                    image: "https://cdn.webi.com.br/wp-content/uploads/2024/08/evento-corporativo-o-que-e-e-como-aproveitar-com-sua-empresa-2-1024x576.jpg",
                    price: 8000,
                    tickets: null,
                    userId: "organizer-2",
                    organizerId: "organizer-2",
                    isFree: false,
                    isClientTaxed: true,
                    maxInstallments: 6,
                    isActive: true,
                    isDeleted: false,
                    isOnline: false,
                    isCancelled: false,
                    isPostponed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    form: null,
                    isFormForEachTicket: true,
                    buyTicketsLimit: 5,
                    EventDates: [
                        {
                            id: "date-2",
                            date: "2026-03-20T00:00:00.000Z",
                            hourStart: "20:00",
                            hourEnd: "23:30",
                            eventId: "event-2",
                            hasSpecificPrice: false,
                            price: null,
                            EventDateTicketTypePrices: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: null
                        }
                    ],
                    EventBatches: [],
                    EventCategoryEvents: [],
                    TicketTypes: [
                        {
                            id: "ticket-type-1",
                            name: "VIP",
                            description: "Acesso VIP com área exclusiva",
                            eventId: "event-2"
                        }
                    ],
                    Recurrence: null,
                    Organizer: {
                        id: "organizer-2",
                        userId: "user-2",
                        companyName: "Produtora Nacional",
                        companyDocument: null,
                        companyAddress: null,
                        description: null,
                        logo: null,
                        bankId: null,
                        bankAccountName: null,
                        bankAccountOwnerName: null,
                        bankAccountOwnerBirth: null,
                        bankAccountOwnerDocument: null,
                        bankAccountAgency: null,
                        bankAccountNumber: null,
                        bankAccountDigit: null,
                        bankAccountType: null,
                        pixAddressKey: null,
                        pixAddressType: null,
                        payoutMethod: null,
                        identityDocumentFront: null,
                        identityDocumentBack: null,
                        identityDocumentSelfie: null,
                        instagramUrl: null,
                        facebookUrl: null,
                        supportEmail: null,
                        supportPhone: null,
                        verificationStatus: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: null
                    } as any
                },
                eventBatch: {
                    id: "batch-2",
                    eventId: "event-2",
                    startDate: "2026-02-01T00:00:00.000Z",
                    endDate: "2026-03-15T00:00:00.000Z",
                    isActive: true,
                    name: "Lote VIP",
                    price: 8000,
                    tickets: 50,
                    autoActivateNext: false,
                    accumulateUnsold: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    EventBatchTicketTypes: []
                },
                TicketType: {
                    id: "ticket-type-1",
                    name: "VIP",
                    description: "Acesso VIP com área exclusiva"
                } as any
            },
            {
                id: "ticket-3",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6InRpY2tldC0zIn0.mock",
                status: "PENDING",
                eventId: "event-3",
                eventBatchId: "batch-3",
                eventDateId: "date-3",
                ticketTypeId: null,
                userId: userId,
                paymentId: null,
                form: null,
                usedAt: null,
                price: 3000,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
                event: {
                    id: "event-3",
                    name: "Workshop de Arte",
                    description: "Workshop prático de técnicas artísticas",
                    location: "Centro Cultural",
                    image: "https://agencia352.com/blog/wp-content/uploads/2020/08/evento-online.jpg",
                    price: 3000,
                    tickets: null,
                    userId: "organizer-3",
                    organizerId: "organizer-3",
                    isFree: false,
                    isClientTaxed: true,
                    maxInstallments: 3,
                    isActive: true,
                    isDeleted: false,
                    isOnline: false,
                    isCancelled: false,
                    isPostponed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    form: null,
                    isFormForEachTicket: false,
                    buyTicketsLimit: 10,
                    EventDates: [
                        {
                            id: "date-3",
                            date: "2026-04-10T00:00:00.000Z",
                            hourStart: "14:00",
                            hourEnd: "18:00",
                            eventId: "event-3",
                            hasSpecificPrice: false,
                            price: null,
                            EventDateTicketTypePrices: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: null
                        }
                    ],
                    EventBatches: [],
                    EventCategoryEvents: [],
                    TicketTypes: [],
                    Recurrence: null,
                    Organizer: {
                        id: "organizer-3",
                        userId: "user-3",
                        companyName: "Centro Cultural",
                        companyDocument: null,
                        companyAddress: null,
                        description: null,
                        logo: null,
                        bankId: null,
                        bankAccountName: null,
                        bankAccountOwnerName: null,
                        bankAccountOwnerBirth: null,
                        bankAccountOwnerDocument: null,
                        bankAccountAgency: null,
                        bankAccountNumber: null,
                        bankAccountDigit: null,
                        bankAccountType: null,
                        pixAddressKey: null,
                        pixAddressType: null,
                        payoutMethod: null,
                        identityDocumentFront: null,
                        identityDocumentBack: null,
                        identityDocumentSelfie: null,
                        instagramUrl: null,
                        facebookUrl: null,
                        supportEmail: null,
                        supportPhone: null,
                        verificationStatus: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: null
                    } as any
                },
                eventBatch: {
                    id: "batch-3",
                    eventId: "event-3",
                    startDate: "2026-01-15T00:00:00.000Z",
                    endDate: "2026-04-05T00:00:00.000Z",
                    isActive: true,
                    name: "Lote único",
                    price: 3000,
                    tickets: 30,
                    autoActivateNext: false,
                    accumulateUnsold: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    EventBatchTicketTypes: []
                }
            }
        ]

        return {
            success: true,
            data: mockTickets
        }
    }
}

export const TicketService = new TicketServiceClass()