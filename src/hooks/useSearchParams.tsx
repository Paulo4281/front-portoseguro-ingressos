import { useSearchParams } from "next/navigation"

function useSearchParamsHook<T extends Record<string, string>>(params: (keyof T)[]): T {
    const searchParams = useSearchParams()

    let response = {} as T

    params.forEach((param) => {
        response[param] = searchParams.get(String(param)) as T[keyof T]
    })

    return response
}

export {
    useSearchParamsHook
}