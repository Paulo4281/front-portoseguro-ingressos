"use client"

import { useState, useMemo } from "react"
import React from "react"
import {
    Users,
    Search,
    Filter,
    Tag,
    Plus,
    Edit,
    Trash2,
    Mail,
    Download,
    FileText,
    Calendar,
    Phone,
    MapPin,
    ChevronDown,
    ChevronUp,
    X,
    Send,
    FileDown,
    FileSpreadsheet,
    FileJson,
    FileType,
    Sparkles,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    History,
    Crown,
    BarChart3,
    Eye,
    EyeOff,
    Bell,
    Gift,
    Heart,
    CheckCircle,
    ThumbsUp,
    TrendingUp,
    Star,
    Award
} from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/Pagination/Pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/Card/Card"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { MoreVertical } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTagFind } from "@/hooks/Tag/useTagFind"
import { useTagCreate } from "@/hooks/Tag/useTagCreate"
import { useTagUpdate } from "@/hooks/Tag/useTagUpdate"
import { useTagDelete } from "@/hooks/Tag/useTagDelete"
import { useTagClientCreate } from "@/hooks/TagClient/useTagClientCreate"
import { useTagClientDelete } from "@/hooks/TagClient/useTagClientDelete"
import { useObservationCreate } from "@/hooks/Observation/useObservationCreate"
import { useObservationFindByUserId } from "@/hooks/Observation/useObservationFindByUserId"
import { useObservationUpdate } from "@/hooks/Observation/useObservationUpdate"
import { useObservationDelete } from "@/hooks/Observation/useObservationDelete"
import type { TTagResponse } from "@/types/Tag/TTag"
import type { TObservationResponse } from "@/types/Observation/TObservation"
import { Toast } from "@/components/Toast/Toast"
import { ObservationService } from "@/services/CRM/ObservationService"
import { useOrganizerFindClientsCrm } from "@/hooks/Client/useOrganizerFindClientsCrm"
import type { TCustomer } from "@/types/Client/TClient"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { useCouponFind } from "@/hooks/Coupon/useCouponFind"
import type { TCoupon } from "@/types/Coupon/TCoupon"
import type { ReactNode } from "react"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"



type TEmailTemplate = {
    id: string
    name: string
    subject: string
    body: string
    editableFields: string[]
    preview: string
    icon: ReactNode
    isPremium?: boolean
}

type TEmailSegment = {
    id: string
    name: string
    type: "event" | "tag" | "custom"
    description: string
    count: number
}

type TEmailHistory = {
    id: string
    templateId: string
    templateName: string
    subject: string
    recipientsCount: number
    sentAt: string
    status: "sent" | "failed"
    recipients: Array<{
        id: string
        name: string
        email: string
    }>
}



const getEmailTemplates = (): TEmailTemplate[] => [
    {
        id: "template-lembrete",
        name: "Lembrete de evento",
        subject: "Lembrete: {{evento}} está chegando!",
        body: "Olá {{nome}},\n\nEste é um lembrete de que o evento {{evento}} acontecerá em breve!\n\nData: {{data}}\nLocal: {{local}}\n\nNão perca esta oportunidade!\n\nAguardamos você!",
        editableFields: ["evento"],
        preview: "Envie lembretes para seus clientes sobre eventos próximos",
        icon: <Bell className="h-6 w-6" />
    },
    {
        id: "template-oferta",
        name: "Oferta especial",
        subject: "Oferta especial para você!",
        body: "Olá {{nome}},\n\nTemos uma oferta especial para você!\n\nUse o cupom {{cupomCodigo}} e ganhe {{cupomDesconto}} de desconto!\n\n{{cupomDescricao}}\n\nAproveite esta oportunidade única!",
        editableFields: ["cupom"],
        preview: "Compartilhe ofertas e promoções especiais com cupons de desconto",
        icon: <Gift className="h-6 w-6" />
    },
    {
        id: "template-nutrir",
        name: "Nutrir público",
        subject: "Conheça nossos eventos!",
        body: "Olá {{nome}},\n\nQue tal conhecer nossos eventos incríveis?\n\n{{eventoTexto}}\n\nAcesse nossa plataforma e descubra todas as opções disponíveis!\n\nSiga-nos nas redes sociais para ficar por dentro de todas as novidades.\n\nEsperamos você!",
        editableFields: ["evento"],
        preview: "Convide seu público a conhecer seus eventos e redes sociais",
        icon: <Heart className="h-6 w-6" />
    },
    {
        id: "template-pos-evento",
        name: "Pós-evento",
        subject: "Obrigado por participar!",
        body: "Olá {{nome}},\n\nObrigado por participar do {{evento}}!\n\nEsperamos que tenha se divertido e aproveitado cada momento.\n\nFique atento aos nossos próximos eventos - temos muitas surpresas preparadas para você!\n\nAté breve!",
        editableFields: [],
        preview: "Agradeça seus clientes após o evento e mantenha o relacionamento",
        icon: <CheckCircle className="h-6 w-6" />,
        isPremium: true
    },
    {
        id: "template-pesquisa",
        name: "Pesquisa de satisfação",
        subject: "Sua opinião é importante!",
        body: "Olá {{nome}},\n\nGostaríamos muito de saber sua opinião sobre o evento {{evento}} que você participou.\n\nSua avaliação é fundamental para melhorarmos cada vez mais!\n\nPor favor, responda nossa pesquisa rápida clicando no link abaixo.\n\nObrigado pela sua participação!",
        editableFields: [],
        preview: "Colete feedback dos seus clientes para melhorar seus eventos",
        icon: <ThumbsUp className="h-6 w-6" />,
        isPremium: true
    },
    {
        id: "template-aniversario",
        name: "Aniversário do cliente",
        subject: "Feliz aniversário!",
        body: "Olá {{nome}},\n\nHoje é um dia especial - seu aniversário!\n\nQueremos te parabenizar e oferecer um presente especial: {{cupomDesconto}} de desconto em qualquer um dos nossos eventos!\n\nUse o cupom {{cupomCodigo}} e comemore conosco!\n\nFeliz aniversário e muitas felicidades!",
        editableFields: [],
        preview: "Parabenize clientes no aniversário com ofertas especiais",
        icon: <Star className="h-6 w-6" />,
        isPremium: true
    },
    {
        id: "template-lancamento",
        name: "Lançamento de evento",
        subject: "Novo evento disponível!",
        body: "Olá {{nome}},\n\nTemos uma novidade incrível para você!\n\nAcabamos de lançar um novo evento: {{evento}}\n\nData: {{data}}\nLocal: {{local}}\n\nSeja um dos primeiros a garantir seu ingresso!\n\nNão perca esta oportunidade!",
        editableFields: ["evento"],
        preview: "Anuncie novos eventos para seus clientes",
        icon: <TrendingUp className="h-6 w-6" />,
        isPremium: true
    },
    {
        id: "template-fidelidade",
        name: "Programa de fidelidade",
        subject: "Você é um cliente especial!",
        body: "Olá {{nome}},\n\nQueremos agradecer sua fidelidade!\n\nPor ser um cliente especial, você ganhou {{cupomDesconto}} de desconto em qualquer evento!\n\nUse o cupom {{cupomCodigo}} e aproveite!\n\nObrigado por fazer parte da nossa história!",
        editableFields: [],
        preview: "Recompense clientes fiéis com ofertas exclusivas",
        icon: <Award className="h-6 w-6" />,
        isPremium: true
    }
]

const mockEmailSegments: TEmailSegment[] = [
    {
        id: "segment-1",
        name: "Todos os clientes",
        type: "custom",
        description: "Todos os clientes que já compraram ingressos",
        count: 150
    },
    {
        id: "segment-2",
        name: "Evento: Show de Rock",
        type: "event",
        description: "Clientes que compraram ingressos para o Show de Rock",
        count: 45
    },
    {
        id: "segment-3",
        name: "Tag: VIP",
        type: "tag",
        description: "Clientes com a tag VIP",
        count: 23
    }
]

const TAG_COLORS = [
    { value: "#6C4BFF", label: "Roxo" },
    { value: "#FF6F91", label: "Rosa" },
    { value: "#FFD447", label: "Amarelo" },
    { value: "#4ECDC4", label: "Turquesa" },
    { value: "#FF6B6B", label: "Vermelho" },
    { value: "#95E1D3", label: "Verde Água" },
    { value: "#F38181", label: "Coral" },
    { value: "#AA96DA", label: "Lavanda" }
]

const mockEmailHistory: TEmailHistory[] = Array.from({ length: 20 }, (_, i) => {
    const templates = getEmailTemplates()
    const template = templates[i % templates.length]
    return {
        id: `email-${i + 1}`,
        templateId: template.id,
        templateName: template.name,
        subject: template.subject,
        recipientsCount: Math.floor(Math.random() * 100) + 10,
        sentAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? "sent" : "failed",
        recipients: Array.from({ length: 5 }, (_, j) => ({
            id: `recipient-${j + 1}`,
            name: `Cliente ${j + 1}`,
            email: `cliente${j + 1}@email.com`
        }))
    }
})


const TagValidator = z.object({
    name: z.string().min(1, { error: "O nome da tag é obrigatório" }).max(50, { error: "O nome da tag deve ter no máximo 50 caracteres" }),
    color: z.string().min(1, { error: "A cor é obrigatória" })
})

const ObservationValidator = z.object({
    text: z.string().min(1, { error: "A observação é obrigatória" }).max(600, { error: "A observação deve ter no máximo 600 caracteres" })
})

const EmailSendValidator = z.object({
    templateId: z.string().min(1, { error: "Selecione um template" }),
    segments: z.array(z.string()).min(1, { error: "Selecione pelo menos um segmento" }),
    templateFields: z.record(z.string(), z.string()).optional()
})

type TTagForm = z.infer<typeof TagValidator>
type TObservationForm = z.infer<typeof ObservationValidator>
type TEmailSendForm = z.infer<typeof EmailSendValidator>

const CRMPannel = () => {
    const emailTemplates = getEmailTemplates()
    const [emailHistory] = useState<TEmailHistory[]>(mockEmailHistory)
    
    const { data: eventsData } = useEventCache()
    const events = eventsData?.data || []
    
    const { data: couponsData } = useCouponFind()
    const coupons = couponsData?.data || []

    const { data: tagsData, isLoading: tagsLoading, refetch: refetchTags } = useTagFind()
    const tags = tagsData?.data || []
    const { mutateAsync: createTag, isPending: isCreatingTag } = useTagCreate()
    const { mutateAsync: updateTag, isPending: isUpdatingTag } = useTagUpdate()
    const { mutateAsync: deleteTag, isPending: isDeletingTag } = useTagDelete()
    const { mutateAsync: createTagClient, isPending: isCreatingTagClient } = useTagClientCreate()
    const { mutateAsync: deleteTagClient, isPending: isDeletingTagClient } = useTagClientDelete()
    const { mutateAsync: createObservation, isPending: isCreatingObservation } = useObservationCreate()
    const { mutateAsync: updateObservation, isPending: isUpdatingObservation } = useObservationUpdate()
    const { mutateAsync: deleteObservation, isPending: isDeletingObservation } = useObservationDelete()

    const [currentPage, setCurrentPage] = useState(1)
    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
    const [search, setSearch] = useState<string>("")
    const [filters, setFilters] = useState<{
        tagId?: string
        eventId?: string
    }>({})

    const [tagDialog, setTagDialog] = useState<{
        open: boolean
        mode: "create" | "edit"
        tagId?: string
    }>({
        open: false,
        mode: "create"
    })

    const [observationDialog, setObservationDialog] = useState<{
        open: boolean
        customerId?: string
    }>({
        open: false
    })

    const [emailDialog, setEmailDialog] = useState<{
        open: boolean
    }>({
        open: false
    })

    const [emailHistoryDialog, setEmailHistoryDialog] = useState<{
        open: boolean
        emailId?: string
    }>({
        open: false
    })

    const [tagsDialog, setTagsDialog] = useState(false)
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
    const [addTagToCustomerDialog, setAddTagToCustomerDialog] = useState<{
        open: boolean
        customerId?: string
    }>({
        open: false
    })
    const [activeTab, setActiveTab] = useState<"customers" | "tags" | "emails">("customers")
    const [deleteTagDialog, setDeleteTagDialog] = useState<{
        open: boolean
        tagId?: string
        tagName?: string
        customersCount?: number
    }>({
        open: false
    })
    const [deleteObservationDialog, setDeleteObservationDialog] = useState<{
        open: boolean
        observationId?: string
        customerId?: string
    }>({
        open: false
    })
    const [editObservationDialog, setEditObservationDialog] = useState<{
        open: boolean
        observationId?: string
        customerId?: string
        currentText?: string
    }>({
        open: false
    })
    const [removeTagFromCustomerDialog, setRemoveTagFromCustomerDialog] = useState<{
        open: boolean
        customerId?: string
        tagId?: string
        tagClientId?: string
        tagName?: string
    }>({
        open: false
    })
    const [tagCustomersDialog, setTagCustomersDialog] = useState<{
        open: boolean
        tagId?: string
        tagName?: string
    }>({
        open: false
    })
    const [upgradeDialog, setUpgradeDialog] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<TEmailTemplate | null>(null)
    const [emailSegments] = useState<TEmailSegment[]>(mockEmailSegments)
    const [selectedEventForTemplate, setSelectedEventForTemplate] = useState<string>("")
    const [selectedCouponForTemplate, setSelectedCouponForTemplate] = useState<string>("")
    const [exportDialog, setExportDialog] = useState(false)
    const [selectedExportSegment, setSelectedExportSegment] = useState<string>("")
    const [recipientsDialog, setRecipientsDialog] = useState<{
        open: boolean
        segmentIds: string[]
    }>({
        open: false,
        segmentIds: []
    })

    const isPro = false
    const emailLimit = isPro ? 5000 : 100
    const emailUsed = 45
    const tagLimit = 200
    const tagsUsed = tags.length


    const tagForm = useForm<TTagForm>({
        resolver: zodResolver(TagValidator),
        defaultValues: {
            name: "",
            color: "#6C4BFF"
        }
    })

    const observationForm = useForm<TObservationForm>({
        resolver: zodResolver(ObservationValidator),
        defaultValues: {
            text: ""
        }
    })

    const emailForm = useForm<TEmailSendForm>({
        resolver: zodResolver(EmailSendValidator),
        defaultValues: {
            templateId: "",
            segments: [],
            templateFields: {}
        }
    })

    const limit = 50
    const offset = (currentPage - 1) * limit

    const searchQuery = useMemo(() => {
        const parts: string[] = []
        if (search) parts.push(search)
        return parts.join(" ") || undefined
    }, [search])

    const { data: customersData, isLoading: customersLoading, refetch: refetchCustomers } = useOrganizerFindClientsCrm({
        offset,
        search: searchQuery
    })

    const customers = customersData?.data?.data || []
    const totalCustomers = customersData?.data?.total || 0
    const totalPages = Math.ceil(totalCustomers / limit)

    const filteredCustomers = useMemo(() => {
        let filtered = [...customers]

        if (filters.tagId) {
            filtered = filtered.filter(c => 
                c.tags.some(t => t.id === filters.tagId)
            )
        }

        if (filters.eventId) {
            filtered = filtered.filter(c => 
                c.events.some(e => e.id === filters.eventId)
            )
        }

        return filtered
    }, [customers, filters])

    const toggleRow = (customerId: string) => {
        setOpenRows(prev => ({
            ...prev,
            [customerId]: !prev[customerId]
        }))
    }

    const handleCreateTag = async (data: TTagForm) => {
        try {
            await createTag(data)
            setTagDialog({ open: false, mode: "create" })
            tagForm.reset()
            Toast.success("Tag criada com sucesso")
        } catch (error) {
            console.error("Erro ao criar tag:", error)
        }
    }

    const handleEditTag = (tagId: string) => {
        const tag = tags.find(t => t.id === tagId)
        if (tag) {
            tagForm.setValue("name", tag.name)
            tagForm.setValue("color", tag.color)
            setTagDialog({ open: true, mode: "edit", tagId })
        }
    }

    const handleUpdateTag = async (data: TTagForm) => {
        if (tagDialog.tagId) {
            try {
                await updateTag({ id: tagDialog.tagId, data })
                setTagDialog({ open: false, mode: "create" })
                tagForm.reset()
                Toast.success("Tag atualizada com sucesso")
            } catch (error) {
                console.error("Erro ao atualizar tag:", error)
            }
        }
    }

    const handleDeleteTag = (tagId: string) => {
        const tag = tags.find(t => t.id === tagId)
        if (tag) {
            const customersWithTag = filteredCustomers.filter(c => c.tags.some(t => t.id === tagId)).length
            setDeleteTagDialog({ 
                open: true, 
                tagId, 
                tagName: tag.name,
                customersCount: customersWithTag
            })
        }
    }

    const confirmDeleteTag = async () => {
        if (deleteTagDialog.tagId) {
            try {
                await deleteTag(deleteTagDialog.tagId)
                setDeleteTagDialog({ open: false })
                await refetchCustomers()
                Toast.success("Tag excluída com sucesso")
            } catch (error) {
                console.error("Erro ao deletar tag:", error)
            }
        }
    }

    const handleViewTagCustomers = (tagId: string) => {
        const tag = tags.find(t => t.id === tagId)
        if (tag) {
            setTagCustomersDialog({ open: true, tagId, tagName: tag.name })
        }
    }

    const handleAddObservation = async (customerId: string, data: TObservationForm) => {
        try {
            await createObservation({
                observation: data.text,
                userId: customerId
            })
            setObservationDialog({ open: false })
            observationForm.reset()
            await refetchCustomers()
            Toast.success("Observação adicionada com sucesso")
        } catch (error) {
            console.error("Erro ao adicionar observação:", error)
        }
    }

    const handleAddTagToCustomer = async (customerId: string, tagId: string) => {
        try {
            await createTagClient({
                tagId,
                userId: customerId
            })
            await refetchCustomers()
            Toast.success("Tag adicionada ao cliente com sucesso")
        } catch (error) {
            console.error("Erro ao adicionar tag ao cliente:", error)
        }
    }

    const handleRemoveTagFromCustomerClick = (customerId: string, tagId: string, tagName: string, tagClientId: string) => {
        setRemoveTagFromCustomerDialog({
            open: true,
            customerId,
            tagId,
            tagClientId,
            tagName
        })
    }

    const confirmRemoveTagFromCustomer = async () => {
        if (removeTagFromCustomerDialog.tagClientId && removeTagFromCustomerDialog.customerId) {
            try {
                await deleteTagClient(removeTagFromCustomerDialog.tagClientId)
                setRemoveTagFromCustomerDialog({ open: false })
                await refetchCustomers()
                Toast.success("Tag removida do cliente com sucesso")
            } catch (error) {
                console.error("Erro ao remover tag do cliente:", error)
            }
        }
    }

    const handleSendEmail = (data: TEmailSendForm) => {
        console.log("Enviar e-mail:", data)
        setEmailDialog({ open: false })
        emailForm.reset()
    }

    const handleTemplateSelect = (templateId: string) => {
        const template = emailTemplates.find(t => t.id === templateId)
        if (template) {
            if (template.isPremium && !isPro) {
                setUpgradeDialog(true)
                return
            }
            setSelectedTemplate(template)
            emailForm.setValue("templateId", template.id)
            setSelectedEventForTemplate("")
            const fields: Record<string, string> = {}
            template.editableFields.forEach(field => {
                fields[field] = ""
            })
            emailForm.setValue("templateFields", fields)
        }
    }

    const getPreviewBody = () => {
        if (!selectedTemplate) return ""
        let preview = selectedTemplate.body
        const selectedEvent = events.find(e => e.id === selectedEventForTemplate)
        const selectedCoupon = coupons.find((c: TCoupon) => c.id === selectedCouponForTemplate)
        
        preview = preview.replace(/\{\{nome\}\}/g, "{\{nome\}\}")
        
        if (selectedEvent) {
            preview = preview.replace(/\{\{evento\}\}/g, selectedEvent.name)
            const firstDate = selectedEvent.EventDates?.[0]
            if (firstDate?.date) {
                const date = new Date(firstDate.date)
                preview = preview.replace(/\{\{data\}\}/g, date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }))
            } else {
                preview = preview.replace(/\{\{data\}\}/g, "[Data do evento]")
            }
            const locationText = selectedEvent.location || "Local ainda não definido"
            preview = preview.replace(/\{\{local\}\}/g, locationText)
        } else {
            preview = preview.replace(/\{\{evento\}\}/g, "[Selecione um evento]")
            preview = preview.replace(/\{\{data\}\}/g, "[Data do evento]")
            preview = preview.replace(/\{\{local\}\}/g, "[Local do evento]")
        }
        
        if (selectedCoupon) {
            const discountText = selectedCoupon.discountType === "PERCENTAGE" 
                ? `${selectedCoupon.discountValue}%` 
                : `${ValueUtils.centsToCurrency(selectedCoupon.discountValue)}`
            const couponEvent = events.find(e => e.id === selectedCoupon.eventId)
            const eventName = couponEvent?.name || "Evento não encontrado"
            preview = preview.replace(/\{\{cupomCodigo\}\}/g, selectedCoupon.code)
            preview = preview.replace(/\{\{cupomDesconto\}\}/g, discountText)
            preview = preview.replace(/\{\{cupomDescricao\}\}/g, `Válido para o evento ${eventName}`)
        } else {
            preview = preview.replace(/\{\{cupomCodigo\}\}/g, "[Código do cupom]")
            preview = preview.replace(/\{\{cupomDesconto\}\}/g, "[Desconto]")
            preview = preview.replace(/\{\{cupomDescricao\}\}/g, "[Descrição do cupom]")
        }
        
        if (selectedTemplate.id === "template-nutrir" && selectedEvent) {
            const firstDate = selectedEvent.EventDates?.[0]
            const dateText = firstDate?.date 
                ? new Date(firstDate.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "[Data do evento]"
            preview = preview.replace(/\{\{eventoTexto\}\}/g, `Confira o evento "${selectedEvent.name}" que acontecerá em ${dateText}.`)
        } else {
            preview = preview.replace(/\{\{eventoTexto\}\}/g, "[Descrição do evento]")
        }
        
        return preview
    }

    const getPreviewSubject = () => {
        if (!selectedTemplate) return ""
        let preview = selectedTemplate.subject
        const selectedEvent = events.find(e => e.id === selectedEventForTemplate)
        
        if (selectedEvent) {
            preview = preview.replace(/\{\{evento\}\}/g, selectedEvent.name)
        } else {
            preview = preview.replace(/\{\{evento\}\}/g, "[Selecione um evento]")
        }
        
        return preview
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value)
    }

    const handleDownload = (format: "pdf" | "excel" | "csv" | "json", segmentId?: string) => {
        console.log("Download:", format, "Segmento:", segmentId)
        setExportDialog(false)
        setSelectedExportSegment("")
    }

    const selectedEmail = emailHistory.find(e => e.id === emailHistoryDialog.emailId)

    return (
        <Background variant="light">
            <div className="container mx-auto px-4 py-8 space-y-6 mt-[80px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-psi-primary">CRM</h1>
                        <p className="text-psi-dark/60 mt-1">Gerencie seus clientes e comunicações</p>
                    </div>
                    {!isPro && (
                        <Button
                            variant="primary"
                            className="gap-2"
                            onClick={() => setUpgradeDialog(true)}
                        >
                            <Crown className="h-4 w-4" />
                            Upgrade para CRM Pro
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <div className="p-6">
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">Total de Clientes</p>
                            <div className="text-3xl font-bold text-psi-dark">{customersLoading ? "-" : totalCustomers}</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">E-mails Enviados</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-3xl font-bold text-psi-dark">{emailUsed}</div>
                                <div className="text-sm text-psi-dark/60">/ {emailLimit}</div>
                            </div>
                            <div className="h-2 bg-psi-primary/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-psi-primary rounded-full transition-all"
                                    style={{ width: `${(emailUsed / emailLimit) * 100}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">Tags Criadas</p>
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold text-psi-dark">{tagsUsed}</div>
                                <div className="text-sm text-psi-dark/60">/ {tagLimit}</div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">Plano</p>
                            <div className="flex items-center gap-2">
                                {isPro ? (
                                    <>
                                        <Crown className="h-5 w-5 text-psi-tertiary" />
                                        <div className="text-lg font-semibold text-psi-dark">CRM Pro</div>
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 className="h-5 w-5 text-psi-dark/40" />
                                        <div className="text-lg font-semibold text-psi-dark">Básico</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2 border-b border-psi-dark/10">
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === "customers"
                                    ? "text-psi-dark border-b-2 border-psi-primary"
                                    : "text-psi-dark/60 hover:text-psi-dark"
                            }`}
                            onClick={() => setActiveTab("customers")}
                        >
                            Clientes
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === "tags"
                                    ? "text-psi-dark border-b-2 border-psi-primary"
                                    : "text-psi-dark/60 hover:text-psi-dark"
                            }`}
                            onClick={() => setActiveTab("tags")}
                        >
                            Tags
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === "emails"
                                    ? "text-psi-dark border-b-2 border-psi-primary"
                                    : "text-psi-dark/60 hover:text-psi-dark"
                            }`}
                            onClick={() => setActiveTab("emails")}
                        >
                            E-mails
                        </button>
                    </div>

                    {activeTab === "customers" && (
                        <div className="space-y-4">
                            <Card>
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold text-psi-dark">Lista de Clientes</h2>
                                        <p className="text-sm text-psi-dark/60 mt-1">
                                            Gerencie todos os clientes que compraram ingressos dos seus eventos
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEmailDialog({ open: true })}
                                            className="gap-2"
                                        >
                                            <Mail className="h-4 w-4" />
                                            Enviar E-mail
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => setExportDialog(true)}
                                        >
                                            <Download className="h-4 w-4" />
                                            Exportar
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Input
                                        placeholder="Buscar por nome, e-mail, telefone..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value)
                                            setCurrentPage(1)
                                        }}
                                        className="w-full"
                                    />
                                    <Select
                                        value={filters.tagId || "all"}
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, tagId: value === "all" ? undefined : value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filtrar por tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as tags</SelectItem>
                                            {tags.map(tag => (
                                                <SelectItem key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={filters.eventId || "all"}
                                        onValueChange={(value) => setFilters(prev => ({ ...prev, eventId: value === "all" ? undefined : value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filtrar por evento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os eventos</SelectItem>
                                            {events.map(event => (
                                                <SelectItem key={event.id} value={event.id}>
                                                    {event.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setFilters({})
                                            setSearch("")
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        Limpar filtros
                                    </Button>
                                </div>

                                <div className="rounded-lg border border-psi-dark/10 overflow-hidden">
                                    {customersLoading ? (
                                        <div className="p-8 space-y-4">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))}
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Nome</TableHead>
                                                    <TableHead>E-mail</TableHead>
                                                    <TableHead>Celular</TableHead>
                                                    <TableHead>Compras</TableHead>
                                                    <TableHead>Total Gasto</TableHead>
                                                    <TableHead>Última Compra</TableHead>
                                                    <TableHead className="w-24">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredCustomers.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="text-center py-8 text-psi-dark/60">
                                                            Nenhum cliente encontrado
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredCustomers.map(customer => (
                                                    <React.Fragment key={customer.id}>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => toggleRow(customer.id)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    {openRows[customer.id] ? (
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell className="font-medium">{customer.name}</TableCell>
                                                            <TableCell>{customer.email}</TableCell>
                                                            <TableCell>{customer.phone}</TableCell>
                                                            <TableCell>{customer.totalPurchases}</TableCell>
                                                            <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                                                            <TableCell>{formatDate(customer.lastPurchaseDate)}</TableCell>
                                                            <TableCell>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0"
                                                                        >
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() => setObservationDialog({ open: true, customerId: customer.id })}
                                                                            className="gap-2"
                                                                        >
                                                                            <MessageSquare className="h-4 w-4" />
                                                                            Adicionar observação
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                        {openRows[customer.id] && (
                                                            <TableRow>
                                                                <TableCell colSpan={8} className="bg-psi-primary/5">
                                                                    <div className="p-4 space-y-4">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <h4 className="font-semibold text-psi-dark mb-2">Eventos e Ingressos</h4>
                                                                                <div className="space-y-3">
                                                                                    {customer.events.map(event => (
                                                                                        <div key={event.id} className="bg-white p-3 rounded-lg border border-psi-dark/10">
                                                                                            <div className="flex items-center gap-2 text-sm font-medium text-psi-dark mb-2">
                                                                                                <Calendar className="h-4 w-4" />
                                                                                                <span>{event.name}</span>
                                                                                            </div>
                                                                                            <div className="text-xs text-psi-dark/60 mb-2">
                                                                                                Data: {formatDate(event.date)}
                                                                                            </div>
                                                                                            {event.tickets && event.tickets.length > 0 && (
                                                                                                <div className="space-y-1">
                                                                                                    <p className="text-xs font-medium text-psi-dark/70 mb-1">Ingressos:</p>
                                                                                                    {event.tickets.map((ticket, idx) => (
                                                                                                        <div key={idx} className="flex items-center justify-between text-xs text-psi-dark/60">
                                                                                                            <span>{ticket.type}</span>
                                                                                                            <span className="font-medium">{ticket.quantity}x</span>
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="mt-3 p-3 bg-psi-primary/5 rounded-lg border border-psi-primary/20">
                                                                                    <div className="text-xs text-psi-dark/60">
                                                                                        Última compra: {formatDate(customer.lastPurchaseDate)} às {customer.lastPurchaseTime}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-semibold text-psi-dark mb-2">Tags</h4>
                                                                                <div className="flex flex-wrap gap-2 mb-2">
                                                                                    {customer.tags.map(tag => (
                                                                                        <Badge
                                                                                            key={tag.id}
                                                                                            variant="outline"
                                                                                            style={{ borderColor: tag.color, color: tag.color }}
                                                                                            className="gap-1"
                                                                                        >
                                                                                            <Tag className="h-3 w-3" />
                                                                                            {tag.name}
                                                                                            <button
                                                                                                onClick={() => handleRemoveTagFromCustomerClick(customer.id, tag.id, tag.name, tag.tagClientId)}
                                                                                                className="ml-1 hover:opacity-70"
                                                                                            >
                                                                                                <X className="h-3 w-3" />
                                                                                            </button>
                                                                                        </Badge>
                                                                                    ))}
                                                                                </div>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => setAddTagToCustomerDialog({ open: true, customerId: customer.id })}
                                                                                    className="gap-2"
                                                                                >
                                                                                    <Plus className="h-3 w-3" />
                                                                                    Adicionar Tag
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                        {(customer.observations?.length || 0) > 0 && (
                                                                            <div>
                                                                                <h4 className="font-semibold text-psi-dark mb-3">Observações</h4>
                                                                                <div className="relative">
                                                                                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-psi-primary/20"></div>
                                                                                    <div className="space-y-4 pl-8">
                                                                                        {[...(customer.observations || []).map(obs => ({
                                                                                            id: obs.id,
                                                                                            observation: obs.text,
                                                                                            userId: customer.id,
                                                                                            ownerUserId: customer.id,
                                                                                            createdAt: obs.createdAt,
                                                                                            updatedAt: null
                                                                                        }))]
                                                                                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                                                                            .map((obs, index, array) => {
                                                                                                const isLast = index === array.length - 1
                                                                                                const date = new Date(obs.createdAt)
                                                                                                const isToday = date.toDateString() === new Date().toDateString()
                                                                                                const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString()
                                                                                                
                                                                                                let dateLabel = ""
                                                                                                if (isToday) {
                                                                                                    dateLabel = "Hoje"
                                                                                                } else if (isYesterday) {
                                                                                                    dateLabel = "Ontem"
                                                                                                } else {
                                                                                                    dateLabel = formatDate(obs.createdAt)
                                                                                                }
                                                                                                
                                                                                                const timeLabel = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                                                                                                
                                                                                                return (
                                                                                                    <div key={obs.id} className="relative">
                                                                                                        <div className="absolute -left-11 top-1.5 h-3 w-3 rounded-full bg-psi-primary border-2 border-white shadow-sm"></div>
                                                                                                        <div className="bg-white p-4 rounded-lg border border-psi-dark/10 shadow-sm hover:shadow-md transition-shadow">
                                                                                                            <div className="flex items-start justify-between gap-2">
                                                                                                                <div className="flex-1">
                                                                                                                    <p className="text-sm text-psi-dark/80 whitespace-pre-wrap">{obs.observation}</p>
                                                                                                                    <div className="flex items-center gap-2 mt-2">
                                                                                                                        <span className="text-xs text-psi-dark/50">{dateLabel}</span>
                                                                                                                        <span className="text-xs text-psi-dark/40">•</span>
                                                                                                                        <span className="text-xs text-psi-dark/50">{timeLabel}</span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="flex gap-1">
                                                                                                                    <Button
                                                                                                                        variant="ghost"
                                                                                                                        size="sm"
                                                                                                                        onClick={() => {
                                                                                                                            observationForm.setValue("text", obs.observation)
                                                                                                                            setEditObservationDialog({
                                                                                                                                open: true,
                                                                                                                                observationId: obs.id,
                                                                                                                                customerId: customer.id,
                                                                                                                                currentText: obs.observation
                                                                                                                            })
                                                                                                                        }}
                                                                                                                        className="h-7 w-7 p-0"
                                                                                                                    >
                                                                                                                        <Edit className="h-3 w-3" />
                                                                                                                    </Button>
                                                                                                                    <Button
                                                                                                                        variant="ghost"
                                                                                                                        size="sm"
                                                                                                                        onClick={() => setDeleteObservationDialog({
                                                                                                                            open: true,
                                                                                                                            observationId: obs.id,
                                                                                                                            customerId: customer.id
                                                                                                                        })}
                                                                                                                        className="h-7 w-7 p-0 text-destructive"
                                                                                                                    >
                                                                                                                        <Trash2 className="h-3 w-3" />
                                                                                                                    </Button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {!isLast && <div className="absolute -left-11 top-4 bottom-0 w-0.5 bg-psi-primary/10"></div>}
                                                                                                    </div>
                                                                                                )
                                                                                            })}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </React.Fragment>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                    )}
                                </div>

                                {totalPages > 1 && !customersLoading && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) => {
                                            setCurrentPage(page)
                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                        }}
                                    />
                                )}
                                </div>
                            </div>
                        </Card>
                    </div>
                    )}

                    {activeTab === "tags" && (
                        <div className="space-y-4">
                            <Card>
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-psi-dark">Gestão de Tags</h2>
                                        <p className="text-sm text-psi-dark/60 mt-1">
                                            Crie e gerencie tags para organizar seus clientes (máximo de {tagLimit} tags)
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            tagForm.reset()
                                            setTagDialog({ open: true, mode: "create" })
                                        }}
                                        disabled={tags.length >= tagLimit}
                                        className="gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Nova Tag
                                    </Button>
                                </div>
                                {tagsLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <Card key={i}>
                                                <div className="p-4">
                                                    <Skeleton className="h-20 w-full" />
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {tags.length === 0 ? (
                                            <div className="col-span-full text-center py-8 text-psi-dark/60">
                                                Nenhuma tag criada ainda
                                            </div>
                                        ) : (
                                            tags.map(tag => (
                                        <Card key={tag.id}>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <Badge
                                                        variant="outline"
                                                        style={{ borderColor: tag.color, color: tag.color }}
                                                        className="gap-1"
                                                    >
                                                        <Tag className="h-3 w-3" />
                                                        {tag.name}
                                                    </Badge>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditTag(tag.id)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteTag(tag.id)}
                                                            className="h-8 w-8 p-0 text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-psi-dark/60">
                                                        {filteredCustomers.filter(c => c.tags.some(t => t.id === tag.id)).length} cliente{filteredCustomers.filter(c => c.tags.some(t => t.id === tag.id)).length !== 1 ? "s" : ""}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewTagCustomers(tag.id)}
                                                        className="h-7 text-xs gap-1"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        Ver clientes
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                    )}

                    {activeTab === "emails" && (
                        <div className="space-y-4">
                            <Card>
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-psi-dark">Histórico de E-mails</h2>
                                        <p className="text-sm text-psi-dark/60 mt-1">
                                            Visualize todos os e-mails enviados para seus clientes
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => setEmailDialog({ open: true })}
                                        className="gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        Novo E-mail
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {emailHistory.map(email => (
                                        <Card key={email.id}>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-semibold text-psi-dark">{email.subject}</h4>
                                                            <Badge variant={email.status === "sent" ? "default" : "destructive"}>
                                                                {email.status === "sent" ? "Enviado" : "Falhou"}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-psi-dark/60 space-y-1">
                                                            <p>Template: {email.templateName}</p>
                                                            <p>Destinatários: {email.recipientsCount}</p>
                                                            <p>Enviado em: {formatDateTime(email.sentAt)}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEmailHistoryDialog({ open: true, emailId: email.id })}
                                                        className="gap-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Ver Detalhes
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                    )}
                </div>
            </div>

            <Dialog open={tagDialog.open} onOpenChange={(open) => {
                setTagDialog({ open, mode: "create" })
                tagForm.reset()
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {tagDialog.mode === "create" ? "Nova Tag" : "Editar Tag"}
                        </DialogTitle>
                        <DialogDescription>
                            {tagDialog.mode === "create" 
                                ? "Crie uma nova tag para organizar seus clientes"
                                : "Edite as informações da tag"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={tagForm.handleSubmit(tagDialog.mode === "create" ? handleCreateTag : handleUpdateTag)} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-2 block">Nome da Tag</label>
                            <Input
                                {...tagForm.register("name")}
                                placeholder="Ex: VIP, Frequente, etc."
                            />
                            {tagForm.formState.errors.name && (
                                <p className="text-sm text-destructive mt-1">{tagForm.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-2 block">Cor</label>
                            <div className="grid grid-cols-4 gap-3">
                                {TAG_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => tagForm.setValue("color", color.value)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                            tagForm.watch("color") === color.value 
                                                ? "border-psi-primary bg-psi-primary/5 scale-105" 
                                                : "border-psi-dark/20 hover:border-psi-primary/50"
                                        }`}
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full"
                                            style={{ backgroundColor: color.value }}
                                        />
                                        <span className="text-xs text-psi-dark/70">{color.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setTagDialog({ open: false, mode: "create" })
                                    tagForm.reset()
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">
                                {tagDialog.mode === "create" ? "Criar" : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={observationDialog.open} onOpenChange={(open) => {
                setObservationDialog({ open })
                observationForm.reset()
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Observação</DialogTitle>
                        <DialogDescription>
                            Adicione uma observação sobre este cliente (máximo de 600 caracteres)
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={observationForm.handleSubmit((data) => {
                        if (observationDialog.customerId) {
                            handleAddObservation(observationDialog.customerId, data)
                        }
                    })} className="space-y-4">
                        <div>
                            <Textarea
                                {...observationForm.register("text")}
                                placeholder="Digite sua observação..."
                                rows={6}
                                maxLength={600}
                            />
                            <div className="flex justify-between items-center mt-1">
                            {observationForm.formState.errors.text && (
                                <p className="text-sm text-destructive">{observationForm.formState.errors.text.message}</p>
                            )}
                                <p className="text-sm text-psi-dark/60 ml-auto">
                                    {observationForm.watch("text")?.length || 0}/600
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setObservationDialog({ open: false })
                                    observationForm.reset()
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={isCreatingObservation}>
                                {isCreatingObservation ? "Adicionando..." : "Adicionar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={editObservationDialog.open} onOpenChange={(open) => {
                setEditObservationDialog({ open })
                observationForm.reset()
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Observação</DialogTitle>
                        <DialogDescription>
                            Edite a observação sobre este cliente (máximo de 600 caracteres)
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={observationForm.handleSubmit(async (data) => {
                        if (editObservationDialog.observationId && editObservationDialog.customerId) {
                            try {
                                await updateObservation({
                                    id: editObservationDialog.observationId,
                                    data: { observation: data.text },
                                    userId: editObservationDialog.customerId
                                })
                                setEditObservationDialog({ open: false })
                                observationForm.reset()
                                await refetchCustomers()
                                Toast.success("Observação atualizada com sucesso")
                            } catch (error) {
                                console.error("Erro ao atualizar observação:", error)
                            }
                        }
                    })} className="space-y-4">
                        <div>
                            <Textarea
                                {...observationForm.register("text")}
                                placeholder="Digite sua observação..."
                                rows={6}
                                maxLength={600}
                            />
                            <div className="flex justify-between items-center mt-1">
                            {observationForm.formState.errors.text && (
                                <p className="text-sm text-destructive">{observationForm.formState.errors.text.message}</p>
                            )}
                                <p className="text-sm text-psi-dark/60 ml-auto">
                                    {observationForm.watch("text")?.length || 0}/600
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditObservationDialog({ open: false })
                                    observationForm.reset()
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={isUpdatingObservation}>
                                {isUpdatingObservation ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Sheet open={emailDialog.open} onOpenChange={(open) => {
                setEmailDialog({ open })
                emailForm.reset()
                setSelectedTemplate(null)
                setSelectedEventForTemplate("")
                setSelectedCouponForTemplate("")
            }}>
                <SheetContent side="right" className="w-[90vw] sm:w-[90vw] lg:w-[1200px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-semibold text-psi-primary">Enviar E-mail</SheetTitle>
                        <SheetDescription>
                            Escolha um template e selecione os destinatários
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={emailForm.handleSubmit(handleSendEmail)} className="space-y-6 mt-6 mx-4">
                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-3 block">Selecione um Template</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {emailTemplates.map(template => (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => handleTemplateSelect(template.id)}
                                        disabled={template.isPremium && !isPro}
                                        className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                                            selectedTemplate?.id === template.id
                                                ? "border-psi-primary bg-psi-primary/5"
                                                : "border-psi-dark/10 hover:border-psi-primary/50"
                                        } ${template.isPremium && !isPro ? "opacity-60 cursor-not-allowed" : ""}`}
                                    >
                                        {template.isPremium && (
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="psi-tertiary" className="text-xs gap-1">
                                                    <Crown className="h-3 w-3" />
                                                    Premium
                                                </Badge>
                                            </div>
                                        )}
                                        <div className="mb-2 text-psi-primary">{template.icon}</div>
                                        <h4 className="font-semibold text-psi-dark mb-1">{template.name}</h4>
                                        <p className="text-xs text-psi-dark/60">{template.preview}</p>
                                    </button>
                                ))}
                            </div>
                            {emailForm.formState.errors.templateId && (
                                <p className="text-sm text-destructive mt-2">{emailForm.formState.errors.templateId.message}</p>
                            )}
                        </div>

                        {selectedTemplate && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-psi-dark mb-3">Preview do E-mail</h4>
                                    <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4 space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-psi-dark/60 mb-1">Assunto:</p>
                                            <p className="text-sm font-medium text-psi-dark">{getPreviewSubject()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-psi-dark/60 mb-1">Corpo:</p>
                                            <div className="bg-white p-3 rounded border border-psi-dark/10 text-sm text-psi-dark/70 whitespace-pre-line">
                                                {getPreviewBody()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedTemplate.editableFields.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-psi-dark mb-3">Informações do Template</h4>
                                        <div className="space-y-3">
                                            {selectedTemplate.editableFields.map(field => {
                                                if (field === "evento") {
                                                    return (
                                                        <div key={field}>
                                                            <label className="text-sm font-medium text-psi-dark mb-1 block">
                                                                Evento
                                                            </label>
                                                            <Select
                                                                value={selectedEventForTemplate}
                                                                onValueChange={(value) => {
                                                                    setSelectedEventForTemplate(value)
                                                                    emailForm.setValue("templateFields.evento", value)
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um evento" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {events.map(event => (
                                                                        <SelectItem key={event.id} value={event.id}>
                                                                            {event.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {selectedEventForTemplate && (() => {
                                                                const selectedEvent = events.find(e => e.id === selectedEventForTemplate)
                                                                const firstDate = selectedEvent?.EventDates?.[0]
                                                                return selectedEvent && (
                                                                    <div className="mt-2 p-2 bg-psi-primary/5 rounded border border-psi-primary/20 space-y-1">
                                                                        {firstDate?.date && (
                                                                            <p className="text-xs text-psi-dark/60">
                                                                                <strong>Data:</strong> {new Date(firstDate.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                                                            </p>
                                                                        )}
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            <strong>Local:</strong> {selectedEvent.location || "Local ainda não definido"}
                                                                        </p>
                                                                    </div>
                                                                )
                                                            })()}
                                                        </div>
                                                    )
                                                }
                                                if (field === "cupom") {
                                                    return (
                                                        <div key={field}>
                                                            <label className="text-sm font-medium text-psi-dark mb-1 block">
                                                                Cupom de Desconto
                                                            </label>
                                                            <Select
                                                                value={selectedCouponForTemplate}
                                                                onValueChange={(value) => {
                                                                    setSelectedCouponForTemplate(value)
                                                                    emailForm.setValue("templateFields.cupom", value)
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um cupom" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {coupons.length === 0 ? (
                                                                        <SelectItem value="no-coupons" disabled>
                                                                            Nenhum cupom disponível
                                                                        </SelectItem>
                                                                    ) : (
                                                                        coupons.map((coupon: TCoupon) => {
                                                                            const couponEvent = events.find(e => e.id === coupon.eventId)
                                                                            const eventName = couponEvent?.name || "Evento não encontrado"
                                                                            const discountText = coupon.discountType === "PERCENTAGE" 
                                                                                ? `${coupon.discountValue}%` 
                                                                                : ValueUtils.centsToCurrency(coupon.discountValue)
                                                                            return (
                                                                                <SelectItem key={coupon.id} value={coupon.id}>
                                                                                    {coupon.code} - {discountText} ({eventName})
                                                                                </SelectItem>
                                                                            )
                                                                        })
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            {selectedCouponForTemplate && (() => {
                                                                const selectedCoupon = coupons.find((c: TCoupon) => c.id === selectedCouponForTemplate)
                                                                if (!selectedCoupon) return null
                                                                const couponEvent = events.find(e => e.id === selectedCoupon.eventId)
                                                                const eventName = couponEvent?.name || "Evento não encontrado"
                                                                const discountText = selectedCoupon.discountType === "PERCENTAGE" 
                                                                    ? `${selectedCoupon.discountValue}%` 
                                                                    : ValueUtils.centsToCurrency(selectedCoupon.discountValue)
                                                                return (
                                                                    <div className="mt-2 p-2 bg-psi-primary/5 rounded border border-psi-primary/20">
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            <strong>Código:</strong> {selectedCoupon.code}
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/60 mt-1">
                                                                            <strong>Desconto:</strong> {discountText}
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/60 mt-1">
                                                                            <strong>Evento:</strong> {eventName}
                                                                        </p>
                                                                    </div>
                                                                )
                                                            })()}
                                                        </div>
                                                    )
                                                }
                                                return (
                                                    <div key={field}>
                                                        <label className="text-sm font-medium text-psi-dark mb-1 block capitalize">
                                                            {field}
                                                        </label>
                                                        <Input
                                                            {...emailForm.register(`templateFields.${field}`)}
                                                            placeholder={`Digite o ${field}`}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-psi-dark block">Selecione os Segmentos</label>
                                        {emailForm.watch("segments") && emailForm.watch("segments")!.length > 0 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setRecipientsDialog({ 
                                                    open: true, 
                                                    segmentIds: emailForm.watch("segments") || [] 
                                                })}
                                                className="gap-1 text-xs"
                                            >
                                                <Eye className="h-3 w-3" />
                                                Ver destinatários
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto border border-psi-dark/10 rounded-lg p-4">
                                        {emailSegments.map(segment => (
                                            <div
                                                key={segment.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-psi-dark/10 hover:bg-psi-primary/5 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-medium text-psi-dark">{segment.name}</h5>
                                                        <Badge variant="outline" className="text-xs">
                                                            {segment.type === "event" ? "Evento" : segment.type === "tag" ? "Tag" : "Personalizado"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-psi-dark/60">{segment.description}</p>
                                                    <p className="text-xs text-psi-dark/50 mt-1">{segment.count} destinatários</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={emailForm.watch("segments")?.includes(segment.id) || false}
                                                    onChange={(e) => {
                                                        const current = emailForm.watch("segments") || []
                                                        if (e.target.checked) {
                                                            emailForm.setValue("segments", [...current, segment.id])
                                                        } else {
                                                            emailForm.setValue("segments", current.filter(id => id !== segment.id))
                                                        }
                                                    }}
                                                    className="ml-4"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {emailForm.formState.errors.segments && (
                                        <p className="text-sm text-destructive mt-2">{emailForm.formState.errors.segments.message}</p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-3">
                            <p className="text-sm text-psi-dark/70">
                                <strong>E-mails restantes este mês:</strong> {emailLimit - emailUsed} / {emailLimit}
                            </p>
                        </div>
                        <SheetFooter className="gap-2">
                            <div className="flex items-end justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEmailDialog({ open: false })
                                        emailForm.reset()
                                        setSelectedTemplate(null)
                                        setSelectedEventForTemplate("")
                                        setSelectedCouponForTemplate("")
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" disabled={emailUsed >= emailLimit}>
                                    Enviar E-mail
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <Dialog open={emailHistoryDialog.open} onOpenChange={(open) => {
                setEmailHistoryDialog({ open })
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes do E-mail</DialogTitle>
                        <DialogDescription>
                            Visualize os detalhes e destinatários do e-mail enviado
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEmail && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Assunto</h4>
                                <p className="text-psi-dark/70">{selectedEmail.subject}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Template</h4>
                                <p className="text-psi-dark/70">{selectedEmail.templateName}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Status</h4>
                                <Badge variant={selectedEmail.status === "sent" ? "default" : "destructive"}>
                                    {selectedEmail.status === "sent" ? "Enviado" : "Falhou"}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Enviado em</h4>
                                <p className="text-psi-dark/70">{formatDateTime(selectedEmail.sentAt)}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Destinatários ({selectedEmail.recipientsCount})</h4>
                                <div className="h-60 border border-psi-dark/10 rounded-lg p-4 overflow-y-auto">
                                    <div className="space-y-2">
                                        {selectedEmail.recipients.map(recipient => (
                                            <div key={recipient.id} className="text-sm text-psi-dark/70">
                                                {recipient.name} ({recipient.email})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={addTagToCustomerDialog.open} onOpenChange={(open) => {
                setAddTagToCustomerDialog({ open })
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Tag ao Cliente</DialogTitle>
                        <DialogDescription>
                            Selecione uma tag para adicionar a este cliente
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {tags.map(tag => (
                                <div
                                    key={tag.id}
                                    className="flex items-center justify-between p-3 border border-psi-dark/10 rounded-lg hover:bg-psi-primary/5 cursor-pointer transition-colors"
                                    onClick={() => {
                                        if (addTagToCustomerDialog.customerId) {
                                            handleAddTagToCustomer(addTagToCustomerDialog.customerId, tag.id)
                                            setAddTagToCustomerDialog({ open: false })
                                        }
                                    }}
                                >
                                    <Badge
                                        variant="outline"
                                        style={{ borderColor: tag.color, color: tag.color }}
                                        className="gap-1"
                                    >
                                        <Tag className="h-3 w-3" />
                                        {tag.name}
                                    </Badge>
                                    <span className="text-sm text-psi-dark/60">
                                        {filteredCustomers.filter(c => c.tags.some(t => t.id === tag.id)).length} cliente{filteredCustomers.filter(c => c.tags.some(t => t.id === tag.id)).length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogConfirm
                open={deleteTagDialog.open}
                onOpenChange={(open) => setDeleteTagDialog({ open })}
                onConfirm={confirmDeleteTag}
                title="Excluir Tag"
                description={
                    deleteTagDialog.customersCount && deleteTagDialog.customersCount > 0
                        ? `Tem certeza que deseja excluir a tag "${deleteTagDialog.tagName}"? Esta tag está associada a ${deleteTagDialog.customersCount} cliente${deleteTagDialog.customersCount !== 1 ? "s" : ""}. Todos os clientes associados a esta tag não irão mais possuir essa tag. Esta ação é irreversível.`
                        : `Tem certeza que deseja excluir a tag "${deleteTagDialog.tagName}"? Esta ação não pode ser desfeita.`
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />

            <DialogConfirm
                open={removeTagFromCustomerDialog.open}
                onOpenChange={(open) => setRemoveTagFromCustomerDialog({ open })}
                onConfirm={confirmRemoveTagFromCustomer}
                title="Remover Tag do Cliente"
                description={`Tem certeza que deseja remover a tag "${removeTagFromCustomerDialog.tagName}" deste cliente? Esta ação não pode ser desfeita.`}
                confirmText="Remover"
                cancelText="Cancelar"
                variant="destructive"
            />

            <DialogConfirm
                open={deleteObservationDialog.open}
                onOpenChange={(open) => setDeleteObservationDialog({ open })}
                onConfirm={async () => {
                    if (deleteObservationDialog.observationId && deleteObservationDialog.customerId) {
                        try {
                            await deleteObservation({
                                id: deleteObservationDialog.observationId,
                                userId: deleteObservationDialog.customerId
                            })
                            setDeleteObservationDialog({ open: false })
                            await refetchCustomers()
                            Toast.success("Observação excluída com sucesso")
                        } catch (error) {
                            console.error("Erro ao excluir observação:", error)
                        }
                    }
                }}
                title="Excluir Observação"
                description="Tem certeza que deseja excluir esta observação? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />

            <Dialog open={tagCustomersDialog.open} onOpenChange={(open) => {
                setTagCustomersDialog({ open })
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Clientes com a Tag "{tagCustomersDialog.tagName}"</DialogTitle>
                        <DialogDescription>
                            Lista de todos os clientes que possuem esta tag
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {tagCustomersDialog.tagId && filteredCustomers.filter(c => c.tags.some(t => t.id === tagCustomersDialog.tagId)).map(customer => (
                            <div key={customer.id} className="p-3 border border-psi-dark/10 rounded-lg hover:bg-psi-primary/5 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-psi-dark">{customer.name}</p>
                                        <p className="text-sm text-psi-dark/60">{customer.email}</p>
                                    </div>
                                    <Badge variant="outline">{customer.totalPurchases} compra{customer.totalPurchases !== 1 ? "s" : ""}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={upgradeDialog} onOpenChange={setUpgradeDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="h-20 w-20 rounded-full bg-linear-to-br from-psi-tertiary/40 via-psi-primary/20 to-psi-secondary/40 flex items-center justify-center border-2 border-psi-primary/60">
                                <Crown className="h-10 w-10 text-psi-primary" />
                            </div>
                        </div>
                        <DialogTitle className="text-2xl text-center">Upgrade para CRM Pro</DialogTitle>
                        <DialogDescription className="text-center text-base">
                            Potencialize sua comunicação e gestão de clientes
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="relative overflow-hidden rounded-xl p-8 border border-psi-primary/20 bg-linear-to-br from-psi-primary/10 via-psi-secondary/5 to-psi-tertiary/10">
                            <div className="absolute inset-0 pointer-events-none select-none">
                                <div
                                    aria-hidden="true"
                                    className="absolute -top-10 -left-10 w-40 h-40 bg-psi-primary/10 blur-2xl rounded-full"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute -bottom-8 -right-8 w-32 h-32 bg-psi-tertiary/20 blur-2xl rounded-full"
                                />
                                <div 
                                    aria-hidden="true"
                                    className="absolute bottom-1/2 left-1/2 w-36 h-36 bg-psi-secondary/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"
                                />
                            </div>
                            <div className="relative flex flex-col items-center justify-center">
                                <div className="">
                                    <Crown
                                        className="h-8 w-8 text-psi-primary mb-2"
                                        aria-label="Coroa representando exclusividade PRO"
                                    />
                                </div>
                                <div className="flex flex-col items-center mb-2">
                                    <span className="text-5xl font-extrabold text-psi-primary leading-none">R$ 99,90<span className="text-sm text-psi-dark/60 font-medium">/mês</span></span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-psi-dark mb-3">Benefícios do CRM Pro:</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Até 5.000 e-mails por mês</p>
                                        <p className="text-sm text-psi-dark/60">50x mais que o plano básico</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Segmentação avançada</p>
                                        <p className="text-sm text-psi-dark/60">Crie listas personalizadas e segmentos complexos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Templates ilimitados</p>
                                        <p className="text-sm text-psi-dark/60">Acesso a todos os templates premium</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Suporte prioritário</p>
                                        <p className="text-sm text-psi-dark/60">Atendimento exclusivo e resposta rápida</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Relatórios avançados</p>
                                        <p className="text-sm text-psi-dark/60">Análises detalhadas de campanhas e engajamento</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4">
                            <p className="text-sm text-psi-dark/70 text-center">
                                <strong>Cancele quando quiser.</strong> Sem taxas de cancelamento ou compromissos longos.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setUpgradeDialog(false)}
                        >
                            Talvez depois
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                console.log("Redirecionar para checkout CRM Pro")
                                setUpgradeDialog(false)
                            }}
                            className="gap-2"
                        >
                            <Crown className="h-4 w-4" />
                            Assinar CRM Pro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={exportDialog} onOpenChange={setExportDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Exportar Lista de Clientes</DialogTitle>
                        <DialogDescription>
                            Selecione o formato e o segmento para exportar
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-3 block">Selecione o Segmento</label>
                            <Select
                                value={selectedExportSegment || "all"}
                                onValueChange={(value) => setSelectedExportSegment(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um segmento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os clientes</SelectItem>
                                    {emailSegments.map(segment => (
                                        <SelectItem key={segment.id} value={segment.id}>
                                            {segment.name} ({segment.count} clientes)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-3 block">Formato de Exportação</label>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDownload("pdf", selectedExportSegment || "all")}
                                    className="gap-2 h-auto py-3 flex-col"
                                >
                                    <FileType className="h-5 w-5" />
                                    PDF
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDownload("excel", selectedExportSegment || "all")}
                                    className="gap-2 h-auto py-3 flex-col"
                                >
                                    <FileSpreadsheet className="h-5 w-5" />
                                    Excel
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDownload("csv", selectedExportSegment || "all")}
                                    className="gap-2 h-auto py-3 flex-col"
                                >
                                    <FileDown className="h-5 w-5" />
                                    CSV
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDownload("json", selectedExportSegment || "all")}
                                    className="gap-2 h-auto py-3 flex-col"
                                >
                                    <FileJson className="h-5 w-5" />
                                    JSON
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setExportDialog(false)
                                setSelectedExportSegment("")
                            }}
                        >
                            Cancelar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={recipientsDialog.open} onOpenChange={(open) => {
                setRecipientsDialog({ open, segmentIds: [] })
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Destinatários Selecionados</DialogTitle>
                        <DialogDescription>
                            Lista de todos os clientes que receberão o e-mail
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {recipientsDialog.segmentIds.length === 0 ? (
                            <p className="text-sm text-psi-dark/60 text-center py-8">Nenhum segmento selecionado</p>
                        ) : (
                            <>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {recipientsDialog.segmentIds.map(segmentId => {
                                        const segment = emailSegments.find(s => s.id === segmentId)
                                        if (!segment) return null
                                        
                                        const segmentCustomers = segmentId === "all" 
                                            ? filteredCustomers 
                                            : segment.type === "event"
                                                ? filteredCustomers.filter(c => c.events.some(e => e.id === segmentId))
                                                : segment.type === "tag"
                                                    ? filteredCustomers.filter(c => c.tags.some(t => t.id === segmentId))
                                                    : filteredCustomers
                                        
                                        return (
                                            <div key={segmentId} className="border border-psi-dark/10 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <h4 className="font-semibold text-psi-dark">{segment.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {segment.type === "event" ? "Evento" : segment.type === "tag" ? "Tag" : "Personalizado"}
                                                    </Badge>
                                                    <span className="text-xs text-psi-dark/60">({segmentCustomers.length} clientes)</span>
                                                </div>
                                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                                    {segmentCustomers.slice(0, 50).map(customer => (
                                                        <div key={customer.id} className="flex items-center justify-between p-2 bg-psi-primary/5 rounded text-sm">
                                                            <div>
                                                                <p className="font-medium text-psi-dark">{customer.name}</p>
                                                                <p className="text-xs text-psi-dark/60">{customer.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {segmentCustomers.length > 50 && (
                                                        <p className="text-xs text-psi-dark/60 text-center pt-2">
                                                            ... e mais {segmentCustomers.length - 50} clientes
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-3">
                                    <p className="text-sm text-psi-dark/70">
                                        <strong>Total de destinatários:</strong> {
                                            recipientsDialog.segmentIds.reduce((total, segmentId) => {
                                                if (segmentId === "all") return totalCustomers
                                                const segment = emailSegments.find(s => s.id === segmentId)
                                                return total + (segment?.count || 0)
                                            }, 0)
                                        }
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRecipientsDialog({ open: false, segmentIds: [] })}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    CRMPannel
}
