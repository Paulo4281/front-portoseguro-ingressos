export type TObservation = {
    id: string
    observation: string
    userId: string
    ownerUserId: string
    createdAt: string
    updatedAt: string | null
}

export type TObservationCreate = {
    observation: string
    userId: string
}

export type TObservationUpdate = {
    observation?: string
}

export type TObservationResponse = {
    id: string
    observation: string
    userId: string
    ownerUserId: string
    createdAt: string
    updatedAt: string | null
}

