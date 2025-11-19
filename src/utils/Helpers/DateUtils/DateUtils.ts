import moment from "moment"

class DateUtilsClass {
    formatDateUTC(date: Date): string {
        return moment(date).utc().format("DD/MM/YYYY")
    }

    formatDate(date: string, format: string = "DD/MM/YYYY"): string {
        return moment(date).format(format)
    }
}

export const DateUtils = new DateUtilsClass()