"use client"

import { useState, useMemo } from "react"
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MessageSquare, Send, FileText, CheckCircle2, Clock, Image as ImageIcon, XCircle, AlertCircle, Info } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { FieldError } from "@/components/FieldError/FieldError"
import { ImageUpload } from "@/components/ImageUpload/ImageUpload"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useSupportCreate } from "@/hooks/Support/useSupportCreate"
import { useSupportFind } from "@/hooks/Support/useSupportFind"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { Toast } from "@/components/Toast/Toast"
import { Skeleton } from "@/components/ui/skeleton"
import { formatEventDate } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TSupportSubject, TSupport, TSupportStatus } from "@/types/Support/TSupport"
import type { TEvent } from "@/types/Event/TEvent"
import { useEventFindById } from "@/hooks/Event/useEventFindById"
import Link from "next/link"

const baseSupportCreateValidator = z.object({
    subject: z.enum([
        "ACCOUNT_ISSUES",
        "PAYMENT_ISSUES",
        "EVENT_MANAGEMENT",
        "EVENT_POSTPONEMENT",
        "EVENT_CANCELLATION",
        "TICKET_SALES",
        "TECHNICAL_ISSUES",
        "FEATURE_REQUEST",
        "OTHER"
    ], {
        error: "Selecione um assunto"
    }),
    description: z.string()
        .min(10, { error: "A descrição deve ter pelo menos 10 caracteres" })
        .max(1000, { error: "A descrição deve ter no máximo 1000 caracteres" }),
    image: z.custom<File | null>().optional()
})

type TSupportCreateFormBase = z.infer<typeof baseSupportCreateValidator>

type TAdditionalFieldConfig = {
    fieldName: string
    label: string
    type: "select" | "input" | "textarea"
    required?: boolean
    options?: { value: string; label: string }[]
    placeholder?: string
    getOptions?: () => { value: string; label: string }[]
    infoMessages?: string[]
    warningMessages?: string[]
}

type TSubjectAdditionalFields = {
    [key in TSupportSubject]?: {
        fields: TAdditionalFieldConfig[]
        descriptionInfo?: string[]
        descriptionWarning?: string[]
    }
}

const getSubjectAdditionalFieldsConfig = (events: { value: string; label: string }[]): TSubjectAdditionalFields => ({
    EVENT_POSTPONEMENT: {
        fields: [
            {
                fieldName: "eventId",
                label: "Selecione um evento *",
                type: "select",
                required: true,
                getOptions: () => events
            }
        ],
        descriptionInfo: [
            "Por favor, descreva no campo 'Descrição *' qual dia do evento você deseja alterar, para qual nova data e horário, e todos os detalhes necessários para o adiamento."
        ],
        descriptionWarning: [
            "Importante: Caso o adiamento seja aprovado, os compradores poderão solicitar reembolso dos ingressos adquiridos."
        ]
    },
    EVENT_CANCELLATION: {
        fields: [
            {
                fieldName: "eventId",
                label: "Selecione um evento *",
                type: "select",
                required: true,
                getOptions: () => events
            }
        ],
        descriptionInfo: [
            "Por favor, descreva no campo 'Descrição *' por qual motivo você deseja cancelar o evento."
        ],
        descriptionWarning: [
            "Importante: Caso o cancelamento seja aprovado, os compradores receberão o reembolso automático dos ingressos adquiridos."
        ]
    }
})

    const getSupportCreateValidator = (subject?: TSupportSubject, config?: TSubjectAdditionalFields): z.ZodObject<any> => {
    if (!subject || !config || !config[subject as keyof typeof config]) {
        return baseSupportCreateValidator
    }

    const subjectConfig = config[subject as keyof typeof config]
    let validator: z.ZodObject<any> = baseSupportCreateValidator

    if (subjectConfig?.fields) {
        const additionalFields: Record<string, z.ZodTypeAny> = {}
        
        subjectConfig.fields.forEach((field: TAdditionalFieldConfig) => {
            if (field.type === "select") {
                additionalFields[field.fieldName] = field.required
                    ? z.string().min(1, { error: `${field.label} é obrigatório` })
                    : z.string().optional()
            } else if (field.type === "input") {
                additionalFields[field.fieldName] = field.required
                    ? z.string().min(1, { error: `${field.label} é obrigatório` })
                    : z.string().optional()
            } else if (field.type === "textarea") {
                additionalFields[field.fieldName] = field.required
                    ? z.string().min(1, { error: `${field.label} é obrigatório` })
                    : z.string().optional()
            }
        })

        validator = baseSupportCreateValidator.extend(additionalFields) as z.ZodObject<any>
    }

    return validator
}

type TSupportCreateForm = TSupportCreateFormBase & {
    eventId?: string
}

const subjectLabels: Record<TSupportSubject, string> = {
    ACCOUNT_ISSUES: "Problemas com a conta",
    PAYMENT_ISSUES: "Problemas com pagamentos",
    EVENT_MANAGEMENT: "Gerenciamento de eventos",
    EVENT_POSTPONEMENT: "Postergação de eventos",
    EVENT_CANCELLATION: "Cancelamento de eventos",
    TICKET_SALES: "Vendas de ingressos",
    TECHNICAL_ISSUES: "Problemas técnicos",
    FEATURE_REQUEST: "Solicitação de funcionalidade",
    OTHER: "Outro"
}

const SuportePannel = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<TSupportStatus | "all">("all")
    const [offset, setOffset] = useState(0)
    const limit = 30
    const { mutateAsync: createSupport, isPending: isCreating } = useSupportCreate()
    const { data: supportData, isLoading: isLoadingSupport } = useSupportFind({
        offset,
        status: statusFilter !== "all" ? statusFilter : undefined
    })
    const { data: eventsData, isLoading: isLoadingEvents } = useEventCache()

    const [selectedSubject, setSelectedSubject] = useState<TSupportSubject | undefined>(undefined)
    
    const events = useMemo(() => {
        if (!eventsData?.data || !Array.isArray(eventsData.data)) return []
        return eventsData.data.map((event: { id: string; name: string }) => ({
            value: event.id,
            label: event.name
        }))
    }, [eventsData])

    const subjectAdditionalFieldsConfig = useMemo(() => getSubjectAdditionalFieldsConfig(events), [events])
    const currentValidator = useMemo(() => getSupportCreateValidator(selectedSubject, subjectAdditionalFieldsConfig), [selectedSubject, subjectAdditionalFieldsConfig])
    
    const form = useForm<TSupportCreateForm>({
        resolver: zodResolver(currentValidator as any),
        defaultValues: {
            subject: undefined,
            description: "",
            image: null,
            eventId: undefined
        }
    })

    const watchedSubject = form.watch("subject")
    
    React.useEffect(() => {
        if (watchedSubject && watchedSubject !== selectedSubject) {
            setSelectedSubject(watchedSubject)
        }
    }, [watchedSubject, selectedSubject])

    const currentSubjectConfig = useMemo(() => {
        if (!selectedSubject) return null
        return subjectAdditionalFieldsConfig[selectedSubject as keyof typeof subjectAdditionalFieldsConfig]
    }, [selectedSubject, subjectAdditionalFieldsConfig])

    const descriptionLength = form.watch("description")?.length || 0

    const handleSubjectChange = (subject: TSupportSubject) => {
        form.setValue("subject", subject)
        if (currentSubjectConfig) {
            currentSubjectConfig.fields.forEach(field => {
                form.setValue(field.fieldName as any, undefined)
            })
        }
    }

    const handleSubmit = async (data: TSupportCreateForm) => {
        try {
            const additionalInfo: Record<string, any> = {}
            
            if (currentSubjectConfig?.fields) {
                currentSubjectConfig.fields.forEach((field: TAdditionalFieldConfig) => {
                    const value = data[field.fieldName as keyof TSupportCreateForm]
                    if (value !== undefined && value !== null && value !== "") {
                        additionalInfo[field.fieldName] = value
                    }
                })
            }

            const response = await createSupport({
                subject: data.subject,
                description: data.description,
                image: data.image || null,
                additionalInfo: Object.keys(additionalInfo).length > 0 ? additionalInfo : undefined
            })

            if (response?.success) {
                Toast.success("Chamado criado com sucesso! Nossa equipe entrará em contato em breve.")
                form.reset()
            }
        } catch (error) {
            console.error("Erro ao criar chamado:", error)
        }
    }

    const supports = supportData?.data?.data || []
    const total = supportData?.data?.total || 0
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0
    const currentPage = Math.floor(offset / limit) + 1

    const parseAdditionalInfo = (additionalInfo: any): Record<string, any> | null => {
        if (!additionalInfo) return null
        try {
            if (typeof additionalInfo === "string") {
                return JSON.parse(additionalInfo)
            }
            return additionalInfo
        } catch {
            return null
        }
    }

    return (
        <>
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[100px]
                sm:py-12">
                    <div className="max-w-3xl mx-auto px-4
                    sm:px-6
                    lg:px-8">
                        <div className="mb-8">
                            <h1 className="text-4xl
                            sm:text-5xl font-semibold text-psi-primary mb-2">
                                Suporte
                            </h1>
                            <p className="text-base
                            sm:text-lg text-psi-dark/60">
                                Entre em contato com nossa equipe de suporte
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MessageSquare className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-semibold text-psi-dark">Criar Chamado</h2>
                            </div>

                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Assunto *
                                    </label>
                                    <Controller
                                        name="subject"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    handleSubjectChange(value as TSupportSubject)
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o assunto..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(subjectLabels).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.subject?.message || ""} />
                                </div>

                                {currentSubjectConfig?.fields && currentSubjectConfig.fields.map((field: TAdditionalFieldConfig) => {
                                    const fieldOptions = field.getOptions ? field.getOptions() : (field.options || [])
                                    const isEventSelect = field.fieldName === "eventId"
                                    const options = isEventSelect ? events : fieldOptions

                                    return (
                                        <div key={field.fieldName}>
                                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                {field.label}
                                            </label>
                                            {field.type === "select" ? (
                                                <>
                                                    <Controller
                                                        name={field.fieldName as any}
                                                        control={form.control}
                                                        render={({ field: formField }) => (
                                                            <Select
                                                                value={formField.value || ""}
                                                                onValueChange={formField.onChange}
                                                                disabled={isEventSelect && isLoadingEvents}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder={field.placeholder || `Selecione ${field.label.toLowerCase()}...`} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {options.map((option: { value: string; label: string }) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                    <FieldError message={form.formState.errors[field.fieldName as keyof typeof form.formState.errors]?.message as string || ""} />
                                                </>
                                            ) : field.type === "input" ? (
                                                <>
                                                    <Controller
                                                        name={field.fieldName as any}
                                                        control={form.control}
                                                        render={({ field: formField }) => (
                                                            <Input
                                                                {...formField}
                                                                placeholder={field.placeholder}
                                                                required={field.required}
                                                            />
                                                        )}
                                                    />
                                                    <FieldError message={form.formState.errors[field.fieldName as keyof typeof form.formState.errors]?.message as string || ""} />
                                                </>
                                            ) : (
                                                <>
                                                    <Controller
                                                        name={field.fieldName as any}
                                                        control={form.control}
                                                        render={({ field: formField }) => (
                                                            <textarea
                                                                {...formField}
                                                                placeholder={field.placeholder}
                                                                className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-psi-primary/20 bg-white text-psi-dark placeholder:text-psi-dark/40 focus:outline-none focus:ring-2 focus:ring-psi-primary/50 focus:border-psi-primary/50 resize-none"
                                                                required={field.required}
                                                            />
                                                        )}
                                                    />
                                                    <FieldError message={form.formState.errors[field.fieldName as keyof typeof form.formState.errors]?.message as string || ""} />
                                                </>
                                            )}
                                        </div>
                                    )
                                })}

                                {currentSubjectConfig?.descriptionInfo && currentSubjectConfig.descriptionInfo.length > 0 && (
                                    <Alert variant="info" className="flex items-start gap-3">
                                        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                        <AlertDescription variant="info">
                                            {currentSubjectConfig.descriptionInfo.map((msg: string, index: number) => (
                                                <p key={index} className={index > 0 ? "mt-2" : ""}>{msg}</p>
                                            ))}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {currentSubjectConfig?.descriptionWarning && currentSubjectConfig.descriptionWarning.length > 0 && (
                                    <Alert variant="warning" className="flex items-start gap-3">
                                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                        <AlertDescription variant="warning">
                                            {currentSubjectConfig.descriptionWarning.map((msg: string, index: number) => (
                                                <p key={index} className={index > 0 ? "mt-2" : ""}>{msg}</p>
                                            ))}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-psi-dark/70">
                                            Descrição *
                                        </label>
                                        <span className="text-xs text-psi-dark/60">
                                            {descriptionLength}/1000
                                        </span>
                                    </div>
                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                placeholder="Descreva seu problema ou solicitação..."
                                                className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-psi-primary/20 bg-white text-psi-dark placeholder:text-psi-dark/40 focus:outline-none focus:ring-2 focus:ring-psi-primary/50 focus:border-psi-primary/50 resize-none"
                                                maxLength={1000}
                                                required
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.description?.message || ""} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Foto (Opcional)
                                    </label>
                                    <Controller
                                        name="image"
                                        control={form.control}
                                        render={({ field }) => (
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={form.formState.errors.image?.message}
                                                variant="default"
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.image?.message || ""} />
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsSheetOpen(true)}
                                    >
                                        <FileText className="h-4 w-4" />
                                        Ver chamados
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isCreating}
                                        className="flex-1"
                                    >
                                        {isCreating ? (
                                            <LoadingButton message="Enviando..." />
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Enviar chamado
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Background>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent 
                    side="right" 
                    className="w-[90vw] sm:w-[90vw] overflow-y-auto"
                >
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-semibold text-psi-primary">
                            Meus Chamados
                        </SheetTitle>
                        <SheetDescription>
                            Visualize todos os seus chamados e respostas do suporte
                        </SheetDescription>
                    </SheetHeader>

                    <div className="my-6 space-y-4 mx-4">
                        <div className="flex items-center gap-3">
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value as TSupportStatus | "all")
                                    setOffset(0)
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="PENDING">Pendente</SelectItem>
                                    <SelectItem value="NOT_SOLVED">Não Resolvido</SelectItem>
                                    <SelectItem value="SOLVED">Resolvido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {isLoadingSupport ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                        ) : supports.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare className="h-12 w-12 text-psi-dark/30 mx-auto mb-4" />
                                <p className="text-psi-dark/60">Nenhum chamado encontrado</p>
                            </div>
                        ) : (
                            <>
                                {supports.map((support: TSupport) => {
                                    const additionalInfo = parseAdditionalInfo(support.additionalInfo)
                                    const eventId = additionalInfo?.eventId

                                    return (
                                        <SupportCard
                                            key={support.id}
                                            support={support}
                                            additionalInfo={additionalInfo}
                                            eventId={eventId}
                                        />
                                    )
                                })}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-4 border-t border-psi-primary/10">
                                        <p className="text-sm text-psi-dark/70">
                                            Mostrando {offset + 1} a {Math.min(offset + limit, total)} de {total} chamados
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setOffset(Math.max(0, offset - limit))}
                                                disabled={offset === 0}
                                            >
                                                Anterior
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setOffset(Math.min((totalPages - 1) * limit, offset + limit))}
                                                disabled={currentPage >= totalPages}
                                            >
                                                Próxima
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

type TSupportCardProps = {
    support: TSupport
    additionalInfo: Record<string, any> | null
    eventId?: string
}

const SupportCard = ({ support, additionalInfo, eventId }: TSupportCardProps) => {
    const { data: eventData } = useEventFindById(eventId || "temp")

    return (
        <div className="rounded-xl border border-psi-primary/20 bg-white p-4 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-psi-dark">
                            {subjectLabels[support.subject]}
                        </h3>
                        {support.status === "SOLVED" ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Resolvido
                            </span>
                        ) : support.status === "NOT_SOLVED" ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Não Resolvido
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Pendente
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-psi-dark/70 mb-2">
                        {support.description}
                    </p>
                    {additionalInfo && Object.keys(additionalInfo).length > 0 && (
                        <div className="mb-2 p-3 rounded-lg border border-psi-primary/20 bg-psi-primary/5">
                            <h4 className="text-xs font-medium text-psi-dark mb-2">Informações Adicionais</h4>
                            <div className="space-y-1">
                                {eventId && eventId !== "temp" && (
                                    <div className="text-xs text-psi-dark/70">
                                        <span className="font-medium">Evento: </span>
                                        {eventData?.data ? (
                                            <Link 
                                                href={`/ver-evento/${eventData.data.slug}`}
                                                target="_blank"
                                                className="text-psi-primary hover:underline"
                                            >
                                                {eventData.data.name}
                                            </Link>
                                        ) : (
                                            <span className="text-psi-dark/50">Carregando...</span>
                                        )}
                                    </div>
                                )}
                                {Object.entries(additionalInfo).map(([key, value]) => {
                                    if (key === "eventId") return null
                                    return (
                                        <div key={key} className="text-xs text-psi-dark/70">
                                            <span className="font-medium">{key}: </span>
                                            <span>{String(value)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {support.image && (
                        <div className="mb-2">
                            <img
                                src={ImageUtils.getSupportImageUrl(support.image)}
                                alt="Imagem do chamado"
                                className="max-w-full h-60 rounded-lg border border-psi-primary/20"
                            />
                        </div>
                    )}
                    {support.answer && (
                        <div className="mt-3 pt-3 border-t border-psi-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-psi-dark">
                                    Resposta do Suporte
                                </span>
                            </div>
                            <p className="text-sm text-psi-dark/70">
                                {support.answer}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-xs text-psi-dark/50">
                Criado em {formatEventDate(support.createdAt, "DD [de] MMMM [de] YYYY [às] HH:mm")}
            </div>
        </div>
    )
}

export { 
    SuportePannel
}
