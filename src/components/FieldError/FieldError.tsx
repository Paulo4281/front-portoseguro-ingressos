type TFieldErrorProps = {
    message: string
}

const FieldErrorComponent = (
    {
        message
    }: TFieldErrorProps
) => {
    return (
        <>
        { message && (
            <p className="text-red-500
            text-sm
            animate-[fadeIn_0.2s_ease-in-out_forwards]">
                { message }
            </p>
        ) }
        </>
    )
}

export {
    FieldErrorComponent as FieldError
}