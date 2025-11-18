import moment from "moment"

class DateUtilsClass {
    static formatDateUTC(date: Date): string {
        return moment(date).utc().format("DD/MM/YYYY")
    }

    static formatDate(date: string, format: string = "DD/MM/YYYY"): string {
        return moment(date).format(format)
    }
}

export const DateUtils = new DateUtilsClass()
export { DateUtilsClass }