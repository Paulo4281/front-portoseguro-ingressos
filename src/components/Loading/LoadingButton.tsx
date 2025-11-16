"use client"

import { Loader2 } from "lucide-react"

type TLoadingButtonProps = {
    message?: string
}

const LoadingButton = (
    {
        message = "Aguarde..."
    }: TLoadingButtonProps
) => {
    return (
        <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            {message}
        </>
    )
}

export {
    LoadingButton
}
