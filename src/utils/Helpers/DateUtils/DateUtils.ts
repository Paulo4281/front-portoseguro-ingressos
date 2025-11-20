import moment from "moment"
import "moment/locale/pt-br"

moment.locale("pt-br")

class DateUtilsClass {
    formatDateUTC(date: Date): string {
        return moment(date).utc().format("DD/MM/YYYY")
    }

    formatDateUTCString(date: string, format: string = "DD/MM/YYYY"): string {
        return moment(date).utc().format(format)
    }

    formatDate(date: string, format: string = "DD/MM/YYYY"): string {
        return moment(date).format(format)
    }
}

export const DateUtils = new DateUtilsClass()