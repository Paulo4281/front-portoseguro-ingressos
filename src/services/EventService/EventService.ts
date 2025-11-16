import type { TEvent } from "@/types/Event/TEvent"

const mockEvents: TEvent[] = [
    {
        id: "1",
        name: "Festa das Cores",
        description: "Descrição do evento 1",
        date: "2025-01-01",
        hourStart: "10:00",
        hourEnd: "12:00",
        location: "Praça da Liberdade",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
        tickets: 100,
        price: 100,
        createdAt: "2025-01-01",
        updatedAt: null
    },
    {
        id: "2",
        name: "Rosas das Árvores",
        description: "Descrição do evento 2",
        date: "2025-01-02",
        hourStart: "10:00",
        hourEnd: "12:00",
        location: "Parque das Flores",
        image: "https://images.pexels.com/photos/34731203/pexels-photo-34731203.jpeg",
        tickets: 100,
        price: 100,
        createdAt: "2025-01-02",
        updatedAt: null
    }
]

class EventService {
    async find(): Promise<any> {
        return mockEvents
    }
}

export const eventService = new EventService()