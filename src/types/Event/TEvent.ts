type TEvent = {
    id: string
    name: string
    description: string
    date: string
    hourStart: string
    hourEnd: string | null
    location: string | null
    image: string
    tickets: number
    price: number
    createdAt: string
    updatedAt: string | null
}

export type {
    TEvent
}