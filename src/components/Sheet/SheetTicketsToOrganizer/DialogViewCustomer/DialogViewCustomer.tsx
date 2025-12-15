"use client"

import { User, Mail, Phone, FileText, Calendar, MapPin, CreditCard } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { formatEventDate } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import type { TTicketToOrganizer } from "@/types/Ticket/TTicket"

type TDialogViewCustomerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    ticket: TTicketToOrganizer
}

const genderLabels: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Feminino",
    PREFER_NOT_TO_SAY: "Prefere não informar"
}

const DialogViewCustomer = ({
    open,
    onOpenChange,
    ticket
}: TDialogViewCustomerProps) => {
    const customer = ticket.customer

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-psi-primary" />
                        Informações do Cliente
                    </DialogTitle>
                    <DialogDescription>
                        Dados completos do comprador do ingresso
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-4">
                        <h3 className="font-semibold text-psi-dark mb-3">Dados Pessoais</h3>
                        
                        <div className="grid grid-cols-1
                        sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-psi-dark/60 mb-1">Nome completo</p>
                                    <p className="text-sm font-medium text-psi-dark">{customer.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-psi-dark/60 mb-1">E-mail</p>
                                    <p className="text-sm font-medium text-psi-dark break-all">{customer.email}</p>
                                </div>
                            </div>

                            {customer.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-psi-dark/60 mb-1">Telefone</p>
                                        <p className="text-sm font-medium text-psi-dark">
                                            {customer.phone
                                                .replace(/\D/g, "")
                                                .replace(
                                                    /^(\d{2})(\d{4,5})(\d{4})$/,
                                                    "($1) $2-$3"
                                                )
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {customer.document && (
                                <div className="flex items-start gap-3">
                                    <FileText className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-psi-dark/60 mb-1">CPF/CNPJ</p>
                                        <p className="text-sm font-medium text-psi-dark">
                                            {(() => {
                                                const numericDoc = customer.document.replace(/\D/g, "")
                                                if (numericDoc.length === 11) {
                                                    // CPF Mask
                                                    return numericDoc.replace(
                                                        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                                                        "$1.$2.$3-$4"
                                                    )
                                                }
                                                if (numericDoc.length === 14) {
                                                    // CNPJ Mask
                                                    return numericDoc.replace(
                                                        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                                                        "$1.$2.$3/$4-$5"
                                                    )
                                                }
                                                return customer.document
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {customer.birth && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-psi-dark/60 mb-1">Data de nascimento</p>
                                        <p className="text-sm font-medium text-psi-dark">
                                            {formatEventDate(customer.birth, "DD/MM/YYYY")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {customer.gender && (
                                <div className="flex items-start gap-3">
                                    <User className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-psi-dark/60 mb-1">Gênero</p>
                                        <p className="text-sm font-medium text-psi-dark">
                                            {genderLabels[customer.gender] || customer.gender}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {customer.nationality && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-psi-dark/60 mb-1">Nacionalidade</p>
                                        <p className="text-sm font-medium text-psi-dark">{customer.nationality}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-4">
                        <h3 className="font-semibold text-psi-dark mb-3">Informações do Ingresso</h3>
                        
                        <div className="grid grid-cols-1
                        sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <CreditCard className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-psi-dark/60 mb-1">Tipo de ingresso</p>
                                    <p className="text-sm font-medium text-psi-dark">{ticket.ticketType.name}</p>
                                    {ticket.ticketType.description && (
                                        <p className="text-xs text-psi-dark/50 mt-1">{ticket.ticketType.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CreditCard className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-psi-dark/60 mb-1">Valor pago</p>
                                    <p className="text-sm font-medium text-psi-primary">
                                        {ValueUtils.centsToCurrency(ticket.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Calendar className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-psi-dark/60 mb-1">Data da compra</p>
                                    <p className="text-sm font-medium text-psi-dark">
                                        {formatEventDate(ticket.createdAt, "DD/MM/YYYY [às] HH:mm")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {ticket.form && (
                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-4">
                            <h3 className="font-semibold text-psi-dark mb-3">Respostas do Formulário</h3>
                            
                            <div className="space-y-3">
                                {ticket.form.text && ticket.form.text.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-psi-dark/70 mb-2">Campos de texto</p>
                                        <div className="space-y-2">
                                            {ticket.form.text.map((field, index) => (
                                                <div key={index} className="bg-white rounded-lg p-3 border border-psi-primary/10">
                                                    <p className="text-xs text-psi-dark/60 mb-1">{field.label}</p>
                                                    <p className="text-sm text-psi-dark">{field.answer || "Não informado"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {ticket.form.email && ticket.form.email.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-psi-dark/70 mb-2">E-mails</p>
                                        <div className="space-y-2">
                                            {ticket.form.email.map((field, index) => (
                                                <div key={index} className="bg-white rounded-lg p-3 border border-psi-primary/10">
                                                    <p className="text-xs text-psi-dark/60 mb-1">{field.label}</p>
                                                    <p className="text-sm text-psi-dark">{field.answer || "Não informado"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {ticket.form.textArea && ticket.form.textArea.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-psi-dark/70 mb-2">Textos longos</p>
                                        <div className="space-y-2">
                                            {ticket.form.textArea.map((field, index) => (
                                                <div key={index} className="bg-white rounded-lg p-3 border border-psi-primary/10">
                                                    <p className="text-xs text-psi-dark/60 mb-1">{field.label}</p>
                                                    <p className="text-sm text-psi-dark whitespace-pre-wrap">{field.answer || "Não informado"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {ticket.form.select && ticket.form.select.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-psi-dark/70 mb-2">Seleções</p>
                                        <div className="space-y-2">
                                            {ticket.form.select.map((field, index) => (
                                                <div key={index} className="bg-white rounded-lg p-3 border border-psi-primary/10">
                                                    <p className="text-xs text-psi-dark/60 mb-1">{field.label}</p>
                                                    <p className="text-sm text-psi-dark">{field.answer || "Não informado"}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogViewCustomer
}

