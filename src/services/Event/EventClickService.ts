import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventClickCreate } from "@/types/Event/TEventClick"
import { InternalCampaignTracking } from "@/utils/Helpers/InternalCampaignTracking/InternalCampaignTracking"

class EventClickServiceClass {
    async create(data: TEventClickCreate): Promise<TApiResponse> {
        const trackedUtmId = InternalCampaignTracking.readFromSessionStorage()
        const payload: TEventClickCreate = {
            ...data,
            utmId: data.utmId || trackedUtmId || undefined,
            internalCampaignId: data.internalCampaignId || trackedUtmId || undefined
        }

        const response = await API.POST({
            prefix: "/event-click",
            url: "",
            data: payload
        })

        return response?.data
    }

    async countByEventId(eventId: string): Promise<TApiResponse<number>> {
        const response = await API.GET({
            prefix: "/event-click",
            url: `/count/${eventId}`
        })

        return response?.data
    }
}

export const EventClickService = new EventClickServiceClass()