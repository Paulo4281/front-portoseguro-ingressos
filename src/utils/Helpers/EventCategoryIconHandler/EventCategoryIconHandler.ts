import { TEventCategory } from "@/types/Event/TEventCategory";
import { Baby, Beer, Bolt, BookOpenText, Brain, Brush, Camera, Car, ChartColumn, ChartSpline, Church, Clapperboard, Cpu, Cross, Drama, Dumbbell, EyeClosed, Footprints, Gamepad2, Gauge, GraduationCap, HandFist, HandMetal, Handshake, HeartHandshakeIcon, House, LucideIcon, Luggage, Medal, Microchip, MicVocal, Motorbike, Music, Music4, Orbit, PartyPopper, PawPrint, PenTool, PersonStanding, Plane, ScissorsLineDashed, Shirt, Smile, Speech, Tag, TentTree, Tractor, TreePalm, Trees, Users, Utensils, Volleyball, Wine } from "lucide-react";

const EventCategoryIconHandler = (category: TEventCategory["name"]): LucideIcon => {
    switch (category) {
        case "Esportes":
            return Volleyball
        case "Religioso":
            return Church
        case "Beach Club":
            return TreePalm
        case "Shows":
            return MicVocal
        case "Festivais":
            return PartyPopper
        case "Teatro":
            return Drama
        case "Stand-up":
            return Smile
        case "Baladas":
            return Music
        case "Workshops":
            return Bolt
        case "Congressos":
            return Speech
        case "Palestras":
            return MicVocal
        case "Cursos":
            return GraduationCap
        case "Gastronomia":
            return Utensils
        case "Feiras":
            return Users
        case "Tecnologia":
            return Cpu
        case "Startups":
            return ChartColumn
        case "Negócios":
            return Handshake
        case "Saúde":
            return Cross
        case "Corridas":
            return Medal
        case "Crossfit":
            return Dumbbell
        case "Lutas":
            return HandFist
        case "Dança":
            return Music4
        case "Rock":
            return HandMetal
        case "Eletrônica":
            return Microchip
        case "Gospel":
            return Church
        case "Infantil":
            return Baby
        case "Anime":
            return PenTool
        case "Games":
            return Gamepad2
        case "Cinema":
            return Clapperboard
        case "Fotografia":
            return Camera
        case "Arte":
            return Brush
        case "Cultura":
            return PersonStanding
        case "Literatura":
            return BookOpenText
        case "Natureza":
            return Trees
        case "Trilhas":
            return Footprints
        case "Camping":
            return TentTree
        case "Viagens":
            return Luggage
        case "Carros":
            return Car
        case "Motos":
            return Motorbike
        case "Automotivo":
            return Gauge
        case "Moda":
            return Shirt
        case "Beleza":
            return EyeClosed
        case "Pets":
            return PawPrint
        case "Comédia":
            return MicVocal
        case "Networking":
            return Users
        case "Espiritualidade":
            return Church
        case "Beneficentes":
            return HeartHandshakeIcon
        case "Universitários":
            return GraduationCap
        case "Empresariais":
            return ChartSpline
        case "Inaugurações":
            return ScissorsLineDashed
        case "Yoga":
            return Brain
        case "Wine":
            return Wine
        case "Cerveja Artesanal":
            return Beer
        case "Agricultura":
            return Tractor
        case "Aviação":
            return Plane
        case "Geek":
            return Orbit
        case "Imobiliário":
            return House
        default:
            return Tag
    }
}

export {
    EventCategoryIconHandler
}