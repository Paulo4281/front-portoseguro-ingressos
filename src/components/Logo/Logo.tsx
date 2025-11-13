type TLogoProps = {
    variant?: "primary" | "secondary"
    className?: string
}

const Logo = (
    {
        variant="primary",
        className=""
    }: TLogoProps
) => {
    const logoPrimaryUrl = ""
    const logoSecondaryUrl = ""

    return (
        <>
        <img
            src={variant === "primary" ? logoPrimaryUrl : logoSecondaryUrl}
            alt=""
            width={100} height={100}
            className={className}
        />
        </>
    )
}

export default Logo