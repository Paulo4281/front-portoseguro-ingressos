"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, Mail, Phone, MessageCircle } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ajudaFaqItems, ajudaSupport } from "./ajudaData"

const AjudaInfo = () => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({})

    const toggleItem = (index: number) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    return (
        <Background variant="light">
            <div className="min-h-screen pt-32 pb-16 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                <HelpCircle className="h-10 w-10 text-psi-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl
                        sm:text-5xl font-semibold text-psi-primary">
                            Central de Ajuda
                        </h1>
                        <p className="text-lg
                        sm:text-xl text-psi-dark/70 max-w-2xl mx-auto leading-relaxed">
                            Estamos aqui para ouvir você e resolver o seu problema da melhor forma possível.
                        </p>
                        <div className="rounded-2xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-6 mt-6">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0">
                                    <MessageCircle className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h2 className="text-xl font-semibold text-psi-dark">
                                        Nossa missão é ajudar você
                                    </h2>
                                    <p className="text-psi-dark/70 leading-relaxed">
                                        Sabemos que imprevistos acontecem e dúvidas podem surgir. Por isso, nossa equipe está sempre pronta para atender você com atenção, agilidade e dedicação. Seu problema é nossa prioridade e faremos o possível para resolvê-lo da melhor forma.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl
                            sm:text-3xl font-semibold text-psi-dark mb-2">
                                Perguntas Frequentes
                            </h2>
                            <p className="text-psi-dark/60">
                                Encontre respostas para as dúvidas mais comuns
                            </p>
                        </div>

                        <div className="space-y-3">
                            {ajudaFaqItems.map((item, index) => {
                                const isOpen = openItems[index] || false
                                
                                return (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-psi-primary/20 bg-white shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(index)}
                                            className="w-full p-4
                                            sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-psi-primary/5 transition-colors"
                                        >
                                            <div className="flex items-start gap-4 flex-1">
                                                {item.icon && (
                                                    <div className="h-10 w-10 rounded-lg bg-psi-primary/10 flex items-center justify-center text-psi-primary shrink-0">
                                                        {item.icon}
                                                    </div>
                                                )}
                                                <h3 className="text-base
                                                sm:text-lg font-medium text-psi-dark flex-1">
                                                    {item.question}
                                                </h3>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    "h-5 w-5 text-psi-primary shrink-0 transition-transform duration-200",
                                                    isOpen && "transform rotate-180"
                                                )}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="px-4
                                            sm:px-6 pb-4
                                            sm:pb-6 pt-0">
                                                <div className="pl-14
                                                sm:pl-16">
                                                    <div className="pt-4 border-t border-psi-primary/10">
                                                        <p className="text-sm
                                                        sm:text-base text-psi-dark/70 leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-6
                    sm:p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                    <MessageCircle className="h-8 w-8 text-psi-primary" />
                                </div>
                            </div>
                            <h2 className="text-2xl
                            sm:text-3xl font-semibold text-psi-dark">
                                Não encontrou sua resposta?
                            </h2>
                            <p className="text-psi-dark/70 max-w-xl mx-auto">
                                Nossa equipe está pronta para ajudar você. Entre em contato através dos canais abaixo:
                            </p>
                        </div>

                        <div className="grid gap-4
                        sm:grid-cols-2 mx-auto">
                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-psi-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-psi-dark">E-mail</h3>
                                        <p className="text-xs text-psi-dark/60">Resposta em até 24h</p>
                                    </div>
                                </div>
                                <a
                                    href={`mailto:${ajudaSupport.email}`}
                                    className="block text-psi-primary hover:text-psi-primary/80 hover:underline break-all"
                                >
                                    {ajudaSupport.email}
                                </a>
                            </div>

                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                        <Phone className="h-6 w-6 text-psi-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-psi-dark">WhatsApp</h3>
                                        <p className="text-xs text-psi-dark/60">Atendimento rápido</p>
                                    </div>
                                </div>
                                <a
                                    href={ajudaSupport.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-psi-primary hover:text-psi-primary/80 hover:underline"
                                >
                                    {ajudaSupport.whatsappLabel}
                                </a>
                            </div>
                        </div>

                        <div className="rounded-lg border border-psi-primary/10 bg-psi-primary/5 p-4 text-center">
                            <p className="text-sm text-psi-dark/70">
                                <strong className="text-psi-dark">Horário de atendimento:</strong> {ajudaSupport.businessHours}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    AjudaInfo
}
