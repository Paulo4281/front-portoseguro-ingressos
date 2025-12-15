import { API } from "@/api/api"
import { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPaymentAdminListResponse } from "@/types/Payment/TPayment"

type TListPaymentsParams = {
    offset?: number
    status?: "RECEIVED" | "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED" | "OVERDUE"
}

type TListPaymentsResponse = {
    data: TPaymentAdminListResponse[]
    total: number
    limit: number
    offset: number
}

const generateMockPayments = (): TPaymentAdminListResponse[] => {
    const now = new Date()
    const baseDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return [
        {
            id: "pay-001",
            method: "PIX",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "pix_asaas_001",
            eventId: "event-001",
            eventInfo: { amount: 2 },
            grossValue: 19990,
            netValue: 19790,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 200,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 200,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: 19790,
            totalPaidByCustomer: 19990,
            invoiceUrl: "https://example.com/invoice/001",
            invoiceNumber: "NF-001",
            transactionReceiptUrl: "https://example.com/receipt/001",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-001",
            cardId: null,
            createdAt: baseDate.toISOString(),
            updatedAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-001",
                firstName: "João",
                lastName: "Silva",
                email: "joao.silva@email.com",
                phone: "73999887766",
                document: "12345678900"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-001",
                    status: "CONFIRMED",
                    ticketTypeId: "type-001",
                    TicketType: {
                        id: "type-001",
                        name: "Ingresso Inteira",
                        description: "Acesso completo ao evento"
                    },
                    TicketDates: [
                        {
                            id: "td-001",
                            eventDateId: "ed-001",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-001",
                                date: "2026-06-15",
                                hourStart: "20:00",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-002",
                    status: "CONFIRMED",
                    ticketTypeId: "type-001",
                    TicketType: {
                        id: "type-001",
                        name: "Ingresso Inteira",
                        description: "Acesso completo ao evento"
                    },
                    TicketDates: [
                        {
                            id: "td-002",
                            eventDateId: "ed-001",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-001",
                                date: "2026-06-15",
                                hourStart: "20:00",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-001",
                name: "Festival de Verão Porto Seguro 2026",
                description: "O maior festival de música do litoral baiano",
                slug: "festival-verao-porto-seguro-2026",
                location: "Passarela do Álcool",
                image: "event-001.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-001",
                    companyName: "Produções Bahia Eventos",
                    companyDocument: "12.345.678/0001-90"
                }
            }
        },
        {
            id: "pay-002",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "cc_asaas_002",
            eventId: "event-002",
            eventInfo: { amount: 1 },
            grossValue: 49990,
            netValue: 48490,
            discountedValue: 0,
            gatewayFeeGain: 1500,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 1500,
            couponInfo: null,
            creditCardInstallments: 3,
            organizerPayout: 48490,
            totalPaidByCustomer: 49990,
            invoiceUrl: "https://example.com/invoice/002",
            invoiceNumber: "NF-002",
            transactionReceiptUrl: "https://example.com/receipt/002",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-002",
            cardId: "card-001",
            createdAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-002",
                firstName: "Maria",
                lastName: "Santos",
                email: "maria.santos@email.com",
                phone: "73988776655",
                document: "98765432100"
            },
            Card: {
                id: "card-001",
                name: "MARIA SANTOS",
                last4: "1234",
                brand: "VISA",
                expYear: "2027",
                expMonth: "12"
            },
            Installments: [
                {
                    id: "inst-001",
                    paymentId: "pay-002",
                    installmentNumber: 1,
                    grossValue: 16663,
                    netValue: 16163,
                    dueDate: "2026-01-15",
                    paidAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    receivedAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "CONFIRMED",
                    externalPaymentId: "cc_asaas_002_1",
                    externalInstallmentId: "inst_asaas_002_1",
                    createdAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-002",
                    paymentId: "pay-002",
                    installmentNumber: 2,
                    grossValue: 16663,
                    netValue: 16163,
                    dueDate: "2026-02-15",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_002_2",
                    externalInstallmentId: "inst_asaas_002_2",
                    createdAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-003",
                    paymentId: "pay-002",
                    installmentNumber: 3,
                    grossValue: 16664,
                    netValue: 16164,
                    dueDate: "2026-03-15",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_002_3",
                    externalInstallmentId: "inst_asaas_002_3",
                    createdAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            Tickets: [
                {
                    id: "ticket-003",
                    status: "CONFIRMED",
                    ticketTypeId: "type-002",
                    TicketType: {
                        id: "type-002",
                        name: "VIP",
                        description: "Acesso VIP com open bar e área exclusiva"
                    },
                    TicketDates: [
                        {
                            id: "td-003",
                            eventDateId: "ed-002",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-002",
                                date: "2026-07-20",
                                hourStart: "18:00",
                                hourEnd: "02:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-002",
                name: "Cabaré da Praia",
                description: "Show ao vivo com os melhores artistas",
                slug: "cabare-da-praia",
                location: "Cabanas Beach Club",
                image: "event-002.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-002",
                    companyName: "Entretenimento Porto Seguro",
                    companyDocument: "98.765.432/0001-10"
                }
            }
        },
        {
            id: "pay-003",
            method: "PIX",
            type: "TICKET",
            status: "PENDING",
            externalPaymentId: "pix_asaas_003",
            eventId: "event-003",
            eventInfo: { amount: 1 },
            grossValue: 8990,
            netValue: null,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 100,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 100,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: null,
            totalPaidByCustomer: 8990,
            invoiceUrl: null,
            invoiceNumber: null,
            transactionReceiptUrl: null,
            qrcodeData: {
                payload: "00020101021226820014br.gov.bcb.pix2560pix-h.asaas.com/qr/cobv/953dce2a-cebd-4220-ae0f-5c727d75a3015204000053039865802BR5925MAION MARKETING DIGITAL L6012Porto Seguro61084581000062070503***6304DCC8",
                encodedImage: "iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCAQAAAABUY/ToAAADiElEQVR4Xu2WQW4jMRAD5zb//9E+a25es0hpHAMLB9lD+kDZHrXYLPgjpHj8cP153hXvrtKflolP63/Iq+DdT5Pz/K8TrbnQcWprjQtbdtdciqJfD0952sNQinUWS+OknNJ6VY8BAu6BZUX+3aXHE7iwRG3Lt4wXd7xlZxPPnTfKXEf/E0vgMyVW3Iymfv37WsITCRAZx9N2l1yLKkbj/cbr7hL/vP1y+ReGQW9icu9W/N83OaSU0mZZOcDAJrTSll0BqLkcJJRYFOGr58pCLC+wONx3b8JJYeRtN1Qiw8Jvn1vCdchfMmh5KrFPPaO9sI89ihg2TNUchp5q+L2bVP5g1NAvoBuyakkVq54VUTxxEuAekpZeSWHkgFMqOMUamwbwyVJasmhJMKh1iuvgLRU7ERO6pWcS+pAOxevz8o7mADdvkbAJwElx5L0pe8+WbFHkAsLwNff+JKDyCtX7h4+yoBE4FlJmEpOJXUUKt3XjEknA3cmYp4lp5IxrcYVo96JIEEKZqslh5JbiFmgpiCCS8fY6VVyKnlC4ZCXEKnkaVvQiqRVci7ppft2zsu9E4cDia8guuRQMhJ2EULBtxPxhqUyCSUnkrROyUJpn4iufWIYnIC+ZqjkUDJ/wBfHIUEZAyoS4lO/5FgSB/t6cu0+aRZUKiIOvUsOJunaGbd2NHyeDpV2ql1yKKlLPnlFBVfTjdUlMAElB5O3k2p7nCM5gWG8Sg4lbRTLNZtOQiTamMIf+U+q5DzSK8bznoed9hCmhoqVUXIseWExAoxRhqxTwsqCuzwJJSeSOIVc2jwVmNjUFqpSXYyZhJIDSXHuL3UlEZEu7v0VJQeTtOXIxcfOKXlfsmUpOZrEg1sB4eXzWz1shkFLDiVhhCwyPYzKjCGYU5iEkjPJ5dCKXxsRl0bASftFdMmhZHTmwBmpFeOA92AdSw4lw0lAMpxzNBhikBVXcih5X67by8wIZDyIUqrHQmXJoSR9U97tSUDURG58/SdVch656mwiPQLLumKkp8gvdcmRJOvpXmbxcuD1OZjz9Sk5lMQuwJAfOvqkTOD7BVxyKqkmT/nwIlkhgoIkN0uOJunj2JzamRByg0WTWnI8efN6+AAACZDj+TYJJUeS6unezZvmDEtDufRKjiUfdm/bzrgyADqYIYRnyalkem7RiPV2SpcRlW8qOZX84Sr5aZX8tH6F/AtW+S6qhp9LbwAAAABJRU5ErkJggg==",
                expirationDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
                description: "Pagamento de ingresso."
            },
            failedReason: null,
            paidAt: null,
            chargebackRequested: false,
            userId: "user-003",
            cardId: null,
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: null,
            User: {
                id: "user-003",
                firstName: "Pedro",
                lastName: "Oliveira",
                email: "pedro.oliveira@email.com",
                phone: "73977665544",
                document: "11122233344"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-004",
                    status: "PENDING",
                    ticketTypeId: "type-003",
                    TicketType: {
                        id: "type-003",
                        name: "Meia Entrada",
                        description: "Desconto para estudantes"
                    },
                    TicketDates: [
                        {
                            id: "td-004",
                            eventDateId: "ed-003",
                            status: "PENDING",
                            EventDate: {
                                id: "ed-003",
                                date: "2026-08-10",
                                hourStart: "19:00",
                                hourEnd: "22:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-003",
                name: "Show Acústico na Praia",
                description: "Música ao vivo com vista para o mar",
                slug: "show-acustico-praia",
                location: "Bar da Praia",
                image: "event-003.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-003",
                    companyName: "Eventos Praianos",
                    companyDocument: "11.222.333/0001-44"
                }
            }
        },
        {
            id: "pay-004",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "RECEIVED",
            externalPaymentId: "cc_asaas_004",
            eventId: "event-001",
            eventInfo: { amount: 3 },
            grossValue: 29985,
            netValue: 29085,
            discountedValue: 5000,
            gatewayFeeGain: 900,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 900,
            couponInfo: {
                code: "DESCONTO10",
                discount: 5000
            },
            creditCardInstallments: 1,
            organizerPayout: 29085,
            totalPaidByCustomer: 24985,
            invoiceUrl: "https://example.com/invoice/004",
            invoiceNumber: "NF-004",
            transactionReceiptUrl: "https://example.com/receipt/004",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-004",
            cardId: "card-002",
            createdAt: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-004",
                firstName: "Ana",
                lastName: "Costa",
                email: "ana.costa@email.com",
                phone: "73966554433",
                document: "55566677788"
            },
            Card: {
                id: "card-002",
                name: "ANA COSTA",
                last4: "5678",
                brand: "MASTERCARD",
                expYear: "2028",
                expMonth: "06"
            },
            Installments: [
                {
                    id: "inst-004",
                    paymentId: "pay-004",
                    installmentNumber: 1,
                    grossValue: 24985,
                    netValue: 24085,
                    dueDate: "2026-01-20",
                    paidAt: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    receivedAt: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "RECEIVED",
                    externalPaymentId: "cc_asaas_004_1",
                    externalInstallmentId: "inst_asaas_004_1",
                    createdAt: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            Tickets: [
                {
                    id: "ticket-005",
                    status: "CONFIRMED",
                    ticketTypeId: "type-001",
                    TicketType: {
                        id: "type-001",
                        name: "Ingresso Inteira",
                        description: "Acesso completo ao evento"
                    },
                    TicketDates: [
                        {
                            id: "td-005",
                            eventDateId: "ed-001",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-001",
                                date: "2026-06-15",
                                hourStart: "20:00",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-006",
                    status: "CONFIRMED",
                    ticketTypeId: "type-001",
                    TicketType: {
                        id: "type-001",
                        name: "Ingresso Inteira",
                        description: "Acesso completo ao evento"
                    },
                    TicketDates: [
                        {
                            id: "td-006",
                            eventDateId: "ed-001",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-001",
                                date: "2026-06-15",
                                hourStart: "20:00",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-007",
                    status: "CONFIRMED",
                    ticketTypeId: "type-001",
                    TicketType: {
                        id: "type-001",
                        name: "Ingresso Inteira",
                        description: "Acesso completo ao evento"
                    },
                    TicketDates: [
                        {
                            id: "td-007",
                            eventDateId: "ed-001",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-001",
                                date: "2026-06-15",
                                hourStart: "20:00",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-001",
                name: "Festival de Verão Porto Seguro 2026",
                description: "O maior festival de música do litoral baiano",
                slug: "festival-verao-porto-seguro-2026",
                location: "Passarela do Álcool",
                image: "event-001.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-001",
                    companyName: "Produções Bahia Eventos",
                    companyDocument: "12.345.678/0001-90"
                }
            }
        },
        {
            id: "pay-005",
            method: "PIX",
            type: "TICKET",
            status: "FAILED",
            externalPaymentId: null,
            eventId: "event-004",
            eventInfo: { amount: 1 },
            grossValue: 14990,
            netValue: null,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 150,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 150,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: null,
            totalPaidByCustomer: 14990,
            invoiceUrl: null,
            invoiceNumber: null,
            transactionReceiptUrl: null,
            qrcodeData: null,
            failedReason: "QR Code PIX expirado. Cliente não realizou o pagamento no prazo.",
            paidAt: null,
            chargebackRequested: false,
            userId: "user-005",
            cardId: null,
            createdAt: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-005",
                firstName: "Carlos",
                lastName: "Ferreira",
                email: "carlos.ferreira@email.com",
                phone: "73955443322",
                document: "99988877766"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-008",
                    status: "FAILED",
                    ticketTypeId: "type-004",
                    TicketType: {
                        id: "type-004",
                        name: "Premium",
                        description: "Acesso premium com benefícios exclusivos"
                    },
                    TicketDates: [
                        {
                            id: "td-008",
                            eventDateId: "ed-004",
                            status: "FAILED",
                            EventDate: {
                                id: "ed-004",
                                date: "2026-09-05",
                                hourStart: "21:00",
                                hourEnd: "01:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-004",
                name: "Festa Eletrônica na Praia",
                description: "DJs internacionais e produção de primeira",
                slug: "festa-eletronica-praia",
                location: "Beach Club",
                image: "event-004.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-004",
                    companyName: "Eletrônica Produções",
                    companyDocument: "99.888.777/0001-66"
                }
            }
        },
        {
            id: "pay-006",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "REFUNDED",
            externalPaymentId: "cc_asaas_006",
            eventId: "event-002",
            eventInfo: { amount: 1 },
            grossValue: 29990,
            netValue: 29090,
            discountedValue: 0,
            gatewayFeeGain: 900,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 900,
            couponInfo: null,
            creditCardInstallments: 2,
            organizerPayout: 0,
            totalPaidByCustomer: 29990,
            invoiceUrl: "https://example.com/invoice/006",
            invoiceNumber: "NF-006",
            transactionReceiptUrl: "https://example.com/receipt/006",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-006",
            cardId: "card-003",
            createdAt: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-006",
                firstName: "Juliana",
                lastName: "Almeida",
                email: "juliana.almeida@email.com",
                phone: "73944332211",
                document: "44455566677"
            },
            Card: {
                id: "card-003",
                name: "JULIANA ALMEIDA",
                last4: "9012",
                brand: "ELO",
                expYear: "2026",
                expMonth: "09"
            },
            Installments: [
                {
                    id: "inst-005",
                    paymentId: "pay-006",
                    installmentNumber: 1,
                    grossValue: 14995,
                    netValue: 14545,
                    dueDate: "2026-01-25",
                    paidAt: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    receivedAt: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "REFUNDED",
                    externalPaymentId: "cc_asaas_006_1",
                    externalInstallmentId: "inst_asaas_006_1",
                    createdAt: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-006",
                    paymentId: "pay-006",
                    installmentNumber: 2,
                    grossValue: 14995,
                    netValue: 14545,
                    dueDate: "2026-02-25",
                    paidAt: null,
                    receivedAt: null,
                    status: "REFUNDED",
                    externalPaymentId: "cc_asaas_006_2",
                    externalInstallmentId: "inst_asaas_006_2",
                    createdAt: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            Tickets: [
                {
                    id: "ticket-009",
                    status: "REFUNDED",
                    ticketTypeId: "type-002",
                    TicketType: {
                        id: "type-002",
                        name: "VIP",
                        description: "Acesso VIP com open bar e área exclusiva"
                    },
                    TicketDates: [
                        {
                            id: "td-009",
                            eventDateId: "ed-002",
                            status: "REFUNDED",
                            EventDate: {
                                id: "ed-002",
                                date: "2026-07-20",
                                hourStart: "18:00",
                                hourEnd: "02:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-002",
                name: "Cabaré da Praia",
                description: "Show ao vivo com os melhores artistas",
                slug: "cabare-da-praia",
                location: "Cabanas Beach Club",
                image: "event-002.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-002",
                    companyName: "Entretenimento Porto Seguro",
                    companyDocument: "98.765.432/0001-10"
                }
            }
        },
        {
            id: "pay-007",
            method: "PIX",
            type: "TICKET",
            status: "OVERDUE",
            externalPaymentId: null,
            eventId: "event-005",
            eventInfo: { amount: 2 },
            grossValue: 17980,
            netValue: null,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 180,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 180,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: null,
            totalPaidByCustomer: 17980,
            invoiceUrl: null,
            invoiceNumber: null,
            transactionReceiptUrl: null,
            qrcodeData: null,
            failedReason: "Pagamento não realizado dentro do prazo de validade",
            paidAt: null,
            chargebackRequested: false,
            userId: "user-007",
            cardId: null,
            createdAt: new Date(baseDate.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-007",
                firstName: "Roberto",
                lastName: "Lima",
                email: "roberto.lima@email.com",
                phone: "73933221100",
                document: "33344455566"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-010",
                    status: "OVERDUE",
                    ticketTypeId: "type-005",
                    TicketType: {
                        id: "type-005",
                        name: "Social",
                        description: "Ingresso social com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-010",
                            eventDateId: "ed-005",
                            status: "OVERDUE",
                            EventDate: {
                                id: "ed-005",
                                date: "2026-10-12",
                                hourStart: "20:00",
                                hourEnd: "23:30"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-011",
                    status: "OVERDUE",
                    ticketTypeId: "type-005",
                    TicketType: {
                        id: "type-005",
                        name: "Social",
                        description: "Ingresso social com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-011",
                            eventDateId: "ed-005",
                            status: "OVERDUE",
                            EventDate: {
                                id: "ed-005",
                                date: "2026-10-12",
                                hourStart: "20:00",
                                hourEnd: "23:30"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-005",
                name: "Samba na Praia",
                description: "Roda de samba com os melhores grupos da região",
                slug: "samba-na-praia",
                location: "Quiosque do Samba",
                image: "event-005.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-005",
                    companyName: "Cultura Baiana",
                    companyDocument: "33.444.555/0001-66"
                }
            }
        },
        {
            id: "pay-008",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "cc_asaas_008",
            eventId: "event-006",
            eventInfo: { amount: 1 },
            grossValue: 79900,
            netValue: 77400,
            discountedValue: 0,
            gatewayFeeGain: 2500,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 2500,
            couponInfo: null,
            creditCardInstallments: 6,
            organizerPayout: 77400,
            totalPaidByCustomer: 79900,
            invoiceUrl: "https://example.com/invoice/008",
            invoiceNumber: "NF-008",
            transactionReceiptUrl: "https://example.com/receipt/008",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-008",
            cardId: "card-004",
            createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-008",
                firstName: "Fernanda",
                lastName: "Ribeiro",
                email: "fernanda.ribeiro@email.com",
                phone: "73922110099",
                document: "77788899900"
            },
            Card: {
                id: "card-004",
                name: "FERNANDA RIBEIRO",
                last4: "3456",
                brand: "AMEX",
                expYear: "2029",
                expMonth: "03"
            },
            Installments: [
                {
                    id: "inst-007",
                    paymentId: "pay-008",
                    installmentNumber: 1,
                    grossValue: 13317,
                    netValue: 12900,
                    dueDate: "2026-01-30",
                    paidAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    receivedAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "CONFIRMED",
                    externalPaymentId: "cc_asaas_008_1",
                    externalInstallmentId: "inst_asaas_008_1",
                    createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-008",
                    paymentId: "pay-008",
                    installmentNumber: 2,
                    grossValue: 13317,
                    netValue: 12900,
                    dueDate: "2026-02-28",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_008_2",
                    externalInstallmentId: "inst_asaas_008_2",
                    createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-009",
                    paymentId: "pay-008",
                    installmentNumber: 3,
                    grossValue: 13317,
                    netValue: 12900,
                    dueDate: "2026-03-30",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_008_3",
                    externalInstallmentId: "inst_asaas_008_3",
                    createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-010",
                    paymentId: "pay-008",
                    installmentNumber: 4,
                    grossValue: 13317,
                    netValue: 12900,
                    dueDate: "2026-04-30",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_008_4",
                    externalInstallmentId: "inst_asaas_008_4",
                    createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-011",
                    paymentId: "pay-008",
                    installmentNumber: 5,
                    grossValue: 13317,
                    netValue: 12900,
                    dueDate: "2026-05-30",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_008_5",
                    externalInstallmentId: "inst_asaas_008_5",
                    createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-012",
                    paymentId: "pay-008",
                    installmentNumber: 6,
                    grossValue: 13315,
                    netValue: 12900,
                    dueDate: "2026-06-30",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_008_6",
                    externalInstallmentId: "inst_asaas_008_6",
                    createdAt: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            Tickets: [
                {
                    id: "ticket-012",
                    status: "CONFIRMED",
                    ticketTypeId: "type-006",
                    TicketType: {
                        id: "type-006",
                        name: "Super VIP",
                        description: "Acesso super VIP com todos os benefícios"
                    },
                    TicketDates: [
                        {
                            id: "td-012",
                            eventDateId: "ed-006",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-006",
                                date: "2026-11-15",
                                hourStart: "17:00",
                                hourEnd: "03:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-006",
                name: "Festival de Música Eletrônica",
                description: "Os maiores DJs do mundo em Porto Seguro",
                slug: "festival-musica-eletronica",
                location: "Arena Beach",
                image: "event-006.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-006",
                    companyName: "Eletrônica Global",
                    companyDocument: "77.888.999/0001-00"
                }
            }
        },
        {
            id: "pay-009",
            method: "PIX",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "pix_asaas_009",
            eventId: "event-007",
            eventInfo: { amount: 4 },
            grossValue: 39960,
            netValue: 39560,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 400,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 400,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: 39560,
            totalPaidByCustomer: 39960,
            invoiceUrl: "https://example.com/invoice/009",
            invoiceNumber: "NF-009",
            transactionReceiptUrl: "https://example.com/receipt/009",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-009",
            cardId: null,
            createdAt: new Date(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-009",
                firstName: "Lucas",
                lastName: "Martins",
                email: "lucas.martins@email.com",
                phone: "73911009988",
                document: "22233344455"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-013",
                    status: "CONFIRMED",
                    ticketTypeId: "type-007",
                    TicketType: {
                        id: "type-007",
                        name: "Família",
                        description: "Pacote familiar com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-013",
                            eventDateId: "ed-007",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-007",
                                date: "2026-12-20",
                                hourStart: "16:00",
                                hourEnd: "20:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-014",
                    status: "CONFIRMED",
                    ticketTypeId: "type-007",
                    TicketType: {
                        id: "type-007",
                        name: "Família",
                        description: "Pacote familiar com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-014",
                            eventDateId: "ed-007",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-007",
                                date: "2026-12-20",
                                hourStart: "16:00",
                                hourEnd: "20:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-015",
                    status: "CONFIRMED",
                    ticketTypeId: "type-007",
                    TicketType: {
                        id: "type-007",
                        name: "Família",
                        description: "Pacote familiar com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-015",
                            eventDateId: "ed-007",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-007",
                                date: "2026-12-20",
                                hourStart: "16:00",
                                hourEnd: "20:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-016",
                    status: "CONFIRMED",
                    ticketTypeId: "type-007",
                    TicketType: {
                        id: "type-007",
                        name: "Família",
                        description: "Pacote familiar com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-016",
                            eventDateId: "ed-007",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-007",
                                date: "2026-12-20",
                                hourStart: "16:00",
                                hourEnd: "20:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-007",
                name: "Festival de Natal",
                description: "Celebração de Natal para toda a família",
                slug: "festival-natal",
                location: "Praça Central",
                image: "event-007.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-007",
                    companyName: "Eventos Familiares",
                    companyDocument: "22.333.444/0001-55"
                }
            }
        },
        {
            id: "pay-010",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "cc_asaas_010",
            eventId: "event-008",
            eventInfo: { amount: 1 },
            grossValue: 0,
            netValue: 0,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 0,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: 0,
            totalPaidByCustomer: 0,
            invoiceUrl: "https://example.com/invoice/010",
            invoiceNumber: "NF-010",
            transactionReceiptUrl: "https://example.com/receipt/010",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-010",
            cardId: "card-005",
            createdAt: new Date(baseDate.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-010",
                firstName: "Patricia",
                lastName: "Souza",
                email: "patricia.souza@email.com",
                phone: "73900998877",
                document: "66677788899"
            },
            Card: {
                id: "card-005",
                name: "PATRICIA SOUZA",
                last4: "7890",
                brand: "HIPERCARD",
                expYear: "2027",
                expMonth: "11"
            },
            Installments: [],
            Tickets: [
                {
                    id: "ticket-017",
                    status: "CONFIRMED",
                    ticketTypeId: null,
                    TicketType: null,
                    TicketDates: [
                        {
                            id: "td-017",
                            eventDateId: "ed-008",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-008",
                                date: "2026-01-10",
                                hourStart: "19:00",
                                hourEnd: "22:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-008",
                name: "Evento Gratuito",
                description: "Evento sem custo para os participantes",
                slug: "evento-gratuito",
                location: "Parque Municipal",
                image: "event-008.jpg",
                isFree: true,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-008",
                    companyName: "Cultura Livre",
                    companyDocument: "66.777.888/0001-99"
                }
            }
        },
        {
            id: "pay-011",
            method: "PIX",
            type: "TICKET",
            status: "PENDING",
            externalPaymentId: "pix_asaas_011",
            eventId: "event-009",
            eventInfo: { amount: 1 },
            grossValue: 24990,
            netValue: null,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 250,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 250,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: null,
            totalPaidByCustomer: 24990,
            invoiceUrl: null,
            invoiceNumber: null,
            transactionReceiptUrl: null,
            qrcodeData: {
                payload: "00020101021226820014br.gov.bcb.pix2560pix-h.asaas.com/qr/cobv/953dce2a-cebd-4220-ae0f-5c727d75a3015204000053039865802BR5925MAION MARKETING DIGITAL L6012Porto Seguro61084581000062070503***6304DCC8",
                encodedImage: "iVBORw0KGgoAAAANSUhEUgAAAcIAAAHCAQAAAABUY/ToAAADiElEQVR4Xu2WQW4jMRAD5zb//9E+a25es0hpHAMLB9lD+kDZHrXYLPgjpHj8cP153hXvrtKflolP63/Iq+DdT5Pz/K8TrbnQcWprjQtbdtdciqJfD0952sNQinUWS+OknNJ6VY8BAu6BZUX+3aXHE7iwRG3Lt4wXd7xlZxPPnTfKXEf/E0vgMyVW3Iymfv37WsITCRAZx9N2l1yLKkbj/cbr7hL/vP1y+ReGQW9icu9W/N83OaSU0mZZOcDAJrTSll0BqLkcJJRYFOGr58pCLC+wONx3b8JJYeRtN1Qiw8Jvn1vCdchfMmh5KrFPPaO9sI89ihg2TNUchp5q+L2bVP5g1NAvoBuyakkVq54VUTxxEuAekpZeSWHkgFMqOMUamwbwyVJasmhJMKh1iuvgLRU7ERO6pWcS+pAOxevz8o7mADdvkbAJwElx5L0pe8+WbFHkAsLwNff+JKDyCtX7h4+yoBE4FlJmEpOJXUUKt3XjEknA3cmYp4lp5IxrcYVo96JIEEKZqslh5JbiFmgpiCCS8fY6VVyKnlC4ZCXEKnkaVvQiqRVci7ppft2zsu9E4cDia8guuRQMhJ2EULBtxPxhqUyCSUnkrROyUJpn4iufWIYnIC+ZqjkUDJ/wBfHIUEZAyoS4lO/5FgSB/t6cu0+aRZUKiIOvUsOJunaGbd2NHyeDpV2ql1yKKlLPnlFBVfTjdUlMAElB5O3k2p7nCM5gWG8Sg4lbRTLNZtOQiTamMIf+U+q5DzSK8bznoed9hCmhoqVUXIseWExAoxRhqxTwsqCuzwJJSeSOIVc2jwVmNjUFqpSXYyZhJIDSXHuL3UlEZEu7v0VJQeTtOXIxcfOKXlfsmUpOZrEg1sB4eXzWz1shkFLDiVhhCwyPYzKjCGYU5iEkjPJ5dCKXxsRl0bASftFdMmhZHTmwBmpFeOA92AdSw4lw0lAMpxzNBhikBVXcih5X67by8wIZDyIUqrHQmXJoSR9U97tSUDURG58/SdVch656mwiPQLLumKkp8gvdcmRJOvpXmbxcuD1OZjz9Sk5lMQuwJAfOvqkTOD7BVxyKqkmT/nwIlkhgoIkN0uOJunj2JzamRByg0WTWnI8efN6+AAACZDj+TYJJUeS6unezZvmDEtDufRKjiUfdm/bzrgyADqYIYRnyalkem7RiPV2SpcRlW8qOZX84Sr5aZX8tH6F/AtW+S6qhp9LbwAAAABJRU5ErkJggg==",
                expirationDate: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
                description: "Pagamento de ingresso."
            },
            failedReason: null,
            paidAt: null,
            chargebackRequested: false,
            userId: "user-011",
            cardId: null,
            createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
            updatedAt: null,
            User: {
                id: "user-011",
                firstName: "Ricardo",
                lastName: "Pereira",
                email: "ricardo.pereira@email.com",
                phone: "73999887766",
                document: "11122233344"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-018",
                    status: "PENDING",
                    ticketTypeId: "type-008",
                    TicketType: {
                        id: "type-008",
                        name: "Early Bird",
                        description: "Ingresso com desconto para compra antecipada"
                    },
                    TicketDates: [
                        {
                            id: "td-018",
                            eventDateId: "ed-009",
                            status: "PENDING",
                            EventDate: {
                                id: "ed-009",
                                date: "2026-02-14",
                                hourStart: "20:00",
                                hourEnd: "00:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-009",
                name: "Festa de São Valentim",
                description: "Celebração do dia dos namorados",
                slug: "festa-sao-valentim",
                location: "Restaurante Romântico",
                image: "event-009.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-009",
                    companyName: "Eventos Românticos",
                    companyDocument: "11.222.333/0001-44"
                }
            }
        },
        {
            id: "pay-012",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "cc_asaas_012",
            eventId: "event-010",
            eventInfo: { amount: 1 },
            grossValue: 59990,
            netValue: 58190,
            discountedValue: 10000,
            gatewayFeeGain: 1800,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 1800,
            couponInfo: {
                code: "BLACKFRIDAY50",
                discount: 10000
            },
            creditCardInstallments: 4,
            organizerPayout: 58190,
            totalPaidByCustomer: 49990,
            invoiceUrl: "https://example.com/invoice/012",
            invoiceNumber: "NF-012",
            transactionReceiptUrl: "https://example.com/receipt/012",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: true,
            userId: "user-012",
            cardId: "card-006",
            createdAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-012",
                firstName: "Gabriel",
                lastName: "Barbosa",
                email: "gabriel.barbosa@email.com",
                phone: "73988776655",
                document: "88899900011"
            },
            Card: {
                id: "card-006",
                name: "GABRIEL BARBOSA",
                last4: "2345",
                brand: "MASTERCARD",
                expYear: "2028",
                expMonth: "05"
            },
            Installments: [
                {
                    id: "inst-013",
                    paymentId: "pay-012",
                    installmentNumber: 1,
                    grossValue: 12498,
                    netValue: 12118,
                    dueDate: "2026-02-05",
                    paidAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                    receivedAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "CONFIRMED",
                    externalPaymentId: "cc_asaas_012_1",
                    externalInstallmentId: "inst_asaas_012_1",
                    createdAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-014",
                    paymentId: "pay-012",
                    installmentNumber: 2,
                    grossValue: 12498,
                    netValue: 12118,
                    dueDate: "2026-03-05",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_012_2",
                    externalInstallmentId: "inst_asaas_012_2",
                    createdAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-015",
                    paymentId: "pay-012",
                    installmentNumber: 3,
                    grossValue: 12498,
                    netValue: 12118,
                    dueDate: "2026-04-05",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_012_3",
                    externalInstallmentId: "inst_asaas_012_3",
                    createdAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-016",
                    paymentId: "pay-012",
                    installmentNumber: 4,
                    grossValue: 12496,
                    netValue: 12116,
                    dueDate: "2026-05-05",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_012_4",
                    externalInstallmentId: "inst_asaas_012_4",
                    createdAt: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            Tickets: [
                {
                    id: "ticket-019",
                    status: "CONFIRMED",
                    ticketTypeId: "type-009",
                    TicketType: {
                        id: "type-009",
                        name: "Platinum",
                        description: "Acesso platinum com todos os benefícios premium"
                    },
                    TicketDates: [
                        {
                            id: "td-019",
                            eventDateId: "ed-010",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-010",
                                date: "2026-03-25",
                                hourStart: "18:00",
                                hourEnd: "02:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-010",
                name: "Festival Premium",
                description: "O evento mais exclusivo da temporada",
                slug: "festival-premium",
                location: "Resort Premium",
                image: "event-010.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-010",
                    companyName: "Premium Events",
                    companyDocument: "88.999.000/0001-11"
                }
            }
        },
        {
            id: "pay-013",
            method: "PIX",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "pix_asaas_013",
            eventId: "event-011",
            eventInfo: { amount: 1 },
            grossValue: 3990,
            netValue: 3890,
            discountedValue: 0,
            gatewayFeeGain: 0,
            customerFee: 40,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 40,
            couponInfo: null,
            creditCardInstallments: null,
            organizerPayout: 3890,
            totalPaidByCustomer: 3990,
            invoiceUrl: "https://example.com/invoice/013",
            invoiceNumber: "NF-013",
            transactionReceiptUrl: "https://example.com/receipt/013",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-013",
            cardId: null,
            createdAt: new Date(baseDate.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-013",
                firstName: "Mariana",
                lastName: "Silva",
                email: "mariana.silva@email.com",
                phone: "73977665544",
                document: "33344455566"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-020",
                    status: "CONFIRMED",
                    ticketTypeId: "type-010",
                    TicketType: {
                        id: "type-010",
                        name: "Online",
                        description: "Acesso online ao evento"
                    },
                    TicketDates: []
                }
            ],
            Event: {
                id: "event-011",
                name: "Workshop Online de Marketing",
                description: "Aprenda estratégias de marketing digital",
                slug: "workshop-marketing-online",
                location: null,
                image: "event-011.jpg",
                isFree: false,
                isOnline: true,
                createdAt: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-011",
                    companyName: "Educação Digital",
                    companyDocument: "33.444.555/0001-66"
                }
            }
        },
        {
            id: "pay-014",
            method: "CREDIT_CARD",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "cc_asaas_014",
            eventId: "event-012",
            eventInfo: { amount: 2 },
            grossValue: 19980,
            netValue: 19380,
            discountedValue: 0,
            gatewayFeeGain: 600,
            customerFee: 0,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 600,
            couponInfo: null,
            creditCardInstallments: 2,
            organizerPayout: 19380,
            totalPaidByCustomer: 19980,
            invoiceUrl: "https://example.com/invoice/014",
            invoiceNumber: "NF-014",
            transactionReceiptUrl: "https://example.com/receipt/014",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-014",
            cardId: "card-007",
            createdAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-014",
                firstName: "Thiago",
                lastName: "Nascimento",
                email: "thiago.nascimento@email.com",
                phone: "73966554433",
                document: "55566677788"
            },
            Card: {
                id: "card-007",
                name: "THIAGO NASCIMENTO",
                last4: "6789",
                brand: "VISA",
                expYear: "2027",
                expMonth: "08"
            },
            Installments: [
                {
                    id: "inst-017",
                    paymentId: "pay-014",
                    installmentNumber: 1,
                    grossValue: 9990,
                    netValue: 9690,
                    dueDate: "2026-02-10",
                    paidAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
                    receivedAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "CONFIRMED",
                    externalPaymentId: "cc_asaas_014_1",
                    externalInstallmentId: "inst_asaas_014_1",
                    createdAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "inst-018",
                    paymentId: "pay-014",
                    installmentNumber: 2,
                    grossValue: 9990,
                    netValue: 9690,
                    dueDate: "2026-03-10",
                    paidAt: null,
                    receivedAt: null,
                    status: "PENDING",
                    externalPaymentId: "cc_asaas_014_2",
                    externalInstallmentId: "inst_asaas_014_2",
                    createdAt: new Date(baseDate.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            Tickets: [
                {
                    id: "ticket-021",
                    status: "CONFIRMED",
                    ticketTypeId: "type-011",
                    TicketType: {
                        id: "type-011",
                        name: "Dupla",
                        description: "Ingresso para casal"
                    },
                    TicketDates: [
                        {
                            id: "td-021",
                            eventDateId: "ed-011",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-011",
                                date: "2026-04-10",
                                hourStart: "19:30",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-022",
                    status: "CONFIRMED",
                    ticketTypeId: "type-011",
                    TicketType: {
                        id: "type-011",
                        name: "Dupla",
                        description: "Ingresso para casal"
                    },
                    TicketDates: [
                        {
                            id: "td-022",
                            eventDateId: "ed-011",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-011",
                                date: "2026-04-10",
                                hourStart: "19:30",
                                hourEnd: "23:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-012",
                name: "Jantar Romântico",
                description: "Jantar especial para casais",
                slug: "jantar-romantico",
                location: "Restaurante à Beira Mar",
                image: "event-012.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-012",
                    companyName: "Gastronomia Romântica",
                    companyDocument: "55.666.777/0001-88"
                }
            }
        },
        {
            id: "pay-015",
            method: "PIX",
            type: "TICKET",
            status: "CONFIRMED",
            externalPaymentId: "pix_asaas_015",
            eventId: "event-013",
            eventInfo: { amount: 5 },
            grossValue: 49950,
            netValue: 49450,
            discountedValue: 5000,
            gatewayFeeGain: 0,
            customerFee: 500,
            organizerFee: 0,
            customerPaymentFee: 0,
            platformPaymentFee: 500,
            couponInfo: {
                code: "GRUPO10",
                discount: 5000
            },
            creditCardInstallments: null,
            organizerPayout: 49450,
            totalPaidByCustomer: 44950,
            invoiceUrl: "https://example.com/invoice/015",
            invoiceNumber: "NF-015",
            transactionReceiptUrl: "https://example.com/receipt/015",
            qrcodeData: null,
            failedReason: null,
            paidAt: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
            chargebackRequested: false,
            userId: "user-015",
            cardId: null,
            createdAt: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(baseDate.getTime() + 26 * 24 * 60 * 60 * 1000).toISOString(),
            User: {
                id: "user-015",
                firstName: "Beatriz",
                lastName: "Costa",
                email: "beatriz.costa@email.com",
                phone: "73955443322",
                document: "99988877766"
            },
            Card: null,
            Installments: [],
            Tickets: [
                {
                    id: "ticket-023",
                    status: "CONFIRMED",
                    ticketTypeId: "type-012",
                    TicketType: {
                        id: "type-012",
                        name: "Grupo",
                        description: "Pacote para grupos com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-023",
                            eventDateId: "ed-012",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-012",
                                date: "2026-05-15",
                                hourStart: "17:00",
                                hourEnd: "21:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-024",
                    status: "CONFIRMED",
                    ticketTypeId: "type-012",
                    TicketType: {
                        id: "type-012",
                        name: "Grupo",
                        description: "Pacote para grupos com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-024",
                            eventDateId: "ed-012",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-012",
                                date: "2026-05-15",
                                hourStart: "17:00",
                                hourEnd: "21:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-025",
                    status: "CONFIRMED",
                    ticketTypeId: "type-012",
                    TicketType: {
                        id: "type-012",
                        name: "Grupo",
                        description: "Pacote para grupos com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-025",
                            eventDateId: "ed-012",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-012",
                                date: "2026-05-15",
                                hourStart: "17:00",
                                hourEnd: "21:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-026",
                    status: "CONFIRMED",
                    ticketTypeId: "type-012",
                    TicketType: {
                        id: "type-012",
                        name: "Grupo",
                        description: "Pacote para grupos com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-026",
                            eventDateId: "ed-012",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-012",
                                date: "2026-05-15",
                                hourStart: "17:00",
                                hourEnd: "21:00"
                            }
                        }
                    ]
                },
                {
                    id: "ticket-027",
                    status: "CONFIRMED",
                    ticketTypeId: "type-012",
                    TicketType: {
                        id: "type-012",
                        name: "Grupo",
                        description: "Pacote para grupos com desconto"
                    },
                    TicketDates: [
                        {
                            id: "td-027",
                            eventDateId: "ed-012",
                            status: "CONFIRMED",
                            EventDate: {
                                id: "ed-012",
                                date: "2026-05-15",
                                hourStart: "17:00",
                                hourEnd: "21:00"
                            }
                        }
                    ]
                }
            ],
            Event: {
                id: "event-013",
                name: "Festa de Aniversário",
                description: "Celebração especial com música ao vivo",
                slug: "festa-aniversario",
                location: "Salão de Festas",
                image: "event-013.jpg",
                isFree: false,
                isOnline: false,
                createdAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                Organizer: {
                    id: "org-013",
                    companyName: "Festas e Eventos",
                    companyDocument: "99.888.777/0001-66"
                }
            }
        }
    ]
}

const mockPaymentAdminListResponse: TApiResponse<TListPaymentsResponse> = {
    success: true,
    data: {
        data: generateMockPayments(),
        total: 15,
        limit: 50,
        offset: 0
    }
}

class PaymentServiceClass {
    async verifyPaymentStatus(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment-gateway",
            url: `/verify-payment-status/${paymentId}`
        }))?.data
        return response
    }

    // ADMIN
    async listPayments(params?: TListPaymentsParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment",
            url: "/list-payments",
            params: params
        }))?.data
        return response
    }
}

export const PaymentService = new PaymentServiceClass()