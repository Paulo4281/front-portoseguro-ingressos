import { useMutation } from "@tanstack/react-query"

type TUseMutationProps = {
    mutationFn: any
}

function useMutationHook<T, R>(
    {
        mutationFn,
    }: TUseMutationProps
) {
    return useMutation<R, unknown, T>({
        mutationFn: mutationFn
    })
}

export {
    useMutationHook
}