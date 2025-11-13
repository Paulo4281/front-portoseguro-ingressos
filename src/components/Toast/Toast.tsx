import { toast, ToastOptions } from "react-toastify"

const globalToastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
}

class ToastComponent {

    static success(message: string) {
        toast(message, {
            ...globalToastOptions,
            type: "success"
        })
    }

    static error(message: string) {
        toast(message, {
            ...globalToastOptions,
            type: "error"
        })
    }

}

export {
    ToastComponent as Toast
}