import type { TDashboard } from "@/types/Dashboard/TDashboard"

const generateMockData = (period: "day" | "week" | "month" | "year"): TDashboard => {
    const now = new Date()
    const dates: string[] = []
    
    if (period === "day") {
        for (let i = 23; i >= 0; i--) {
            const date = new Date(now)
            date.setHours(now.getHours() - i)
            dates.push(date.toISOString())
        }
    } else if (period === "week") {
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(now.getDate() - i)
            dates.push(date.toISOString())
        }
    } else if (period === "month") {
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(now.getDate() - i)
            dates.push(date.toISOString())
        }
    } else {
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now)
            date.setMonth(now.getMonth() - i)
            dates.push(date.toISOString())
        }
    }

    const totalRevenue = 1250000
    const totalTickets = 3420
    const averageTicketPrice = Math.round(totalRevenue / totalTickets)

    return {
        totalRevenue,
        totalTickets,
        totalEvents: 12,
        averageTicketPrice,
        revenueGrowth: 12.5,
        ticketsGrowth: 8.3,
        eventsGrowth: 15.2,
        averageTicketPriceGrowth: 4.1,
        revenueOverTime: dates.map(date => ({
            date,
            revenue: Math.floor(Math.random() * 50000) + 20000
        })),
        ticketsOverTime: dates.map(date => ({
            date,
            tickets: Math.floor(Math.random() * 150) + 50
        })),
        salesByEvent: [
            { eventName: "Festival de Verão 2026", tickets: 1250, revenue: 187500 },
            { eventName: "Show Nacional", tickets: 980, revenue: 147000 },
            { eventName: "Maratona do Descobrimento", tickets: 850, revenue: 127500 },
            { eventName: "Festival Gastronômico", tickets: 720, revenue: 108000 },
            { eventName: "Evento Cultural", tickets: 620, revenue: 93000 },
            { eventName: "Workshop de Arte", tickets: 450, revenue: 67500 }
        ],
        topPerformingEvents: [
            { name: "Festival de Verão 2026", tickets: 1250, revenue: 187500 },
            { name: "Show Nacional", tickets: 980, revenue: 147000 },
            { name: "Maratona do Descobrimento", tickets: 850, revenue: 127500 }
        ]
    }
}

class DashboardServiceClass {
    async getDashboardData(period: "day" | "week" | "month" | "year" = "month"): Promise<TDashboard> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateMockData(period))
            }, 500)
        })
    }
}

export const DashboardService = new DashboardServiceClass()