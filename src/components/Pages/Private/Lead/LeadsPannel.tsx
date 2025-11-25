"use client"

import { useMemo, useState } from "react"
import { useLeadFind } from "@/hooks/Lead/useLeadFind"
import type { TLead } from "@/types/Lead/TLead"
import { Background } from "@/components/Background/Background"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import {
    Users,
    ChevronDown,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Monitor,
    Smartphone,
    Tablet,
    Ticket
} from "lucide-react"

const LeadsPannel = () => {
    const { data, isLoading } = useLeadFind()
    
    const leads = useMemo(() => {
        if (data?.data && Array.isArray(data.data)) {
            return data.data
        }
        return []
    }, [data])

    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

    const toggleRow = (leadId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [leadId]: !prev[leadId]
        }))
    }

    const getDeviceIcon = (device: TLead["device"]) => {
        switch (device) {
            case "DESKTOP":
                return <Monitor className="h-4 w-4" />
            case "MOBILE":
                return <Smartphone className="h-4 w-4" />
            case "TABLET":
                return <Tablet className="h-4 w-4" />
            default:
                return null
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const formatAddress = (address: TLead["address"]) => {
        if (!address) return "Não informado"
        
        const parts = [
            address.neighborhood,
            address.city,
            address.state,
            address.zipCode
        ].filter(Boolean)
        
        return parts.join(", ") || "Não informado"
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] container">
            <section className="space-y-8 px-4
            sm:px-6
            lg:px-8">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-semibold text-psi-primary
                        sm:text-4xl">
                            Leads e clientes
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Visualize todos os clientes que já compraram ingressos dos seus eventos e acompanhe o histórico de compras.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-20 w-full rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 shadow-lg shadow-black/5 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-psi-dark/10 hover:bg-transparent bg-psi-dark/2">
                                    <TableHead className="h-16 px-6 text-psi-dark font-semibold text-sm uppercase tracking-wider">Cliente</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-semibold text-sm uppercase tracking-wider">Contato</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-semibold text-sm uppercase tracking-wider">Eventos</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-semibold text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-psi-primary/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-semibold text-psi-dark">Nenhum lead encontrado</p>
                                                    <p className="text-sm text-psi-dark/50">Os clientes que comprarem ingressos aparecerão aqui.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    leads.map((lead) => {
                                        const initials = `${lead.firstName.charAt(0)}${lead.lastName.charAt(0)}`.toUpperCase()
                                        
                                        return (
                                            <>
                                                <TableRow key={lead.id} className="border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors">
                                                    <TableCell className="py-5 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-psi-primary/20 to-psi-primary/10 flex items-center justify-center shrink-0">
                                                                <span className="text-sm font-semibold text-psi-primary">
                                                                    {initials}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1 min-w-0">
                                                                <p className="font-semibold text-psi-dark text-base">
                                                                    {lead.firstName} {lead.lastName}
                                                                </p>
                                                                <p className="text-xs text-psi-dark/50 flex items-center gap-1.5">
                                                                    <Calendar className="h-3 w-3" />
                                                                    Cliente desde {formatDate(lead.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2.5 text-sm text-psi-dark/80 group">
                                                                <div className="h-8 w-8 rounded-lg bg-psi-primary/10 flex items-center justify-center group-hover:bg-psi-primary/20 transition-colors">
                                                                    <Mail className="h-3.5 w-3.5 text-psi-primary" />
                                                                </div>
                                                                <span className="truncate">{lead.email}</span>
                                                            </div>
                                                            {lead.phone && (
                                                                <div className="flex items-center gap-2.5 text-sm text-psi-dark/80 group">
                                                                    <div className="h-8 w-8 rounded-lg bg-psi-primary/10 flex items-center justify-center group-hover:bg-psi-primary/20 transition-colors">
                                                                        <Phone className="h-3.5 w-3.5 text-psi-primary" />
                                                                    </div>
                                                                    <span>{lead.phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <Badge variant="default" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20 font-medium px-3 py-1.5">
                                                            {lead.totalEventsPurchased} {lead.totalEventsPurchased === 1 ? "evento" : "eventos"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(lead.id)}
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-psi-primary hover:text-psi-primary/80 transition-all hover:gap-3 px-3 py-1.5 rounded-lg hover:bg-psi-primary/5"
                                                        >
                                                            Ver detalhes
                                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openRows[lead.id] ? "rotate-180" : ""}`} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                                {openRows[lead.id] && (
                                                    <TableRow className="border-0">
                                                        <TableCell colSpan={4} className="p-0">
                                                            <div className="bg-gradient-to-br from-psi-dark/2 to-psi-dark/5 px-8 py-8 space-y-8 border-t border-psi-dark/10">
                                                                <div className="grid gap-6
                                                                md:grid-cols-2
                                                                lg:grid-cols-3">
                                                                    {lead.birth && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Calendar className="h-4 w-4 text-psi-primary" />
                                                                                Data de nascimento
                                                                            </div>
                                                                            <p className="text-base font-semibold text-psi-dark">
                                                                                {formatDate(lead.birth)}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {lead.device && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <div className="text-psi-primary">
                                                                                    {getDeviceIcon(lead.device)}
                                                                                </div>
                                                                                Dispositivo
                                                                            </div>
                                                                            <p className="text-base font-semibold text-psi-dark">
                                                                                {lead.device === "DESKTOP" ? "Desktop" : lead.device === "MOBILE" ? "Mobile" : "Tablet"}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {lead.address && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm
                                                                        md:col-span-2
                                                                        lg:col-span-1">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <MapPin className="h-4 w-4 text-psi-primary" />
                                                                                Endereço
                                                                            </div>
                                                                            <p className="text-base font-semibold text-psi-dark leading-relaxed">
                                                                                {formatAddress(lead.address)}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {lead.events.length > 0 && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                                                <Ticket className="h-5 w-5 text-psi-primary" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-semibold text-psi-dark">
                                                                                    Eventos adquiridos
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    {lead.events.length} {lead.events.length === 1 ? "compra realizada" : "compras realizadas"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid gap-3
                                                                        md:grid-cols-2">
                                                                            {lead.events.map((event) => (
                                                                                <div
                                                                                    key={event.id}
                                                                                    className="rounded-2xl border border-psi-dark/10 bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow group"
                                                                                >
                                                                                    <div className="flex items-start justify-between gap-4">
                                                                                        <div className="flex-1 space-y-2 min-w-0">
                                                                                            <p className="font-semibold text-psi-dark text-base group-hover:text-psi-primary transition-colors">
                                                                                                {event.eventName}
                                                                                            </p>
                                                                                            <div className="flex items-center gap-2 text-xs text-psi-dark/50">
                                                                                                <Calendar className="h-3 w-3" />
                                                                                                <span>Comprado em {formatDateTime(event.purchaseDate)}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center justify-between pt-2 border-t border-psi-dark/5">
                                                                                        <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20 font-medium">
                                                                                            {event.ticketsCount} {event.ticketsCount === 1 ? "ingresso" : "ingressos"}
                                                                                        </Badge>
                                                                                        <p className="text-base font-bold text-psi-primary">
                                                                                            {ValueUtils.centsToCurrency(event.purchaseValue)}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </section>
        </Background>
    )
}

export {
    LeadsPannel
}