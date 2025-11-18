import type { TEvent } from "@/types/Event/TEvent"

const mockEvents: TEvent[] = [
    {
        id: "1",
        name: "Festa das Cores",
        description: "Evento único com data e horário específicos",
        dates: [
            {
                date: "2025-01-15",
                hourStart: "18:00",
                hourEnd: "23:00"
            }
        ],
        location: "Praça da Liberdade",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
        tickets: 100,
        recurrence: null,
        batches: [
            {
                id: "1-1",
                name: "1º Lote",
                price: 50.00,
                quantity: 50,
                startDate: "2025-01-01",
                endDate: "2025-01-10",
                isActive: false
            },
            {
                id: "1-2",
                name: "2º Lote",
                price: 75.00,
                quantity: 30,
                startDate: "2025-01-10",
                endDate: "2025-01-14",
                isActive: false
            },
            {
                id: "1-3",
                name: "3º Lote",
                price: 100.00,
                quantity: 20,
                startDate: "2025-01-14",
                endDate: null,
                isActive: true
            }
        ],
        createdAt: "2025-01-01",
        updatedAt: null
    },
    {
        id: "2",
        name: "Festival de Verão",
        description: "Evento com múltiplas datas e horários diferentes",
        dates: [
            {
                date: "2025-02-10",
                hourStart: "14:00",
                hourEnd: "18:00"
            },
            {
                date: "2025-02-11",
                hourStart: "16:00",
                hourEnd: "22:00"
            },
            {
                date: "2025-02-12",
                hourStart: "10:00",
                hourEnd: "20:00"
            }
        ],
        location: "Parque das Flores",
        image: "https://images.pexels.com/photos/34731203/pexels-photo-34731203.jpeg",
        tickets: 200,
        recurrence: null,
        batches: [
            {
                id: "2-1",
                name: "Lote Promocional",
                price: 80.00,
                quantity: 100,
                startDate: "2025-01-15",
                endDate: "2025-01-31",
                isActive: true
            },
            {
                id: "2-2",
                name: "Lote Regular",
                price: 120.00,
                quantity: 100,
                startDate: "2025-02-01",
                endDate: null,
                isActive: false
            }
        ],
        createdAt: "2025-01-02",
        updatedAt: null
    },
    {
        id: "3",
        name: "Sexta-feira na Praia",
        description: "Evento recorrente toda sexta-feira",
        dates: [
            {
                date: "2025-01-17",
                hourStart: "17:00",
                hourEnd: "23:00"
            }
        ],
        location: "Praia de Taperapuã",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
        tickets: 150,
        recurrence: {
            type: "WEEKLY",
            interval: 1,
            daysOfWeek: [5],
            endDate: "2025-03-31"
        },
        batches: null,
        createdAt: "2025-01-05",
        updatedAt: null
    },
    {
        id: "4",
        name: "Show Acústico",
        description: "Evento recorrente toda terça-feira",
        dates: [
            {
                date: "2025-01-14",
                hourStart: "20:00",
                hourEnd: "23:00"
            }
        ],
        location: "Bar do João",
        image: "https://images.pexels.com/photos/34731203/pexels-photo-34731203.jpeg",
        tickets: 80,
        recurrence: {
            type: "WEEKLY",
            interval: 1,
            daysOfWeek: [2],
            endDate: null
        },
        batches: [
            {
                id: "4-1",
                name: "Único Lote",
                price: 40.00,
                quantity: 80,
                startDate: "2025-01-01",
                endDate: null,
                isActive: true
            }
        ],
        createdAt: "2025-01-03",
        updatedAt: null
    },
    {
        id: "5",
        name: "Workshop de Arte",
        description: "Evento com múltiplas datas em horários diferentes",
        dates: [
            {
                date: "2025-01-20",
                hourStart: "09:00",
                hourEnd: "12:00"
            },
            {
                date: "2025-01-21",
                hourStart: "14:00",
                hourEnd: "17:00"
            },
            {
                date: "2025-01-22",
                hourStart: "09:00",
                hourEnd: "12:00"
            }
        ],
        location: "Centro Cultural",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
        tickets: 50,
        recurrence: null,
        batches: null,
        createdAt: "2025-01-01",
        updatedAt: null
    },
    {
        id: "6",
        name: "Happy Hour",
        description: "Evento diário",
        dates: [
            {
                date: "2025-01-13",
                hourStart: "18:00",
                hourEnd: "21:00"
            }
        ],
        location: "Restaurante Beira Mar",
        image: "https://images.pexels.com/photos/34731203/pexels-photo-34731203.jpeg",
        tickets: 100,
        recurrence: {
            type: "DAILY",
            interval: 1,
            endDate: "2025-02-28"
        },
        batches: null,
        createdAt: "2025-01-02",
        updatedAt: null
    },
]

class EventService {
    async find(): Promise<any> {
        return mockEvents
    }
}

export const eventService = new EventService()