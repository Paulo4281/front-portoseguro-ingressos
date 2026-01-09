"use client"

import { useMemo, useState } from "react"
import { useOrganizerFindClients } from "@/hooks/Client/useOrganizerFindClients"
import type { TClient, TClientEvent, TFindOrganizerClientsResponse } from "@/types/Client/TClient"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { Pagination } from "@/components/Pagination/Pagination"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import {
    Users,
    ChevronDown,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Ticket,
    Search,
    X
} from "lucide-react"

const ClientsPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeSearchQuery, setActiveSearchQuery] = useState("")

    const offset = (currentPage - 1) * 10

    const { data, isLoading } = useOrganizerFindClients({
        offset,
        search: activeSearchQuery || undefined
    })
    
    const clients = useMemo(() => {
        if (!data?.data?.data) return []
        if (Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }, [data])

    const responseData: TFindOrganizerClientsResponse = data?.data || { data: [], total: 0, limit: 10, offset: 0 }
    const totalItems = responseData.total || 0
    const limit = responseData.limit || 10
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 0

    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

    const toggleRow = (clientId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [clientId]: !prev[clientId]
        }))
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

    const formatAddress = (address: TClient["address"]) => {
        if (!address) return "Não informado"
        
        const parts = [
            address.neighborhood,
            address.city,
            address.state,
            address.zipCode
        ].filter(Boolean)
        
        return parts.join(", ") || "Não informado"
    }

    const handleSearch = () => {
        setActiveSearchQuery(searchQuery)
        setCurrentPage(1)
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        setActiveSearchQuery("")
        setCurrentPage(1)
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
                            Clientes
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Visualize todos os clientes que já compraram ingressos dos seus eventos e acompanhe o histórico de compras.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Input
                            placeholder="Buscar por nome, e-mail, telefone ou CPF..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch()
                                }
                            }}
                            icon={Search}
                            className="w-full bg-psi-light"
                        />
                        <Button
                            variant="primary"
                            onClick={handleSearch}
                            className="shrink-0"
                        >
                            Buscar
                        </Button>
                        {activeSearchQuery && (
                            <Button
                                variant="ghost"
                                onClick={handleClearSearch}
                                className="shrink-0"
                            >
                                <X className="h-4 w-4" />
                                Limpar
                            </Button>
                        )}
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
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Cliente</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Contato</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Eventos</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-psi-primary/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-medium text-psi-dark">Nenhum lead encontrado</p>
                                                    <p className="text-sm text-psi-dark/50">Os clientes que comprarem ingressos aparecerão aqui.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clients.map((client) => {
                                        const initials = `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase()
                                        
                                        return (
                                            <>
                                                <TableRow key={client.id} className="border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors">
                                                    <TableCell className="py-5 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-psi-primary/20 to-psi-primary/10 flex items-center justify-center shrink-0">
                                                                <span className="text-sm font-medium text-psi-primary">
                                                                    {initials}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1 min-w-0">
                                                                <p className="font-medium text-psi-dark text-base">
                                                                    {client.firstName} {client.lastName}
                                                                </p>
                                                                <p className="text-xs text-psi-dark/50 flex items-center gap-1.5">
                                                                    <Calendar className="h-3 w-3" />
                                                                    Cliente desde {formatDate(client.createdAt)}
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
                                                                <span className="truncate">{client.email}</span>
                                                            </div>
                                                            {client.phone && (
                                                                <div className="flex items-center gap-2.5 text-sm text-psi-dark group">
                                                                    <div className="h-8 w-8 rounded-lg bg-psi-primary/10 flex items-center justify-center group-hover:bg-psi-primary/20 transition-colors">
                                                                        <Phone className="h-3.5 w-3.5 text-psi-primary" />
                                                                    </div>
                                                                    <InputMask
                                                                        value={client.phone}
                                                                        mask="(00) 00000-0000"
                                                                        disabled
                                                                        className="border-0 p-0 h-auto text-sm text-psi-dark cursor-default"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <Badge variant="default" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20 font-medium px-3 py-1.5">
                                                            {client.totalPayments} {client.totalPayments === 1 ? "pagamento" : "pagamentos"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(client.id)}
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-psi-primary hover:text-psi-primary/80 transition-all hover:gap-3 px-3 py-1.5 rounded-lg hover:bg-psi-primary/5"
                                                        >
                                                            Ver detalhes
                                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openRows[client.id] ? "rotate-180" : ""}`} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                                {openRows[client.id] && (
                                                    <TableRow className="border-0">
                                                        <TableCell colSpan={4} className="p-0">
                                                            <div className="bg-gradient-to-br from-psi-dark/2 to-psi-dark/5 px-8 py-8 space-y-8 border-t border-psi-dark/10">
                                                                <div className="grid gap-6
                                                                md:grid-cols-2
                                                                ">
                                                                    {client.birth && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Calendar className="h-4 w-4 text-psi-primary" />
                                                                                Data de nascimento
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark">
                                                                                {client.birth}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {client.address && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm
                                                                        md:col-span-2
                                                                        lg:col-span-1">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <MapPin className="h-4 w-4 text-psi-primary" />
                                                                                Endereço
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark leading-relaxed">
                                                                                {formatAddress(client.address)}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {client.events.length > 0 && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                                                <Ticket className="h-5 w-5 text-psi-primary" />
                                                                            </div>
                                                                            <div>
                                                                                <h3 className="text-base font-medium text-psi-dark">
                                                                                    Eventos adquiridos
                                                                                </h3>
                                                                                <p className="text-xs text-psi-dark/50">
                                                                                    {client.events.length} {client.events.length === 1 ? "compra realizada" : "compras realizadas"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="grid gap-3
                                                                        md:grid-cols-2">
                                                                            {client.events.map((event: TClientEvent) => (
                                                                                <div
                                                                                    key={event.id}
                                                                                    className="rounded-2xl border border-psi-dark/10 bg-white p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow group"
                                                                                >
                                                                                    <div className="flex items-start justify-between gap-4">
                                                                                        <div className="flex-1 space-y-2 min-w-0">
                                                                                            <p className="font-medium text-psi-dark text-base group-hover:text-psi-primary transition-colors">
                                                                                                {event.eventName}
                                                                                            </p>
                                                                                            <div className="flex items-center gap-2 text-xs text-psi-dark/50">
                                                                                                <Calendar className="h-3 w-3" />
                                                                                                <span>Comprado em {formatDateTime(event.paymentDate)}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center justify-between pt-2 border-t border-psi-dark/5">
                                                                                        <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20 font-medium">
                                                                                            {event.ticketsCount} {event.ticketsCount === 1 ? "ingresso" : "ingressos"}
                                                                                        </Badge>
                                                                                        <p className="text-base font-semibold text-psi-primary">
                                                                                            {ValueUtils.centsToCurrency(event.paymentValue)}
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

                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </section>
        </Background>
    )
}

export {
    ClientsPannel
}