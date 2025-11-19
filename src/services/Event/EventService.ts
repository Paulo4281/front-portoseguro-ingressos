import type { TEvent } from "@/types/Event/TEvent"

export const mockEvents: TEvent[] = [
    {
        id: "1",
        name: "Luau Toa Toa",
        description: "Evento único com data e horário específicos",
        dates: [
            {
                date: "2025-01-15",
                hourStart: "18:00",
                hourEnd: "23:00"
            }
        ],
        location: "Praça da Liberdade",
        image: "https://lh4.googleusercontent.com/9JGCCWdXwwcJl9Ceugw4PXeeipyRTthNVQwc4i7dobJC9aVnNXGqQHsMdKasYorZBaa_v54gBLnj79JpemN6j5QxitMh-yKUeQ-AGmYw1OreJOdHk15HzNbn-7JVcbkTd__ymq1-=s0",
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
                isActive: false,
                createdAt: "2025-01-01",
                updatedAt: null
            },
            {
                id: "1-2",
                name: "2º Lote",
                price: 75.00,
                quantity: 30,
                startDate: "2025-01-10",
                endDate: "2025-01-14",
                isActive: false,
                createdAt: "2025-01-01",
                updatedAt: null
            },
            {
                id: "1-3",
                name: "3º Lote",
                price: 10000,
                quantity: 20,
                startDate: "2025-01-14",
                endDate: null,
                isActive: true,
                createdAt: "2025-01-01",
                updatedAt: null
            }
        ],
        createdAt: "2025-01-01",
        updatedAt: null,
        categories: []
    },
    {
        id: "2",
        name: "Luau Barramares",
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
        image: "https://d1imnsv6c1mbva.cloudfront.net/events/25e15e4c-9274-4aaa-8dc1-94ff553a75bd_banner.png",
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
                isActive: true,
                createdAt: "2025-01-02",
                updatedAt: null
            },
            {
                id: "2-2",
                name: "Lote Regular",
                price: 120.00,
                quantity: 100,
                startDate: "2025-02-01",
                endDate: null,
                isActive: false,
                createdAt: "2025-01-02",
                updatedAt: null
            }
        ],
        createdAt: "2025-01-02",
        updatedAt: null,
        categories: []
    },
    {
        id: "3",
        name: "Evento Evangélico",
        description: `
        ## Evento recorrente toda sexta-feira
        `,
        dates: [
            {
                date: "2025-01-17",
                hourStart: "17:00",
                hourEnd: "23:00"
            }
        ],
        location: "Praia de Taperapuã",
        image: "https://s2-g1.glbimg.com/a_dVEJfnuxGagxrcat06mcLK85w=/0x0:512x640/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/g/J/N0dCsySiuBRCA5M58wcQ/semana-evangelica-paracambi.jpg",
        tickets: 150,
        recurrence: {
            type: "WEEKLY",
            daysOfWeek: [
                {
                    day: 5,
                    hourStart: "17:00",
                    hourEnd: "23:00"
                }
            ],
            endDate: "2025-03-31"
        },
        batches: null,
        createdAt: "2025-01-05",
        updatedAt: null,
        categories: []
    },
    {
        id: "4",
        name: "Meia Maratona do Descobrimento",
        description: `# Meia Maratona do Descobrimento

## Sobre o Evento

A **Meia Maratona do Descobrimento** é um evento esportivo único que celebra a história e a beleza de Porto Seguro, a primeira cidade do Brasil. Corra pelos 21,0975 km de um percurso deslumbrante que combina desafio atlético com paisagens paradisíacas.

## Percurso

O trajeto passa pelos principais pontos turísticos e históricos de Porto Seguro:

- **Largada**: Avenida do Descobrimento
- **Checkpoints**: Praia de Taperapuã, Centro Histórico, Mirante da Coroa Vermelha
- **Chegada**: Praia do Mutá

O percurso é **totalmente sinalizado** e conta com **suporte médico** em todos os pontos estratégicos.

## Horários

- **Largada**: 05:00h
- **Limite de tempo**: 3 horas (até 08:00h)
- **Premiação**: 09:00h

## Premiação

### Geral (Masculino e Feminino)
- 🥇 **1º lugar**: R$ 2.000,00 + Troféu
- 🥈 **2º lugar**: R$ 1.500,00 + Troféu
- 🥉 **3º lugar**: R$ 1.000,00 + Troféu

### Por Categoria
- **Veterano A, B, C**: Troféu para os 3 primeiros colocados
- **Master**: Troféu para os 3 primeiros colocados

## Kit do Corredor

Todos os participantes receberão:

- Camiseta técnica exclusiva
- Número de peito personalizado
- Medalha de participação
- Mochila do evento
- Chip de cronometragem
- Alimentação no percurso

## Inscrições

As inscrições são limitadas e os lotes têm preços diferenciados. Garanta já a sua vaga!

> **Importante**: O evento segue todas as normas de segurança e é homologado pela Confederação Brasileira de Atletismo.

## Contato

Para mais informações, entre em contato através do nosso suporte.`,
        dates: [
            {
                date: "2026-04-21",
                hourStart: "05:00",
                hourEnd: "10:00"
            }
        ],
        location: "Avenida do Descobrimento",
        image: "https://cdn.ticketsports.com.br/ticketagora/images/thumb/9I9M6G4JOO92VG3POR4RRPPSQE3SDZSZEICNWEGZI767OVGLX1.png",
        tickets: 140,
        recurrence: null,
        batches: [
            {
                id: "4-1",
                name: "1º Lote",
                price: 40.00,
                quantity: 80,
                startDate: "2025-10-01",
                endDate: "2025-12-30",
                isActive: true,
                createdAt: "2025-01-03",
                updatedAt: null
            },
            {
                id: "4-2",
                name: "2º Lote",
                price: 50.00,
                quantity: 40,
                startDate: "2026-01-12",
                endDate: "2026-02-20",
                isActive: true,
                createdAt: "2025-01-03",
                updatedAt: null
            },
            {
                id: "4-3",
                name: "3º Lote",
                price: 60.00,
                quantity: 20,
                startDate: "2026-02-26",
                endDate: "2026-04-04",
                isActive: true,
                createdAt: "2025-01-03",
                updatedAt: null
            }
        ],
        createdAt: "2025-01-03",
        updatedAt: null,
        categories: []
    },
    {
        id: "5",
        name: "Evento Imobiliário",
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
        image: "https://www.avalion.com.br/wp-content/uploads/2020/10/Banner-Summit-2020.png",
        tickets: 50,
        recurrence: null,
        batches: null,
        createdAt: "2025-01-01",
        updatedAt: null,
        categories: []
    },
    {
        id: "6",
        name: "Raízes - Evento Gastronômico",
        description: "Evento diário",
        dates: [
            {
                date: "2025-01-13",
                hourStart: "18:00",
                hourEnd: "21:00"
            }
        ],
        location: "Restaurante Beira Mar",
        image: "https://i0.wp.com/jornalgrandebahia.com.br/wp-content/uploads/2024/04/Festival-gastronomico-em-Porto-Seguro-20240415.jpg?fit=2400%2C1600&ssl=1",
        tickets: 100,
        recurrence: {
            type: "DAILY",
            hourStart: "18:00",
            hourEnd: "21:00",
            endDate: "2025-02-28"
        },
        batches: null,
        createdAt: "2025-01-02",
        updatedAt: null,
        categories: []
    },
    {
        id: "7",
        name: "Evento Cantor - Show",
        description: "Evento recorrente todo mês",
        dates: [
            {
                date: "2025-01-15",
                hourStart: "18:00",
                hourEnd: "21:00"
            }
        ],
        location: "Restaurante Beira Mar",
        image: "https://s2-gshow.glbimg.com/_9drx4nPG9Pg4B69tOUOIWE2LAw=/0x0:1350x1687/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2025/i/r/vhzfylTMeiaz8p6080LQ/dvdjoaogomes-1760010435-3739561033347482276-54129235808.jpg",
        tickets: 100,
        recurrence: {
            type: "MONTHLY",
            daysOfWeek: [
                {
                    day: 1,
                    hourStart: "18:00",
                    hourEnd: "21:00"
                },
                {
                    day: 2,
                    hourStart: "18:00",
                    hourEnd: "21:00"
                }
            ],
        },
        batches: null,
        createdAt: "2025-01-02",
        updatedAt: null,
        categories: []
    },
    {
        id: "8",
        name: "Festa na Praia - Sexta-feira",
        description: "Evento recorrente toda sexta-feira das 19h às 04h",
        dates: [
            {
                date: "2025-01-17",
                hourStart: "19:00",
                hourEnd: "04:00"
            }
        ],
        location: "Praia de Taperapuã",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        tickets: 300,
        recurrence: {
            type: "WEEKLY",
            daysOfWeek: [
                {
                    day: 5,
                    hourStart: "19:00",
                    hourEnd: "04:00"
                }
            ],
            endDate: null
        },
        batches: null,
        createdAt: "2025-01-06",
        updatedAt: null,
        categories: ["2ec9cdac-3346-46a0-b28d-22e345654b68", "65cb6c20-f6f6-4894-bef6-9140e30e9a27"]
    }
]

class EventService {
    async find(): Promise<any> {
        return mockEvents
    }

    async findById(id: string): Promise<any> {
        return mockEvents.find(event => event.id === id)
    }
}

export const eventService = new EventService()