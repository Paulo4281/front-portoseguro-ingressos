import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TTicket, TTicketBuy, TTicketScanLinkGenerateResponse, TTicketScanResponse, TTicketScanLink, TTicketScanLinkCreate, TTicketScanLinkDelete, TTicketQRCodeResponse, TTicketToOrganizer } from "@/types/Ticket/TTicket"
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

const generateMockTicketsToOrganizer = (eventId: string): TTicketToOrganizer[] => {
    const statuses: Array<"CONFIRMED" | "USED" | "REFUNDED"> = ["CONFIRMED", "USED", "REFUNDED"]
    const names = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Souza", "Julia Ferreira", "Lucas Almeida", "Fernanda Lima"]
    const emails = ["joao@example.com", "maria@example.com", "pedro@example.com", "ana@example.com", "carlos@example.com", "julia@example.com", "lucas@example.com", "fernanda@example.com"]
    const phones = ["(73) 99999-9999", "(73) 88888-8888", "(73) 77777-7777", "(73) 66666-6666", "(73) 55555-5555", "(73) 44444-4444", "(73) 33333-3333", "(73) 22222-2222"]
    const ticketTypes = [
        { id: "type-1", name: "Inteira", description: null },
        { id: "type-2", name: "VIP", description: "Acesso VIP" },
        { id: "type-3", name: "Meia", description: "Meia entrada" }
    ]

    const tickets: TTicketToOrganizer[] = []
    
    for (let i = 0; i < 75; i++) {
        const nameIndex = i % names.length
        const statusIndex = i % statuses.length
        const typeIndex = i % ticketTypes.length
        
        tickets.push({
            id: `ticket-${eventId}-${i + 1}`,
            customer: {
                id: `user-${i + 1}`,
                name: names[nameIndex],
                email: emails[nameIndex],
                phone: phones[nameIndex],
                document: `${String(i + 1).padStart(11, "0")}`,
                nationality: "Brasileira",
                gender: i % 2 === 0 ? "MALE" : "FEMALE",
                birth: `199${i % 10}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
                image: null
            },
            status: statuses[statusIndex],
            ticketType: ticketTypes[typeIndex],
            price: (5000 + (i % 5) * 1000),
            form: i % 3 === 0 ? {
                text: [
                    { label: "Nome completo", answer: names[nameIndex] }
                ],
                email: null,
                textArea: null,
                select: null,
                multiSelect: null
            } : null,
            createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        })
    }
    
    return tickets
}

const mockTicketsToOrganizer: Record<string, TTicketToOrganizer[]> = {}

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

    async findByEventIdToOrganizer(eventId: string, offset: number = 0, limit: number = 30, search?: string, status?: string): Promise<AxiosResponse["data"]> {
        if (!mockTicketsToOrganizer[eventId]) {
            mockTicketsToOrganizer[eventId] = generateMockTicketsToOrganizer(eventId)
        }
        
        let filteredTickets = [...mockTicketsToOrganizer[eventId]]
        
        if (search) {
            const searchLower = search.toLowerCase()
            filteredTickets = filteredTickets.filter(ticket => 
                ticket.customer.name.toLowerCase().includes(searchLower) ||
                ticket.customer.email.toLowerCase().includes(searchLower) ||
                (ticket.customer.phone && ticket.customer.phone.includes(search))
            )
        }
        
        if (status && status !== "ALL") {
            filteredTickets = filteredTickets.filter(ticket => ticket.status === status)
        }
        
        const total = filteredTickets.length
        const paginatedTickets = filteredTickets.slice(offset, offset + limit)
        
        return {
            success: true,
            data: {
                data: paginatedTickets,
                total,
                limit,
                offset
            }
        }
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
        const response = (await API.GET({
            prefix: "/ticket",
            url: `/generate-ticket-qrcode/${ticketId}`
        }))?.data
        return response
    }

    async findByUserId(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/ticket",
            url: "/user"
        }))?.data
        return response
    }
}

export const TicketService = new TicketServiceClass()