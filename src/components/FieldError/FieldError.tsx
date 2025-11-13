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
        { message && <p className="text-red-500 text-sm">{ message }</p> }
        </>
    )
}

export {
    FieldErrorComponent as FieldError
}