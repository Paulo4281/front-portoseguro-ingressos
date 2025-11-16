import { useQuery } from "@tanstack/react-query"

type TUseQueryProps = {
    queryKey: string[]
    queryFn: () => Promise<any>
    enabled?: boolean
}

function useQueryHook<T>(
    {
        queryKey,
        queryFn,
        enabled = true
    }: TUseQueryProps
) {
    return useQuery<T>({
        queryKey: queryKey,
        queryFn: queryFn,
        enabled: enabled
    })
}

export {
    useQueryHook
}