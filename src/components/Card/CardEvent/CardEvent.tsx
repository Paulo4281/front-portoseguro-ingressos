import Link from "next/link"
import { Calendar, Clock, MapPin, Ticket } from "lucide-react"
import { Card } from "@/components/Card/Card"
import { Button } from "@/components/ui/button"
import type { TEvent } from "@/types/Event/TEvent"

type TCardEventProps = {
    event: TEvent
}

const CardEvent = (
    {
        event
    }: TCardEventProps
) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(price)
    }

    return (
        <Card className="h-full flex flex-col">
            <div className="relative w-full h-48 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2">
                    {event.name}
                </h3>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                                {event.hourStart}
                                {event.hourEnd && ` - ${event.hourEnd}`}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-psi-primary">
                        {formatPrice(event.price)}
                    </span>
                    
                    <Button asChild variant="primary">
                        <Link href={`/eventos/${event.id}`}>
                            Ver Detalhes
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export {
    CardEvent 
}