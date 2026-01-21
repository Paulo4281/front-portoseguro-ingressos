import type { TReportResponse, TReportFilters } from "@/types/Report/TReport"

class ReportServiceClass {
    async getReports(filters?: TReportFilters): Promise<TReportResponse> {
        await new Promise(resolve => setTimeout(resolve, 800))

        const mockData: TReportResponse = {
            overview: {
                totalCampaigns: 24,
                totalEmailsSent: 15420,
                averageOpenRate: 32.5,
                averageClickRate: 8.3,
                totalRevenue: 2458000,
                totalCustomers: 1240,
                newCustomersLast30Days: 186,
                topPerformingCampaign: {
                    campaignId: "1",
                    templateName: "Lembrete de evento",
                    subject: "Lembrete: {{evento}} está chegando!",
                    sentAt: "2026-01-15T10:00:00Z",
                    totalRecipients: 450,
                    deliveredCount: 405,
                    acceptedCount: 432,
                    openedCount: 198,
                    clickedCount: 67,
                    conversionCount: 23,
                    deliveredRate: 90.0,
                    acceptedRate: 96.0,
                    openRate: 44.0,
                    clickRate: 14.9,
                    conversionRate: 5.1,
                    revenue: 34500
                }
            },
            campaignPerformance: [
                {
                    campaignId: "1",
                    templateName: "Lembrete de evento",
                    subject: "Lembrete: {{evento}} está chegando!",
                    sentAt: "2026-01-15T10:00:00Z",
                    totalRecipients: 450,
                    deliveredCount: 432,
                    acceptedCount: 405,
                    openedCount: 198,
                    clickedCount: 67,
                    conversionCount: 23,
                    deliveredRate: 96.0,
                    acceptedRate: 90.0,
                    openRate: 44.0,
                    clickRate: 14.9,
                    conversionRate: 5.1,
                    revenue: 34500
                },
                {
                    campaignId: "2",
                    templateName: "Oferta especial",
                    subject: "Oferta especial para você!",
                    sentAt: "2026-01-12T14:30:00Z",
                    totalRecipients: 320,
                    deliveredCount: 288,
                    acceptedCount: 310,
                    openedCount: 128,
                    clickedCount: 45,
                    conversionCount: 18,
                    deliveredRate: 90.0,
                    acceptedRate: 96.9,
                    openRate: 40.0,
                    clickRate: 14.1,
                    conversionRate: 5.6,
                    revenue: 28900
                },
                {
                    campaignId: "3",
                    templateName: "Pós-evento",
                    subject: "Obrigado por participar!",
                    sentAt: "2026-01-10T09:15:00Z",
                    totalRecipients: 280,
                    deliveredCount: 252,
                    acceptedCount: 271,
                    openedCount: 112,
                    clickedCount: 28,
                    conversionCount: 0,
                    deliveredRate: 90.0,
                    acceptedRate: 96.8,
                    openRate: 40.0,
                    clickRate: 10.0,
                    conversionRate: 0.0,
                    revenue: 0
                },
                {
                    campaignId: "4",
                    templateName: "Lançamento de evento",
                    subject: "Temos uma novidade incrível para você!",
                    sentAt: "2026-01-08T16:45:00Z",
                    totalRecipients: 520,
                    deliveredCount: 468,
                    acceptedCount: 505,
                    openedCount: 208,
                    clickedCount: 83,
                    conversionCount: 31,
                    deliveredRate: 90.0,
                    acceptedRate: 97.1,
                    openRate: 40.0,
                    clickRate: 16.0,
                    conversionRate: 6.0,
                    revenue: 45600
                },
                {
                    campaignId: "5",
                    templateName: "Nutrir público",
                    subject: "Conheça nossos eventos!",
                    sentAt: "2026-01-05T11:20:00Z",
                    totalRecipients: 380,
                    deliveredCount: 342,
                    acceptedCount: 368,
                    openedCount: 133,
                    clickedCount: 38,
                    conversionCount: 12,
                    deliveredRate: 90.0,
                    acceptedRate: 96.8,
                    openRate: 35.0,
                    clickRate: 10.0,
                    conversionRate: 3.2,
                    revenue: 18900
                }
            ],
            customerEntries: [
                { month: "Janeiro", year: 2025, newCustomers: 145, totalCustomers: 1054, customersByTag: [{ tagId: "1", tagName: "VIP", count: 35 }, { tagId: "2", tagName: "Frequente", count: 68 }, { tagId: "3", tagName: "Novo", count: 42 }] },
                { month: "Fevereiro", year: 2025, newCustomers: 132, totalCustomers: 1186, customersByTag: [{ tagId: "1", tagName: "VIP", count: 32 }, { tagId: "2", tagName: "Frequente", count: 62 }, { tagId: "3", tagName: "Novo", count: 38 }] },
                { month: "Março", year: 2025, newCustomers: 158, totalCustomers: 1344, customersByTag: [{ tagId: "1", tagName: "VIP", count: 38 }, { tagId: "2", tagName: "Frequente", count: 74 }, { tagId: "3", tagName: "Novo", count: 46 }] },
                { month: "Abril", year: 2025, newCustomers: 142, totalCustomers: 1486, customersByTag: [{ tagId: "1", tagName: "VIP", count: 34 }, { tagId: "2", tagName: "Frequente", count: 66 }, { tagId: "3", tagName: "Novo", count: 42 }] },
                { month: "Maio", year: 2025, newCustomers: 168, totalCustomers: 1654, customersByTag: [{ tagId: "1", tagName: "VIP", count: 40 }, { tagId: "2", tagName: "Frequente", count: 78 }, { tagId: "3", tagName: "Novo", count: 50 }] },
                { month: "Junho", year: 2025, newCustomers: 175, totalCustomers: 1829, customersByTag: [{ tagId: "1", tagName: "VIP", count: 42 }, { tagId: "2", tagName: "Frequente", count: 82 }, { tagId: "3", tagName: "Novo", count: 51 }] },
                { month: "Julho", year: 2025, newCustomers: 189, totalCustomers: 2018, customersByTag: [{ tagId: "1", tagName: "VIP", count: 45 }, { tagId: "2", tagName: "Frequente", count: 88 }, { tagId: "3", tagName: "Novo", count: 56 }] },
                { month: "Agosto", year: 2025, newCustomers: 165, totalCustomers: 2183, customersByTag: [{ tagId: "1", tagName: "VIP", count: 39 }, { tagId: "2", tagName: "Frequente", count: 77 }, { tagId: "3", tagName: "Novo", count: 49 }] },
                { month: "Setembro", year: 2025, newCustomers: 152, totalCustomers: 2335, customersByTag: [{ tagId: "1", tagName: "VIP", count: 36 }, { tagId: "2", tagName: "Frequente", count: 71 }, { tagId: "3", tagName: "Novo", count: 45 }] },
                { month: "Outubro", year: 2025, newCustomers: 178, totalCustomers: 2513, customersByTag: [{ tagId: "1", tagName: "VIP", count: 42 }, { tagId: "2", tagName: "Frequente", count: 83 }, { tagId: "3", tagName: "Novo", count: 53 }] },
                { month: "Novembro", year: 2025, newCustomers: 194, totalCustomers: 2707, customersByTag: [{ tagId: "1", tagName: "VIP", count: 46 }, { tagId: "2", tagName: "Frequente", count: 91 }, { tagId: "3", tagName: "Novo", count: 57 }] },
                { month: "Dezembro", year: 2025, newCustomers: 207, totalCustomers: 2914, customersByTag: [{ tagId: "1", tagName: "VIP", count: 49 }, { tagId: "2", tagName: "Frequente", count: 97 }, { tagId: "3", tagName: "Novo", count: 61 }] },
                { month: "Janeiro", year: 2026, newCustomers: 186, totalCustomers: 3100, customersByTag: [{ tagId: "1", tagName: "VIP", count: 44 }, { tagId: "2", tagName: "Frequente", count: 87 }, { tagId: "3", tagName: "Novo", count: 55 }] }
            ],
            salesByEvent: [
                {
                    eventId: "1",
                    eventName: "Festa de Verão 2026",
                    ticketsSold: 450,
                    revenue: 67500,
                    averageTicketPrice: 150,
                    conversionRate: 12.5
                },
                {
                    eventId: "2",
                    eventName: "Show de Rock",
                    ticketsSold: 320,
                    revenue: 48000,
                    averageTicketPrice: 150,
                    conversionRate: 10.2
                },
                {
                    eventId: "3",
                    eventName: "Festival de Música",
                    ticketsSold: 680,
                    revenue: 136000,
                    averageTicketPrice: 200,
                    conversionRate: 15.8
                },
                {
                    eventId: "4",
                    eventName: "Evento Corporativo",
                    ticketsSold: 120,
                    revenue: 24000,
                    averageTicketPrice: 200,
                    conversionRate: 8.5
                },
                {
                    eventId: "5",
                    eventName: "Festa Junina",
                    ticketsSold: 280,
                    revenue: 42000,
                    averageTicketPrice: 150,
                    conversionRate: 11.3
                }
            ],
            aiSuggestions: [
                {
                    id: "1",
                    type: "campaign",
                    title: "Otimizar horário de envio",
                    description: "Seus e-mails têm melhor performance quando enviados às 10h. Considere agendar campanhas para este horário.",
                    priority: "high",
                    actionLabel: "Ver detalhes"
                },
                {
                    id: "2",
                    type: "segment",
                    title: "Segmento VIP com baixo engajamento",
                    description: "Clientes VIP não estão abrindo seus e-mails recentemente. Considere criar uma campanha personalizada para reativá-los.",
                    priority: "high",
                    actionLabel: "Criar campanha"
                },
                {
                    id: "3",
                    type: "event",
                    title: "Evento com potencial de crescimento",
                    description: "O evento 'Festival de Música' tem alta taxa de conversão. Considere aumentar o investimento em marketing para este evento.",
                    priority: "medium",
                    actionLabel: "Ver evento"
                },
                {
                    id: "4",
                    type: "pricing",
                    title: "Oportunidade de precificação",
                    description: "Análise sugere que você pode aumentar o preço médio dos ingressos em 15% sem impacto significativo nas vendas.",
                    priority: "medium",
                    actionLabel: "Ver análise"
                },
                {
                    id: "5",
                    type: "campaign",
                    title: "Melhorar taxa de abertura",
                    description: "Templates de 'Oferta especial' têm melhor performance. Considere usar este tipo de template com mais frequência.",
                    priority: "low",
                    actionLabel: "Ver templates"
                }
            ],
            campaignStatsOverTime: [
                { week: "Semana 1", month: "Janeiro", year: 2026, sent: 2450, opened: 980, clicked: 294 },
                { week: "Semana 2", month: "Janeiro", year: 2026, sent: 2680, opened: 1072, clicked: 321 },
                { week: "Semana 3", month: "Janeiro", year: 2026, sent: 2320, opened: 928, clicked: 278 },
                { week: "Semana 4", month: "Janeiro", year: 2026, sent: 2890, opened: 1156, clicked: 347 },
                { week: "Semana 1", month: "Fevereiro", year: 2026, sent: 2560, opened: 1024, clicked: 307 },
                { week: "Semana 2", month: "Fevereiro", year: 2026, sent: 2740, opened: 1096, clicked: 329 },
                { week: "Semana 3", month: "Fevereiro", year: 2026, sent: 2410, opened: 964, clicked: 289 },
                { week: "Semana 4", month: "Fevereiro", year: 2026, sent: 2620, opened: 1048, clicked: 314 },
                { week: "Semana 1", month: "Março", year: 2026, sent: 2780, opened: 1112, clicked: 334 },
                { week: "Semana 2", month: "Março", year: 2026, sent: 2910, opened: 1164, clicked: 349 },
                { week: "Semana 3", month: "Março", year: 2026, sent: 2530, opened: 1012, clicked: 304 },
                { week: "Semana 4", month: "Março", year: 2026, sent: 2670, opened: 1068, clicked: 320 }
            ],
            customerSegments: [
                {
                    segmentName: "VIP",
                    customerCount: 145,
                    averageTicketPrice: 250,
                    totalRevenue: 362500,
                    engagementScore: 8.5
                },
                {
                    segmentName: "Frequente",
                    customerCount: 320,
                    averageTicketPrice: 180,
                    totalRevenue: 576000,
                    engagementScore: 7.2
                },
                {
                    segmentName: "Novo",
                    customerCount: 186,
                    averageTicketPrice: 120,
                    totalRevenue: 223200,
                    engagementScore: 5.8
                },
                {
                    segmentName: "Ocasional",
                    customerCount: 589,
                    averageTicketPrice: 150,
                    totalRevenue: 883500,
                    engagementScore: 6.5
                }
            ]
        }

        return mockData
    }

    async downloadReport(format: "pdf" | "xlsx" | "csv", filters?: TReportFilters): Promise<Blob> {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const content = `Relatório CRM - ${new Date().toLocaleDateString("pt-BR")}`
        const blob = new Blob([content], { type: "text/plain" })
        return blob
    }
}

export const ReportService = new ReportServiceClass()

