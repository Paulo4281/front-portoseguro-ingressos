import { cn } from "@/lib/utils"

type TCardProps = {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}

const CardComponent = (
    {
        children,
        className,
        onClick
    }: TCardProps
) => {
    return (
        <div
            className={cn(
                "bg-card text-card-foreground rounded-lg shadow-sm overflow-hidden transition-all",
                onClick && "cursor-pointer hover:shadow-md",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export {
    CardComponent as Card
}