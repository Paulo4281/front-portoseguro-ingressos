"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MessageSquare, Send, FileText, CheckCircle2, Clock, Image as ImageIcon } from "lucide-react"
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
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useSupportCreate } from "@/hooks/Support/useSupportCreate"
import { useSupportFind } from "@/hooks/Support/useSupportFind"
import { Toast } from "@/components/Toast/Toast"
import { Skeleton } from "@/components/ui/skeleton"
import { formatEventDate } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import type { TSupportSubject } from "@/types/Support/TSupport"

const SupportCreateValidator = z.object({
    subject: z.enum([
        "ACCOUNT_ISSUES",
        "PAYMENT_ISSUES",
        "EVENT_MANAGEMENT",
        "TICKET_SALES",
        "TECHNICAL_PROBLEMS",
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

type TSupportCreateForm = z.infer<typeof SupportCreateValidator>

const subjectLabels: Record<TSupportSubject, string> = {
    ACCOUNT_ISSUES: "Problemas com a conta",
    PAYMENT_ISSUES: "Problemas com pagamentos",
    EVENT_MANAGEMENT: "Gerenciamento de eventos",
    TICKET_SALES: "Vendas de ingressos",
    TECHNICAL_PROBLEMS: "Problemas técnicos",
    FEATURE_REQUEST: "Solicitação de funcionalidade",
    OTHER: "Outro"
}

const SuportePannel = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const { mutateAsync: createSupport, isPending: isCreating } = useSupportCreate()
    const { data: supportData, isLoading: isLoadingSupport } = useSupportFind()

    const form = useForm<TSupportCreateForm>({
        resolver: zodResolver(SupportCreateValidator),
        defaultValues: {
            subject: undefined,
            description: "",
            image: null
        }
    })

    const descriptionLength = form.watch("description")?.length || 0

    const handleSubmit = async (data: TSupportCreateForm) => {
        try {
            const response = await createSupport({
                subject: data.subject,
                description: data.description,
                image: data.image || null
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
                            sm:text-5xl font-bold text-psi-primary mb-2">
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
                                <h2 className="text-2xl font-bold text-psi-dark">Criar Chamado</h2>
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
                                                onValueChange={field.onChange}
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
                        <SheetTitle className="text-2xl font-bold text-psi-primary">
                            Meus Chamados
                        </SheetTitle>
                        <SheetDescription>
                            Visualize todos os seus chamados e respostas do suporte
                        </SheetDescription>
                    </SheetHeader>

                    <div className="my-6 space-y-4 mx-4">
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
                            supports.map((support) => (
                                <div
                                    key={support.id}
                                    className="rounded-xl border border-psi-primary/20 bg-white p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-psi-dark">
                                                    {subjectLabels[support.subject]}
                                                </h3>
                                                {support.status === "ANSWERED" ? (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Respondido
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Pendente
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-psi-dark/70 mb-2">
                                                {support.description}
                                            </p>
                                            {support.image && (
                                                <div className="mb-2">
                                                    <img
                                                        src={ImageUtils.getSupportImageUrl(support.image)}
                                                        alt="Imagem do chamado"
                                                        className="max-w-full h-auto rounded-lg border border-psi-primary/20"
                                                    />
                                                </div>
                                            )}
                                            {support.answer && (
                                                <div className="mt-3 pt-3 border-t border-psi-primary/10">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm font-semibold text-psi-dark">
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
                            ))
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

export { 
    SuportePannel
}
