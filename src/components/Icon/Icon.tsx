type TIconProps = {
    icon: "google" | "instagram"
    className?: string
}

const IconComponent = (
    {
        icon,
        className
    }: TIconProps
) => {
    const iconMap: Record<TIconProps["icon"], React.ReactNode> = {
        "google": <img src="/icons/social/google.png" alt="Google" className={className} />,
        "instagram": <img src="/icons/social/instagram.png" alt="Instagram" className={className} />
    }

    return (
        <>
        {iconMap[icon]}
        </>
    )
}

export {
    IconComponent as Icon
}