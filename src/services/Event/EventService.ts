import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import { EventCreateValidator } from "@/validators/Event/EventValidator"
import type { z } from "zod"

type TEventCreate = z.infer<typeof EventCreateValidator>

class EventService {
    async find(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: "/"
        }))?.data
        return response
    }

    async findByUserId(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: "/user"
        }))?.data
        return response
    }

    async findById(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/${id}`
        }))?.data
        return response
    }

    async create(data: TEventCreate): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        
        formData.append("name", data.name)
        formData.append("description", data.description)
        if (data.location) {
            formData.append("location", data.location)
        }
        formData.append("isClientTaxed", String(data.isClientTaxed || false))
        
        if (data.image) {
            formData.append("image", data.image)
        }

        if (data.form) {
            formData.append("form", JSON.stringify(data.form))
        }

        if (data.isFormForEachTicket) {
            formData.append("isFormForEachTicket", String(data.isFormForEachTicket))
        }
        
        if (data.categories && data.categories.length > 0) {
            data.categories.forEach((categoryId: string, index: number) => {
                formData.append(`categories[${index}]`, categoryId)
            })
        }
        
        if (data.ticketTypes && data.ticketTypes.length > 0) {
            formData.append("ticketTypes", JSON.stringify(data.ticketTypes))
        }
        
        if (data.batches && data.batches.length > 0) {
            formData.append("batches", JSON.stringify(data.batches))
        } else {
            if (data.tickets !== undefined) {
                formData.append("tickets", String(data.tickets))
            }
            if (data.ticketPrice !== undefined) {
                formData.append("ticketPrice", String(data.ticketPrice))
            }
        }
        
        if (data.recurrence) {
            formData.append("recurrence", JSON.stringify(data.recurrence))
        } else if (data.dates && data.dates.length > 0) {
            formData.append("dates", JSON.stringify(data.dates))
        }
        
        const response = (await API.POST_FILE({
            prefix: "/event",
            url: "/",
            formData: formData
        }))?.data
        return response
    }
}

export const eventService = new EventService()