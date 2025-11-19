import { useEffect, useMemo } from "react"
import { useQueryHook } from "../useQuery"
import { EventCategoryService } from "@/services/Event/EventCategoryService"
import { useEventCategoryStore } from "@/stores/EventCategory/EventCategoryStore"
import type { TEventCategory } from "@/types/Event/TEventCategory"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventCategoryFind = () => {
    const { isCacheExpired, getCachedCategories, setEventCategories } = useEventCategoryStore()
    const cachedCategories = getCachedCategories()
    const shouldFetch = isCacheExpired()

    const {
        data: queryData,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventCategory[]>>({
        queryKey: ["event-categories"],
        queryFn: async () => {
            const response = await EventCategoryService.find()
            return response
        },
        enabled: shouldFetch
    })

    useEffect(() => {
        if (queryData?.data && shouldFetch) {
            setEventCategories(queryData.data)
        }
    }, [queryData, shouldFetch, setEventCategories])

    const data = useMemo(() => {
        if (cachedCategories && cachedCategories.length > 0) {
            return { data: cachedCategories } as TApiResponse<TEventCategory[]>
        }
        return queryData
    }, [cachedCategories, queryData])

    return {
        data,
        isLoading: shouldFetch ? isLoading : false,
        isFetching: shouldFetch ? isFetching : false
    }
}