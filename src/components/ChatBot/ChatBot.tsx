/* eslint-disable react/no-unescaped-entities */
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { cn } from "@/lib/utils"
import { ajudaFaqItems, ajudaSupport } from "@/components/Pages/Public/Ajuda/ajudaData"
import { useLeadCreate } from "@/hooks/Lead/useLeadCreate"
import { Toast } from "@/components/Toast/Toast"
import { BotMessageSquare, ChevronRight, HelpCircle, Loader2, MessageCircle, Send, X } from "lucide-react"

type TStep = "collect" | "faq" | "support"

const STORAGE_KEY = "psi_chatbot_lead_v1"

type TStoredLead = {
    name: string
    phone: string
}

const sanitizeDigits = (value: string) => value.replace(/\D/g, "")

const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Bom dia"
    if (hour >= 12 && hour < 18) return "Boa tarde"
    return "Boa noite"
}

const pickVariant = (base: string) => {
    const variants = [
        `${base}! Para começar a te ajudar, digite seu nome e seu número de WhatsApp.`,
        `${base}! Me diga seu nome e seu WhatsApp para eu te ajudar rapidinho.`,
        `${base}! Vamos resolver isso juntos: informe seu nome e seu WhatsApp.`,
    ]
    return variants[Math.floor(Math.random() * variants.length)]
}

const ChatBot = () => {
    const { mutateAsync: createLead, isPending: isCreatingLead } = useLeadCreate()

    const [isOpen, setIsOpen] = useState(false)

    const [step, setStep] = useState<TStep>("collect")
    const [lead, setLead] = useState<TStoredLead | null>(null)
    const [name, setName] = useState("")
    const [phoneMasked, setPhoneMasked] = useState("")

    const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({})
    const [selectedFaqIds, setSelectedFaqIds] = useState<Record<string, boolean>>({})

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return
            const parsed = JSON.parse(raw) as TStoredLead
            if (parsed?.name && parsed?.phone) {
                setLead(parsed)
                setStep("faq")
                setName(parsed.name)
                setPhoneMasked(parsed.phone)
            }
        } catch {
            // ignore
        }
    }, [])

    const greetingMessage = useMemo(() => {
        return pickVariant(getTimeGreeting())
    }, [])

    const phoneDigits = useMemo(() => sanitizeDigits(phoneMasked), [phoneMasked])
    const isPhoneValid = useMemo(() => phoneDigits.length === 10 || phoneDigits.length === 11, [phoneDigits.length])
    const isNameValid = useMemo(() => name.trim().length >= 2, [name])
    const canSubmitLead = useMemo(() => isNameValid && isPhoneValid && !isCreatingLead, [isNameValid, isPhoneValid, isCreatingLead])

    const handleSubmitLead = useCallback(async () => {
        if (lead) {
            setStep("faq")
            return
        }
        if (!canSubmitLead) return

        try {
            const payload = {
                name: name.trim(),
                phone: phoneDigits
            }
            const res = await createLead(payload)
            if (res?.success) {
                const stored: TStoredLead = { name: payload.name, phone: phoneMasked }
                setLead(stored)
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
                } catch {
                    // ignore
                }
                setStep("faq")
            } else {
                Toast.error(res?.message ?? "Não foi possível salvar seu contato.")
            }
        } catch (err: any) {
            Toast.error(err?.response?.data?.message ?? "Não foi possível salvar seu contato.")
        }
    }, [lead, canSubmitLead, createLead, name, phoneDigits, phoneMasked])

    const handleToggleFaq = useCallback((id: string) => {
        setOpenFaq((prev) => ({ ...prev, [id]: !prev[id] }))
        setSelectedFaqIds((prev) => ({ ...prev, [id]: true }))
    }, [])

    const hasSelectedAnyFaq = useMemo(() => {
        return Object.values(selectedFaqIds).some(Boolean)
    }, [selectedFaqIds])

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-60">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "size-14 rounded-full shadow-lg",
                        "bg-psi-primary text-white hover:bg-psi-primary/90",
                        "flex items-center justify-center",
                        "transition-colors"
                    )}
                    aria-label="Abrir chat"
                >
                    <BotMessageSquare className="h-6 w-6" />
                </button>
            </div>
        )
    }

    return (
        <div
            className="fixed bottom-6 right-6 z-60"
            style={{ width: 380, maxWidth: "calc(100vw - 24px)" }}
        >
            <div className="rounded-2xl border border-[#E4E6F0] bg-white shadow-xl overflow-hidden">
                <div
                    className={cn(
                        "flex items-center justify-between gap-3 px-4 py-3 bg-linear-to-r from-psi-primary/10 via-white to-psi-primary/10",
                        "select-none"
                    )}
                >
                    <div className="flex items-center justify-center gap-2 min-w-0">
                        <div className="size-9 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0">
                            <MessageCircle className="h-5 w-5 text-psi-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-psi-dark truncate">
                                Assistente Porto Seguro Ingressos
                            </p>
                            <p className="text-xs text-psi-dark/60 truncate">
                                Clique para minimizar
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                            }}
                            aria-label="Minimizar"
                        >
                            <BotMessageSquare className="h-6 w-6" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                            }}
                            aria-label="Fechar"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto max-h-[min(70vh,480px)] space-y-4">
                    {step === "collect" && (
                        <>
                            <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-2">
                                <p className="text-sm text-psi-dark font-medium">{greetingMessage}</p>
                                <p className="text-xs text-psi-dark/70">
                                    Eu também posso ajudar com compra de ingressos, pagamento, QR Code, reembolso e muito mais.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-psi-dark/70">Seu nome</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex.: Maria Silva"
                                        disabled={isCreatingLead}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-psi-dark/70">Seu WhatsApp</label>
                                    <InputMask
                                        value={phoneMasked}
                                        onAccept={(v) => setPhoneMasked(String(v))}
                                        placeholder="(00) 00000-0000"
                                        inputMode="numeric"
                                        disabled={isCreatingLead}
                                        mask={[
                                            { mask: "(00) 0000-0000" },
                                            { mask: "(00) 00000-0000" }
                                        ]}
                                        dispatch={(appended: string, dynamicMasked: any) => {
                                            const number = sanitizeDigits(dynamicMasked.value + appended)
                                            return dynamicMasked.compiledMasks[number.length > 10 ? 1 : 0]
                                        }}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    className="w-full"
                                    disabled={!canSubmitLead}
                                    onClick={handleSubmitLead}
                                >
                                    {isCreatingLead ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    Continuar
                                </Button>
                            </div>
                        </>
                    )}

                    {step === "faq" && (
                        <>
                            <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-1">
                                <p className="text-sm font-medium text-psi-dark">
                                    {lead ? `Perfeito, ${lead.name.split(" ")[0]}!` : "Perfeito!"} Como posso te ajudar?
                                </p>
                                <p className="text-xs text-psi-dark/60">
                                    Escolha uma ou mais perguntas abaixo.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {ajudaFaqItems.map((item) => {
                                    const isOpen = openFaq[item.id] || false
                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-psi-primary/20 bg-white shadow-sm"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleToggleFaq(item.id)}
                                                className="w-full p-3 flex items-start gap-3 text-left hover:bg-psi-primary/5 transition-colors"
                                            >
                                                <div className="size-9 rounded-lg bg-psi-primary/10 text-psi-primary flex items-center justify-center shrink-0 mt-0.5">
                                                    {item.icon ?? <HelpCircle className="h-5 w-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-psi-dark">
                                                        {item.question}
                                                    </p>
                                                    <p className="text-xs text-psi-dark/60">
                                                        Clique para ver a resposta
                                                    </p>
                                                </div>
                                                <ChevronRight className={cn("h-4 w-4 text-psi-primary mt-1 transition-transform", isOpen && "rotate-90")} />
                                            </button>
                                            {isOpen && (
                                                <div className="px-3 pb-3">
                                                    <div className="rounded-lg border border-psi-primary/10 bg-psi-primary/5 p-3">
                                                        <p className="text-xs text-psi-dark/80 leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {hasSelectedAnyFaq && (
                                <div className="pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setStep("support")}
                                    >
                                        Ainda não solucionei meu problema
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {step === "support" && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-1">
                                <p className="text-sm font-medium text-psi-dark">
                                    Sem problemas — nossa equipe pode te ajudar.
                                </p>
                                <p className="text-xs text-psi-dark/70">
                                    Entre em contato por um dos canais abaixo.
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-2">
                                <p className="text-xs text-psi-dark/60">E-mail</p>
                                <a
                                    href={`mailto:${ajudaSupport.email}`}
                                    className="text-sm text-psi-primary hover:text-psi-primary/80 hover:underline break-all"
                                >
                                    {ajudaSupport.email}
                                </a>
                            </div>

                            <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-2">
                                <p className="text-xs text-psi-dark/60">WhatsApp</p>
                                <a
                                    href={ajudaSupport.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-psi-primary hover:text-psi-primary/80 hover:underline"
                                >
                                    {ajudaSupport.whatsappLabel}
                                </a>
                            </div>

                            <div className="rounded-lg border border-psi-primary/10 bg-psi-primary/5 p-3 text-center">
                                <p className="text-xs text-psi-dark/70">
                                    <span className="font-medium text-psi-dark">Horário de atendimento:</span> {ajudaSupport.businessHours}
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => setStep("faq")}
                            >
                                Voltar para as perguntas
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export { ChatBot }