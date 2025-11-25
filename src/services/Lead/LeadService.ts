import type { TLead } from "@/types/Lead/TLead"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"

const mockLeads: TApiResponse<TLead[]> = {
    success: true,
    data: [
        {
            id: "1",
            userId: "user-1",
            firstName: "João",
            lastName: "Silva",
            email: "joao.silva@email.com",
            phone: "(73) 99999-9999",
            birth: "1990-05-15",
            device: "MOBILE",
            address: {
                street: "Rua da Praia",
                number: "123",
                complement: "Apto 101",
                neighborhood: "Centro",
                city: "Porto Seguro",
                state: "BA",
                country: "Brasil",
                zipCode: "45810-000"
            },
            totalEventsPurchased: 3,
            events: [
                {
                    id: "event-1",
                    eventId: "evt-1",
                    eventName: "Festival de Verão 2025",
                    purchaseId: "purchase-1",
                    purchaseDate: "2025-01-10T14:30:00Z",
                    purchaseValue: 20000,
                    ticketsCount: 2
                },
                {
                    id: "event-2",
                    eventId: "evt-2",
                    eventName: "Show de Samba na Praia",
                    purchaseId: "purchase-2",
                    purchaseDate: "2025-01-15T10:00:00Z",
                    purchaseValue: 7500,
                    ticketsCount: 1
                },
                {
                    id: "event-3",
                    eventId: "evt-3",
                    eventName: "Festa Junina Porto Seguro",
                    purchaseId: "purchase-3",
                    purchaseDate: "2025-02-01T16:45:00Z",
                    purchaseValue: 40000,
                    ticketsCount: 4
                }
            ],
            createdAt: "2025-01-10T14:30:00Z"
        },
        {
            id: "2",
            userId: "user-2",
            firstName: "Maria",
            lastName: "Santos",
            email: "maria.santos@email.com",
            phone: "(73) 98888-8888",
            birth: "1985-08-22",
            device: "DESKTOP",
            address: {
                street: "Avenida Beira Mar",
                number: "456",
                complement: null,
                neighborhood: "Taperapuã",
                city: "Porto Seguro",
                state: "BA",
                country: "Brasil",
                zipCode: "45810-000"
            },
            totalEventsPurchased: 1,
            events: [
                {
                    id: "event-4",
                    eventId: "evt-1",
                    eventName: "Festival de Verão 2025",
                    purchaseId: "purchase-4",
                    purchaseDate: "2025-01-12T09:15:00Z",
                    purchaseValue: 30000,
                    ticketsCount: 3
                }
            ],
            createdAt: "2025-01-12T09:15:00Z"
        },
        {
            id: "3",
            userId: "user-3",
            firstName: "Carlos",
            lastName: "Oliveira",
            email: "carlos.oliveira@email.com",
            phone: "(73) 97777-7777",
            birth: "1992-11-30",
            device: "MOBILE",
            address: null,
            totalEventsPurchased: 2,
            events: [
                {
                    id: "event-5",
                    eventId: "evt-2",
                    eventName: "Show de Samba na Praia",
                    purchaseId: "purchase-5",
                    purchaseDate: "2025-01-18T20:00:00Z",
                    purchaseValue: 15000,
                    ticketsCount: 2
                },
                {
                    id: "event-6",
                    eventId: "evt-4",
                    eventName: "Carnaval Porto Seguro 2025",
                    purchaseId: "purchase-6",
                    purchaseDate: "2025-02-10T11:30:00Z",
                    purchaseValue: 12000,
                    ticketsCount: 1
                }
            ],
            createdAt: "2025-01-18T20:00:00Z"
        }
    ]
}

class LeadServiceClass {
    async find(): Promise<AxiosResponse["data"]> {
        return mockLeads
    }
}

export const LeadService = new LeadServiceClass()