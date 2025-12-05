import { useMutation } from "@tanstack/react-query"

type TUseMutationProps<T, R> = {
    mutationFn: (variables: T) => Promise<R>
    onSuccess?: (data: R, variables: T) => void
}

function useMutationHook<T, R>(
    {
        mutationFn,
        onSuccess,
    }: TUseMutationProps<T, R>
) {
    return useMutation<R, unknown, T>({
        mutationFn: mutationFn,
        onSuccess: onSuccess
    })
}

export {
    useMutationHook
}