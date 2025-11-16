type TLogoProps = {
    variant?: "primary" | "secondary" | "black" | "white"
    className?: string
}

const Logo = (
    {
        variant="primary",
        className=""
    }: TLogoProps
) => {
    const logoPrimaryUrl = "/images/logos/logo-porto-seguro-ingressos-primary.png"
    const logoSecondaryUrl = "/images/logos/logo-porto-seguro-ingressos-secondary.png"
    const logoBlackUrl = "/images/logos/logo-porto-seguro-ingressos-black.png"
    const logoWhiteUrl = "/images/logos/logo-porto-seguro-ingressos-white.png"

    return (
        <>
        <img
            src={variant === "primary" ? logoPrimaryUrl : variant === "secondary" ? logoSecondaryUrl : variant === "black" ? logoBlackUrl : logoWhiteUrl}
            alt="Logo"
            width={100} height={100}
            className={className}
        />
        </>
    )
}

export default Logo