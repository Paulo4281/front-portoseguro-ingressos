import type { TTicket } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"
import { mockEvents } from "../Event/EventService"

const defaultUserId = "bd132c18-bc82-4a5d-bf0e-7d36176044ec"

const eventMap = Object.fromEntries(mockEvents.map((event) => [event.id, event]))

const findBatch = (eventId: string, batchId: string | null) => {
    if (!batchId) {
        return null
    }

    const event = eventMap[eventId]
    if (!event?.batches) {
        return null
    }

    return event.batches.find((batch) => batch.id === batchId) || null
}

const mockTickets: TTicket[] = [
    {
        id: "TK-001",
        status: "PAID",
        eventId: "1",
        eventBatchId: "1-2",
        userId: defaultUserId,
        price: 7500,
        createdAt: "2025-01-05",
        updatedAt: null,
        event: eventMap["1"],
        eventBatch: findBatch("1", "1-2")
    },
    {
        id: "TK-002",
        status: "PENDING",
        eventId: "2",
        eventBatchId: "2-1",
        userId: defaultUserId,
        price: 12000,
        createdAt: "2025-02-01",
        updatedAt: null,
        event: eventMap["2"],
        eventBatch: findBatch("2", "2-1")
    },
    {
        id: "TK-003",
        status: "USED",
        eventId: "3",
        eventBatchId: null,
        userId: defaultUserId,
        price: 6500,
        createdAt: "2024-12-20",
        updatedAt: null,
        event: eventMap["3"],
        eventBatch: null
    },
    {
        id: "TK-004",
        status: "EXPIRED",
        eventId: "4",
        eventBatchId: "4-1",
        userId: defaultUserId,
        price: 9900,
        createdAt: "2024-11-15",
        updatedAt: null,
        event: eventMap["4"],
        eventBatch: findBatch("4", "4-1")
    },
    {
        id: "TK-005",
        status: "CANCELLED",
        eventId: "2",
        eventBatchId: "2-2",
        userId: defaultUserId,
        price: 13500,
        createdAt: "2025-02-10",
        updatedAt: "2025-02-12",
        event: eventMap["2"],
        eventBatch: findBatch("2", "2-2")
    }
]

class TicketServiceClass {
    async findByUserId(userId: string): Promise<TApiResponse<TTicket[]>> {
        if (!userId) {
            return {
                success: false,
                data: []
            }
        }

        const tickets = mockTickets.filter((ticket) => ticket.userId === userId)
        return {
            success: true,
            data: tickets
        }
    }
}

export const TicketService = new TicketServiceClass()