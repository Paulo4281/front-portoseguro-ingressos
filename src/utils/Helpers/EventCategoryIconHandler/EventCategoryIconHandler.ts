import { TEventCategory } from "@/types/Event/TEventCategory";
import { Church, LucideIcon, Tag, TreePalm, Volleyball } from "lucide-react";

const EventCategoryIconHandler = (category: TEventCategory["name"]): LucideIcon => {
    switch (category) {
        case "Esportes":
            return Volleyball
        case "Religioso":
            return Church
        case "Beach Club":
            return TreePalm
        default:
            return Tag
    }
}

export {
    EventCategoryIconHandler
}