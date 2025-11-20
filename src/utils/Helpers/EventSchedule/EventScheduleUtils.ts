import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"

const DATE_FALLBACK = "Data a definir"
const TIME_FALLBACK = "Horário a definir"

const getDateOrderValue = (dateString?: string | null) => {
    if (!dateString) return Number.MAX_SAFE_INTEGER
    const timestamp = Date.parse(dateString)
    if (Number.isNaN(timestamp)) return Number.MAX_SAFE_INTEGER
    return timestamp
}

const formatEventDate = (
    dateString?: string | null,
    format = "DD [de] MMMM [de] YYYY",
    fallback = DATE_FALLBACK
) => {
    if (!dateString) return fallback
    const timestamp = Date.parse(dateString)
    if (Number.isNaN(timestamp)) return fallback
    return DateUtils.formatDateUTCString(dateString, format)
}

const formatEventTime = (
    hourStart?: string | null,
    hourEnd?: string | null,
    fallback = TIME_FALLBACK
) => {
    if (!hourStart) return fallback
    return hourEnd ? `${hourStart} - ${hourEnd}` : hourStart
}

export {
    DATE_FALLBACK,
    TIME_FALLBACK,
    getDateOrderValue,
    formatEventDate,
    formatEventTime
}

