"use client"

import { Slide, toast, ToastOptions } from "react-toastify"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

const globalToastOptions: ToastOptions = {
    position: window.innerWidth < 768 ? "top-center" : "bottom-right",
    autoClose: 5000,
    transition: Slide,
    hideProgressBar: true,
    closeOnClick: false,
    icon: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: "custom-toast"
}

class ToastComponent {

    static success(message: string) {
        toast(
            <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-psi-dark leading-tight">{message}</p>
                </div>
            </div>,
            {
                ...globalToastOptions,
                type: "success",
                className: "custom-toast custom-toast-success"
            }
        )
    }

    static error(message: string) {
        toast(
            <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-psi-dark leading-tight">{message}</p>
                </div>
            </div>,
            {
                ...globalToastOptions,
                type: "error",
                className: "custom-toast custom-toast-error"
            }
        )
    }

    static info(message: string) {
        toast(
            <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-psi-primary/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-psi-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-psi-dark leading-tight">{message}</p>
                </div>
            </div>,
            {
                ...globalToastOptions,
                type: "info",
                className: "custom-toast custom-toast-info"
            }
        )
    }

}

export {
    ToastComponent as Toast
}
