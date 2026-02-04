"use client"

import { useState, useMemo, useEffect } from "react"
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
    Award,
    MailCheck,
    MailX,
    MailOpen,
    MailWarning,
    Loader2,
    Code,
    Lightbulb,
    Info,
    Headphones,
    Cpu,
    Stars,
    LayoutPanelTop,
    Settings,
    XCircle,
    AlertTriangle,
    MousePointer,
    DollarSign,
    Ticket,
    ChartArea,
    MousePointerClick
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
    DialogClose,
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
import { DialogPasswordConfirmation } from "@/components/Dialog/DialogPasswordConfirmation/DialogPasswordConfirmation"
import { MoreVertical } from "lucide-react"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTagFind } from "@/hooks/Tag/useTagFind"
import { useTagCreate } from "@/hooks/Tag/useTagCreate"
import { useTagUpdate } from "@/hooks/Tag/useTagUpdate"
import { useTagDelete } from "@/hooks/Tag/useTagDelete"
import { useTagClientCreate } from "@/hooks/TagClient/useTagClientCreate"
import { useTagClientDelete } from "@/hooks/TagClient/useTagClientDelete"
import { TagClientService } from "@/services/CRM/TagClientService"
import type { TTagClientListResponse } from "@/types/TagClient/TTagClient"
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
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import type { TCoupon } from "@/types/Coupon/TCoupon"
import type { ReactNode } from "react"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { cn } from "@/lib/utils"
import { InputMask } from "@/components/Input/InputMask"
import { useCardFindByUserId } from "@/hooks/Card/useCardFindByUserId"
import type { TCard } from "@/types/Card/TCard"
import { getCardBrand } from "@/utils/Helpers/CardUtils/CardUtils"
import { CreditCard } from "lucide-react"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useSubscriptionCreateCRMPro } from "@/hooks/Subscription/useSubscriptionCreateCRMPro"
import { useSubscriptionInfo } from "@/hooks/Subscription/useSubscriptionInfo"
import { useSubscriptionCancel } from "@/hooks/Subscription/useSubscriptionCancel"
import { useSubscriptionUpdateCreditCard } from "@/hooks/Subscription/useSubscriptionUpdateCreditCard"
import type { TCreateCRMProSubscription, TUpdateSubscriptionCreditCard } from "@/types/Subscription/TSubscription"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { useTemplateFind } from "@/hooks/Template/useTemplateFind"
import type { TTemplateResponse } from "@/types/Template/TTemplate"
import { useOpinionPollFind } from "@/hooks/OpinionPoll/useOpinionPollFind"
import type { TOpinionPoll } from "@/types/OpinionPoll/TOpinionPoll"
import { useTagFindClients } from "@/hooks/Tag/useTagFindClients"
import { useCampaignCreate } from "@/hooks/Campaign/useCampaignCreate"
import { useCampaignFind } from "@/hooks/Campaign/useCampaignFind"
import { useCampaignLogFindByCampaignId } from "@/hooks/CampaignLog/useCampaignLogFindByCampaignId"
import { useCampaignLogQuota } from "@/hooks/CampaignLog/useCampaignLogQuota"
import type { TCampaign } from "@/types/Campaign/TCampaign"
import type { TCampaignLog } from "@/types/CampaignLog/TCampaignLog"
import { useWebpushTemplateFind } from "@/hooks/WebpushTemplate/useWebpushTemplateFind"
import { useWebpushCampaignCreate } from "@/hooks/WebpushCampaign/useWebpushCampaignCreate"
import { useWebpushCampaignFind } from "@/hooks/WebpushCampaign/useWebpushCampaignFind"
import { useWebpushCampaignLogFindByCampaignId } from "@/hooks/WebpushCampaignLog/useWebpushCampaignLogFindByCampaignId"
import { useWebpushCampaignLogQuota } from "@/hooks/WebpushCampaignLog/useWebpushCampaignLogQuota"
import type { TWebpushTemplateResponse } from "@/types/Webpush/TWebpushTemplate"
import type { TWebpushCampaign } from "@/types/Webpush/TWebpushCampaign"
import type { TWebpushCampaignLog } from "@/types/Webpush/TWebpushCampaignLog"
import { DocumentUtils } from "@/utils/Helpers/DocumentUtils/DocumentUtils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useReportGet } from "@/hooks/Report/useReportGet"
import { ReportService } from "@/services/CRM/ReportService"
import type { TReportFilters } from "@/types/Report/TReport"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

type TEmailTemplate = {
    id: string
    code: string
    name: string
    subject: string
    body: string
    editableFields: string[]
    preview: string
    icon: ReactNode
    isPremium?: boolean
}

type TWebpushTemplate = {
    id: string
    code: string
    name: string
    title: string
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

const getTemplateIcon = (code: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
        "crm-template-lembrete": <Bell className="h-6 w-6" />,
        "crm-template-oferta": <Gift className="h-6 w-6" />,
        "crm-template-nutrir": <Heart className="h-6 w-6" />,
        "crm-template-pos-evento": <CheckCircle className="h-6 w-6" />,
        "crm-template-pesquisa": <ThumbsUp className="h-6 w-6" />,
        "crm-template-aniversario": <Star className="h-6 w-6" />,
        "crm-template-lancamento": <TrendingUp className="h-6 w-6" />,
        "crm-template-fidelidade": <Award className="h-6 w-6" />
    }
    return iconMap[code] || <Mail className="h-6 w-6" />
}

const getTemplateEditableFields = (code: string): string[] => {
    const fieldsMap: Record<string, string[]> = {
        "crm-template-lembrete": ["evento"],
        "crm-template-oferta": ["cupom"],
        "crm-template-nutrir": ["evento"],
        "crm-template-pos-evento": ["evento"],
        "crm-template-pesquisa": ["opinionPoll"],
        "crm-template-aniversario": [],
        "crm-template-lancamento": ["evento"],
        "crm-template-fidelidade": []
    }
    return fieldsMap[code] || []
}

const getWebpushTemplateEditableFields = (code: string): string[] => {
    const fieldsMap: Record<string, string[]> = {
        "crm-template-lembrete": ["evento"],
        "crm-template-oferta": ["cupom"],
        "crm-template-nutrir": ["evento"],
        "crm-template-pos-evento": ["evento"],
        "crm-template-pesquisa": ["evento"],
        "crm-template-aniversario": [],
        "crm-template-lancamento": ["evento"],
        "crm-template-fidelidade": []
    }
    return fieldsMap[code] || []
}

const getTemplatePreview = (code: string): string => {
    const previewMap: Record<string, string> = {
        "crm-template-lembrete": "Envie lembretes para seus clientes sobre eventos próximos",
        "crm-template-oferta": "Compartilhe ofertas e promoções especiais com cupons de desconto",
        "crm-template-nutrir": "Convide seu público a conhecer seus eventos e redes sociais",
        "crm-template-pos-evento": "Agradeça seus clientes após o evento e mantenha o relacionamento",
        "crm-template-pesquisa": "Colete feedback dos seus clientes para melhorar seus eventos",
        "crm-template-aniversario": "Parabenize clientes no aniversário com ofertas especiais",
        "crm-template-lancamento": "Anuncie novos eventos para seus clientes",
        "crm-template-fidelidade": "Recompense clientes fiéis com ofertas exclusivas"
    }
    return previewMap[code] || "Template de e-mail"
}

const getTemplateBody = (code: string): string => {
    const bodyMap: Record<string, string> = {
        "crm-template-lembrete": `
            <p>Olá {{nome}},</p>
            <p>Queremos lembrá-lo que o evento <strong>{{evento}}</strong> está chegando!</p>
            <p><strong>Data:</strong> {{data}}</p>
            <p><strong>Local:</strong> {{local}}</p>
            <p>Não perca essa oportunidade única! Garanta seu ingresso agora.</p>
            <p>Esperamos você lá!</p>
        `,
        "crm-template-oferta": `
            <p>Olá {{nome}},</p>
            <p>Temos uma oferta especial para você!</p>
            <p><strong>Código do cupom:</strong> {{cupomCodigo}}</p>
            <p><strong>Desconto:</strong> {{cupomDesconto}}</p>
            <p>{{cupomDescricao}}</p>
            <p>Aproveite essa oportunidade única!</p>
        `,
        "crm-template-nutrir": `
            <p>Olá {{nome}},</p>
            <p>Queremos convidá-lo a conhecer nossos eventos!</p>
            <p>{{eventoTexto}}</p>
            <p>Acompanhe-nos e fique por dentro de todas as novidades.</p>
        `,
        "crm-template-pos-evento": `
            <p>Olá {{nome}},</p>
            <p>Obrigado por participar do evento <strong>{{evento}}</strong>!</p>
            <p>Sua presença foi muito importante para nós.</p>
            <p>Esperamos vê-lo novamente em nossos próximos eventos!</p>
        `,
        "crm-template-pesquisa": `
            <p>Olá {{nome}},</p>
            <p>Sua opinião é muito importante para nós!</p>
            <p>Gostaríamos de saber sua experiência no evento <strong>{{evento}}</strong>.</p>
            <p>Por favor, compartilhe sua opinião clicando no link abaixo.</p>
        `,
        "crm-template-lancamento": `
            <p>Olá {{nome}},</p>
            <p>Temos uma novidade incrível para você!</p>
            <p>Acabamos de lançar o evento <strong>{{evento}}</strong>.</p>
            <p><strong>Data:</strong> {{data}}</p>
            <p><strong>Local:</strong> {{local}}</p>
            <p>Garanta seu ingresso com antecedência e aproveite!</p>
        `
    }
    return bodyMap[code] || "<p>Olá {{nome}},</p><p>Este é um template de e-mail personalizado.</p>"
}

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

const TagValidator = z.object({
    name: z.string().min(1, { error: "O nome da tag é obrigatório" }).max(50, { error: "O nome da tag deve ter no máximo 50 caracteres" }),
    color: z.string().min(1, { error: "A cor é obrigatória" }),
    automationRules: z.object({
        eventId: z.string().optional(),
        eventCategoryId: z.string().optional(),
        minTotalSpent: z.number().min(0, { error: "O valor mínimo deve ser maior ou igual a 0" }).optional(),
        minTicketsCount: z.number().int().min(1, { error: "A quantidade mínima deve ser maior que 0" }).optional(),
        purchaseDateFrom: z.string().optional(),
        purchaseDateTo: z.string().optional()
    }).optional()
})

const ObservationValidator = z.object({
    text: z.string().min(1, { error: "A observação é obrigatória" }).max(600, { error: "A observação deve ter no máximo 600 caracteres" })
})

const EmailSendValidator = z.object({
    name: z.string().max(255).optional(),
    templateId: z.string().min(1, { error: "Selecione um template" }),
    segments: z.array(z.string()).min(1, { error: "Selecione pelo menos um segmento" }),
    templateFields: z.record(z.string(), z.string()).optional()
})

const WebpushSendValidator = z.object({
    name: z.string().max(255).optional(),
    templateId: z.string().min(1, { error: "Selecione um template" }),
    segments: z.array(z.string()).min(1, { error: "Selecione pelo menos um segmento" }),
    templateFields: z.record(z.string(), z.string()).optional()
})

type TTagForm = z.infer<typeof TagValidator>
type TObservationForm = z.infer<typeof ObservationValidator>
type TEmailSendForm = z.infer<typeof EmailSendValidator>
type TWebpushSendForm = z.infer<typeof WebpushSendValidator>

const CRMPannel = () => {
    const { data: templatesData, isLoading: templatesLoading } = useTemplateFind()
    const templates = templatesData?.data || []
    const { data: webpushTemplatesData, isLoading: webpushTemplatesLoading } = useWebpushTemplateFind()
    const webpushTemplatesRaw = webpushTemplatesData?.data || []
    
    const emailTemplates = useMemo<TEmailTemplate[]>(() => {
        return templates.map((template: TTemplateResponse) => ({
            id: template.id,
            code: template.code,
            name: template.name,
            subject: template.subject,
            body: getTemplateBody(template.code),
            editableFields: getTemplateEditableFields(template.code),
            preview: getTemplatePreview(template.code),
            icon: getTemplateIcon(template.code),
            isPremium: template.plan === "PRO"
        }))
    }, [templates])

    const webpushTemplates = useMemo<TWebpushTemplate[]>(() => {
        return webpushTemplatesRaw.map((template: TWebpushTemplateResponse) => ({
            id: template.id,
            code: template.code,
            name: template.name,
            title: template.title,
            body: template.body,
            editableFields: getWebpushTemplateEditableFields(template.code),
            preview: getTemplatePreview(template.code),
            icon: getTemplateIcon(template.code),
            isPremium: template.plan === "PRO"
        }))
    }, [webpushTemplatesRaw])
    
    const [campaignsPage, setCampaignsPage] = useState(1)
    const campaignsOffset = (campaignsPage - 1) * 50
    
    const { data: campaignsData, isLoading: campaignsLoading, refetch: refetchCampaigns } = useCampaignFind({
        offset: campaignsOffset
    })
    const campaigns = campaignsData?.data?.data || []

    const [webpushCampaignsPage, setWebpushCampaignsPage] = useState(1)
    const webpushCampaignsOffset = (webpushCampaignsPage - 1) * 50
    const { data: webpushCampaignsData, isLoading: webpushCampaignsLoading, refetch: refetchWebpushCampaigns } = useWebpushCampaignFind({
        offset: webpushCampaignsOffset
    })
    const webpushCampaigns = webpushCampaignsData?.data?.data || []
    
    const { user, setUser } = useAuthStore()
    const organizer = useMemo(() => {
        return user?.Organizer || null
    }, [user])

    const isPro = useMemo(() => {
        return organizer?.crmPlan === "PRO"
    }, [organizer?.crmPlan])

    const { data: quotaData, refetch: refetchQuota } = useCampaignLogQuota()
    const { data: webpushQuotaData, refetch: refetchWebpushQuota } = useWebpushCampaignLogQuota()
    const emailUsed = quotaData?.data?.sentCount || 0
    const emailLimit = isPro ? 5000 : 100
    const emailRemaining = quotaData?.data?.remainingQuota || 0
    const webpushUsed = webpushQuotaData?.data?.sentCount || 0
    const webpushLimit = isPro ? 5000 : 100
    const webpushRemaining = webpushQuotaData?.data?.remainingQuota || 0
    
    const { mutateAsync: createCampaign, isPending: isCreatingCampaign } = useCampaignCreate()
    const { mutateAsync: createWebpushCampaign, isPending: isCreatingWebpushCampaign } = useWebpushCampaignCreate()
    
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined)
    const { data: campaignLogsData, isLoading: campaignLogsLoading } = useCampaignLogFindByCampaignId(selectedCampaignId)
    const campaignLogs = campaignLogsData?.data || []

    const [selectedWebpushCampaignId, setSelectedWebpushCampaignId] = useState<string | undefined>(undefined)
    const { data: webpushCampaignLogsData, isLoading: webpushCampaignLogsLoading } = useWebpushCampaignLogFindByCampaignId(selectedWebpushCampaignId)
    const webpushCampaignLogs = webpushCampaignLogsData?.data || []
    
    const { data: eventsData } = useEventCache()
    const events = eventsData?.data || []
    
    const { data: categoriesData } = useEventCategoryFind()
    const categories = categoriesData?.data || []
    
    const { data: couponsData } = useCouponFind()
    const coupons = couponsData?.data || []

    const { data: opinionPollsData, isLoading: opinionPollsLoading } = useOpinionPollFind()
    const opinionPolls = opinionPollsData?.data || []

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
    const [searchInput, setSearchInput] = useState<string>("")
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

    const [webpushDialog, setWebpushDialog] = useState<{
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

    const [webpushHistoryDialog, setWebpushHistoryDialog] = useState<{
        open: boolean
        webpushId?: string
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
    const [activeTab, setActiveTab] = useState<"customers" | "tags" | "emails" | "webpush" | "plan">("customers")
    const [planDialog, setPlanDialog] = useState(false)
    const [cancelSubscriptionDialog, setCancelSubscriptionDialog] = useState(false)
    const [passwordConfirmationDialog, setPasswordConfirmationDialog] = useState(false)
    const [updateCardDialog, setUpdateCardDialog] = useState(false)
    const [selectedCardIdForUpdate, setSelectedCardIdForUpdate] = useState<string | null>(null)
    const [showNewCardFormForUpdate, setShowNewCardFormForUpdate] = useState(false)
    const [cardDataForUpdate, setCardDataForUpdate] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    })
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
    const [reportsDialog, setReportsDialog] = useState(false)
    const [reportsProDialog, setReportsProDialog] = useState(false)
    const [reportFilters, setReportFilters] = useState<TReportFilters>({})
    const [reportDateFrom, setReportDateFrom] = useState<string | null>(null)
    const [reportDateTo, setReportDateTo] = useState<string | null>(null)
    const [selectedReportTags, setSelectedReportTags] = useState<string[]>([])
    const [selectedReportEvents, setSelectedReportEvents] = useState<string[]>([])
    const [isDownloadingReport, setIsDownloadingReport] = useState(false)
    const [selectedReportYear, setSelectedReportYear] = useState<string>(new Date().getFullYear().toString())
    const [selectedStatsMonth, setSelectedStatsMonth] = useState<string>("")
    const [selectedStatsYear, setSelectedStatsYear] = useState<string>(new Date().getFullYear().toString())
    const [engagementDialog, setEngagementDialog] = useState(false)
    
    const { data: reportData, isLoading: reportLoading } = useReportGet(reportFilters)
    
    const filteredCustomerEntries = useMemo(() => {
        if (!reportData) return []
        return reportData.customerEntries.filter(entry => entry.year.toString() === selectedReportYear)
    }, [reportData, selectedReportYear])
    
    const availableYears = useMemo(() => {
        if (!reportData) return []
        const years = [...new Set(reportData.customerEntries.map(entry => entry.year))]
        return years.sort((a, b) => b - a)
    }, [reportData])
    
    const availableStatsMonths = useMemo(() => {
        if (!reportData) return []
        const months = [...new Set(reportData.campaignStatsOverTime.filter(stat => stat.year.toString() === selectedStatsYear).map(stat => stat.month))]
        return months.sort((a, b) => {
            const monthOrder = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
            return monthOrder.indexOf(a) - monthOrder.indexOf(b)
        })
    }, [reportData, selectedStatsYear])
    
    useEffect(() => {
        if (reportData && availableStatsMonths.length > 0 && !selectedStatsMonth) {
            setSelectedStatsMonth(availableStatsMonths[0])
        }
    }, [reportData, availableStatsMonths, selectedStatsMonth])
    
    const filteredCampaignStats = useMemo(() => {
        if (!reportData || !selectedStatsMonth) return []
        return reportData.campaignStatsOverTime.filter(stat => {
            const matchesYear = stat.year.toString() === selectedStatsYear
            const matchesMonth = stat.month === selectedStatsMonth
            return matchesYear && matchesMonth
        })
    }, [reportData, selectedStatsMonth, selectedStatsYear])
    
    const availableStatsYears = useMemo(() => {
        if (!reportData) return []
        const years = [...new Set(reportData.campaignStatsOverTime.map(stat => stat.year))]
        return years.sort((a, b) => b - a)
    }, [reportData])
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [showNewCardForm, setShowNewCardForm] = useState(false)
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    })
    const [selectedTemplate, setSelectedTemplate] = useState<TEmailTemplate | null>(null)
    const [selectedEventForTemplate, setSelectedEventForTemplate] = useState<string>("")
    const [selectedCouponForTemplate, setSelectedCouponForTemplate] = useState<string>("")
    const [selectedOpinionPollForTemplate, setSelectedOpinionPollForTemplate] = useState<string>("")
    const [selectedWebpushTemplate, setSelectedWebpushTemplate] = useState<TWebpushTemplate | null>(null)
    const [selectedEventForWebpushTemplate, setSelectedEventForWebpushTemplate] = useState<string>("")
    const [selectedCouponForWebpushTemplate, setSelectedCouponForWebpushTemplate] = useState<string>("")
    const [viewTagClientsDialog, setViewTagClientsDialog] = useState<{
        open: boolean
        tagId?: string
        tagName?: string
    }>({
        open: false
    })
    const [selectedTagIdForClients, setSelectedTagIdForClients] = useState<string | undefined>(undefined)
    const [exportDialog, setExportDialog] = useState(false)
    const [selectedExportSegment, setSelectedExportSegment] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState<"pdf" | "xlsx" | "csv" | "json" | null>(null)
    const [viewSegmentCustomersDialog, setViewSegmentCustomersDialog] = useState(false)
    const [recipientsDialog, setRecipientsDialog] = useState<{
        open: boolean
        segmentIds: string[]
    }>({
        open: false,
        segmentIds: []
    })
    const [emailPreviewDialog, setEmailPreviewDialog] = useState(false)
    const [emailSuccessDialog, setEmailSuccessDialog] = useState(false)
    const [webpushSuccessDialog, setWebpushSuccessDialog] = useState(false)
    const [reportsSheetOpen, setReportsSheetOpen] = useState(false)

    const tagLimit = 200
    const tagsUsed = tags.length

    const { data: cardsData, isLoading: isLoadingCards } = useCardFindByUserId({
        enabled: upgradeDialog || updateCardDialog
    })
    
    const cards = useMemo(() => {
        return cardsData?.data || []
    }, [cardsData?.data])

    const { data: subscriptionInfoData, isLoading: isLoadingSubscriptionInfo, refetch: refetchSubscriptionInfo } = useSubscriptionInfo()
    
    const subscriptionInfo = useMemo(() => {
        if (!subscriptionInfoData?.data) return null
        if (Array.isArray(subscriptionInfoData.data) && subscriptionInfoData.data.length > 0) {
            return subscriptionInfoData.data[0]
        }
        return null
    }, [subscriptionInfoData])

    const { mutateAsync: createCRMProSubscription, isPending: isCreatingSubscription } = useSubscriptionCreateCRMPro()
    const { mutateAsync: cancelSubscription, isPending: isCancellingSubscription } = useSubscriptionCancel()
    const { mutateAsync: updateCreditCard, isPending: isUpdatingCreditCard } = useSubscriptionUpdateCreditCard()

    const cardBrand = useMemo(() => {
        return getCardBrand(cardData.number)
    }, [cardData.number])

    const cardBrandForUpdate = useMemo(() => {
        return getCardBrand(cardDataForUpdate.number)
    }, [cardDataForUpdate.number])

    const getCardBrandIcon = (brand: string | null | undefined): string => {
        if (!brand) return "/icons/payment/card-brand/card-unknown.png"
        const brandLower = brand.toLowerCase()
        const brandMap: Record<string, string> = {
            amex: "card-amex.png",
            discover: "card-discover.png",
            hipercard: "card-hipercard.png",
            jcb: "card-jcb.png",
            mastercard: "card-master.png",
            visa: "card-visa.png",
            elo: "card-elo.png",
            cabal: "card-cabal.png",
            banescard: "card-banescard.png",
        }
        const iconName = brandMap[brandLower] || "card-unknown.png"
        return `/icons/payment/card-brand/${iconName}`
    }

    useEffect(() => {
        if (upgradeDialog && cards.length > 0 && !selectedCardId && !showNewCardForm) {
            setSelectedCardId(cards[0].id)
        }
    }, [upgradeDialog, cards, selectedCardId, showNewCardForm])

    const handleUpgradeSubmit = async () => {
        try {
            let payload: TCreateCRMProSubscription

            if (selectedCardId) {
                payload = {
                    creditCardToken: selectedCardId
                }
            } else {
                if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
                    Toast.error("Por favor, preencha todos os campos do cartão de crédito ou selecione um cartão cadastrado.")
                    return
                }

                if (!user) {
                    Toast.error("Erro ao obter informações do usuário")
                    return
                }

                if (!user.Address) {
                    Toast.error("Por favor, complete seu endereço no perfil antes de assinar o CRM Pro")
                    return
                }

                if (!user.document) {
                    Toast.error("Por favor, complete seu documento no perfil antes de assinar o CRM Pro")
                    return
                }

                if (!user.phone) {
                    Toast.error("Por favor, complete seu telefone no perfil antes de assinar o CRM Pro")
                    return
                }

                const [expMonth, expYear] = cardData.expiry.split("/")
                const cardNumber = cardData.number.replace(/\s/g, "")
                const zipCode = user.Address.zipCode.replace(/\D/g, "")
                const document = user.document.replace(/\D/g, "")
                const phone = user.phone.replace(/\D/g, "")

                payload = {
                    creditCard: {
                        holderName: cardData.name,
                        number: cardNumber,
                        expiryMonth: expMonth,
                        expiryYear: `20${expYear}`,
                        ccv: cardData.cvv
                    },
                    creditCardHolderInfo: {
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                        cpfCnpj: document,
                        postalCode: zipCode,
                        addressNumber: user.Address.number || "",
                        phone: phone,
                        addressComplement: user.Address.complement || undefined
                    }
                }
            }

            await createCRMProSubscription(payload)
            
            if (user) {
                const updatedUser = { ...user }
                if (updatedUser.Organizer) {
                    updatedUser.Organizer.crmPlan = "PRO"
                    setUser(updatedUser)
                }
            }
            
            Toast.success("Assinatura do CRM Pro criada com sucesso!")
            setUpgradeDialog(false)
            setSelectedCardId(null)
            setShowNewCardForm(false)
            setCardData({ number: "", name: "", expiry: "", cvv: "" })
        } catch (error: any) {
            console.error("Erro ao criar assinatura do CRM Pro:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar assinatura do CRM Pro"
            Toast.error(errorMessage)
        }
    }


    const tagForm = useForm<TTagForm>({
        resolver: zodResolver(TagValidator),
        defaultValues: {
            name: "",
            color: "#6C4BFF",
            automationRules: undefined
        }
    })

    const [enableAutomation, setEnableAutomation] = useState(false)

    const observationForm = useForm<TObservationForm>({
        resolver: zodResolver(ObservationValidator),
        defaultValues: {
            text: ""
        }
    })

    const emailForm = useForm<TEmailSendForm>({
        resolver: zodResolver(EmailSendValidator),
        defaultValues: {
            name: "",
            templateId: "",
            segments: [],
            templateFields: {}
        }
    })

    const webpushForm = useForm<TWebpushSendForm>({
        resolver: zodResolver(WebpushSendValidator),
        defaultValues: {
            name: "",
            templateId: "",
            segments: [],
            templateFields: {}
        }
    })

    const limit = 50
    const offset = (currentPage - 1) * limit

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput)
            setCurrentPage(1)
        }, 2500)

        return () => {
            clearTimeout(timer)
        }
    }, [searchInput])

    const searchQuery = useMemo(() => {
        const parts: string[] = []
        if (search) parts.push(search)
        return parts.join(" ") || undefined
    }, [search])

    const { data: customersData, isLoading: customersLoading, refetch: refetchCustomers } = useOrganizerFindClientsCrm({
        offset,
        search: searchQuery,
        tagId: filters.tagId,
        eventId: filters.eventId
    })

    const customers = customersData?.data?.data || []
    const totalCustomers = customersData?.data?.total || 0
    const totalFiltered = customersData?.data?.totalFiltered || 0
    const totalPages = Math.ceil(totalFiltered / limit)

    const { data: tagClientsData, isLoading: tagClientsLoading } = useTagFindClients(selectedTagIdForClients)
    const tagClients = tagClientsData?.data || []

    const emailSegments = useMemo<TEmailSegment[]>(() => {
        const segments: TEmailSegment[] = [
            {
                id: "all",
                name: "Todos os clientes",
                type: "custom",
                description: "Todos os clientes que já compraram ingressos",
                count: totalCustomers
            }
        ]
        
        tags.forEach(tag => {
            const clientsWithTag = customers.filter(c => c.tags.some(t => t.id === tag.id)).length
            segments.push({
                id: tag.id,
                name: tag.name,
                type: "tag",
                description: `Clientes com a tag ${tag.name}`,
                count: clientsWithTag
            })
        })
        
        return segments
    }, [tags, customers, totalCustomers])

    const toggleRow = (customerId: string) => {
        setOpenRows(prev => ({
            ...prev,
            [customerId]: !prev[customerId]
        }))
    }

    const handleCreateTag = async (data: TTagForm) => {
        try {
            const tagData: any = {
                name: data.name,
                color: data.color
            }
            
            if (data.automationRules) {
                const rules: any = {}
                if (data.automationRules.eventId) rules.eventId = data.automationRules.eventId
                if (data.automationRules.eventCategoryId) rules.eventCategoryId = data.automationRules.eventCategoryId
                if (data.automationRules.minTotalSpent !== undefined) rules.minTotalSpent = data.automationRules.minTotalSpent
                if (data.automationRules.minTicketsCount !== undefined) rules.minTicketsCount = data.automationRules.minTicketsCount
                if (data.automationRules.purchaseDateFrom) rules.purchaseDateFrom = data.automationRules.purchaseDateFrom
                if (data.automationRules.purchaseDateTo) rules.purchaseDateTo = data.automationRules.purchaseDateTo
                
                if (Object.keys(rules).length > 0) {
                    tagData.automationRules = rules
                }
            }
            
            console.log(tagData)
            await createTag(tagData)
            setTagDialog({ open: false, mode: "create" })
            tagForm.reset()
            setEnableAutomation(false)
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
            
            if (tag.automationRules) {
                setEnableAutomation(true)
                tagForm.setValue("automationRules", {
                    eventId: tag.automationRules.eventId,
                    eventCategoryId: tag.automationRules.eventCategoryId,
                    minTotalSpent: tag.automationRules.minTotalSpent,
                    minTicketsCount: tag.automationRules.minTicketsCount,
                    purchaseDateFrom: tag.automationRules.purchaseDateFrom,
                    purchaseDateTo: tag.automationRules.purchaseDateTo
                })
            } else {
                setEnableAutomation(false)
                tagForm.setValue("automationRules", undefined)
            }
            
            setTagDialog({ open: true, mode: "edit", tagId })
        }
    }

    const handleUpdateTag = async (data: TTagForm) => {
        if (tagDialog.tagId) {
            try {
                const updateData: {
                    name?: string
                    color?: string
                    automationRules?: {
                        eventId?: string
                        eventCategoryId?: string
                        minTotalSpent?: number
                        minTicketsCount?: number
                        purchaseDateFrom?: string
                        purchaseDateTo?: string
                    } | null
                } = {
                    name: data.name,
                    color: data.color
                }

                if (enableAutomation && data.automationRules) {
                    updateData.automationRules = {
                        eventId: data.automationRules.eventId,
                        eventCategoryId: data.automationRules.eventCategoryId,
                        minTotalSpent: data.automationRules.minTotalSpent,
                        minTicketsCount: data.automationRules.minTicketsCount,
                        purchaseDateFrom: data.automationRules.purchaseDateFrom,
                        purchaseDateTo: data.automationRules.purchaseDateTo
                    }
                } else {
                    updateData.automationRules = null
                }

                await updateTag({ id: tagDialog.tagId, data: updateData })
                setTagDialog({ open: false, mode: "create" })
                tagForm.reset()
                setEnableAutomation(false)
                Toast.success("Tag atualizada com sucesso")
            } catch (error) {
                console.error("Erro ao atualizar tag:", error)
            }
        }
    }

    const handleDeleteTag = (tagId: string) => {
        const tag = tags.find(t => t.id === tagId)
        if (tag) {
            const customersWithTag = totalFiltered
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

    const handleSendEmail = async (data: TEmailSendForm) => {
        try {
            const tagIds = data.segments.includes("all") ? ["all"] : data.segments.filter(id => id !== "all")
            
            const campaignData: any = {
                templateId: data.templateId,
                tagIds
            }
            if (data.name?.trim()) {
                campaignData.name = data.name.trim()
            }

            if (selectedTemplate) {
                if (selectedTemplate.code === "crm-template-pesquisa" && selectedOpinionPollForTemplate) {
                    campaignData.opinionPollId = selectedOpinionPollForTemplate
                    const selectedPoll = opinionPolls.find((p: TOpinionPoll) => p.id === selectedOpinionPollForTemplate)
                    if (selectedPoll?.eventId) {
                        campaignData.eventId = selectedPoll.eventId
                    }
                }
                
                if (selectedTemplate.code === "crm-template-oferta") {
                    const couponId = selectedCouponForTemplate || data.templateFields?.cupom
                    if (couponId) {
                        campaignData.couponId = couponId
                        const selectedCoupon = coupons.find((c: TCoupon) => c.id === couponId)
                        if (selectedCoupon?.eventId) {
                            campaignData.eventId = selectedCoupon.eventId
                        }
                    }
                }
                
                if (selectedTemplate.code !== "crm-template-pesquisa" && selectedTemplate.code !== "crm-template-oferta" && selectedEventForTemplate) {
                    campaignData.eventId = selectedEventForTemplate
                }
            }
            
            await createCampaign(campaignData)
            
            setEmailDialog({ open: false })
            emailForm.reset()
            setSelectedTemplate(null)
            setSelectedEventForTemplate("")
            setSelectedCouponForTemplate("")
            setSelectedOpinionPollForTemplate("")
            
            await refetchCampaigns()
            await refetchQuota()
            
            setEmailSuccessDialog(true)
            Toast.success("Campanha de e-mail criada com sucesso!")
        } catch (error: any) {
            console.error("Erro ao criar campanha:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar campanha de e-mail"
            Toast.error(errorMessage)
        }
    }

    const handleSendWebpush = async (data: TWebpushSendForm) => {
        try {
            const tagIds = data.segments.includes("all") ? ["all"] : data.segments.filter(id => id !== "all")
            const campaignData: any = {
                templateId: data.templateId,
                tagIds
            }
            if (data.name?.trim()) {
                campaignData.name = data.name.trim()
            }

            if (selectedWebpushTemplate) {
                if (selectedWebpushTemplate.code === "crm-template-oferta") {
                    const couponId = selectedCouponForWebpushTemplate || data.templateFields?.cupom
                    if (couponId) {
                        campaignData.couponId = couponId
                        const selectedCoupon = coupons.find((c: TCoupon) => c.id === couponId)
                        if (selectedCoupon?.eventId) {
                            campaignData.eventId = selectedCoupon.eventId
                        }
                    }
                } else if (selectedEventForWebpushTemplate) {
                    campaignData.eventId = selectedEventForWebpushTemplate
                }
            }

            await createWebpushCampaign(campaignData)

            setWebpushDialog({ open: false })
            webpushForm.reset()
            setSelectedWebpushTemplate(null)
            setSelectedEventForWebpushTemplate("")
            setSelectedCouponForWebpushTemplate("")

            await refetchWebpushCampaigns()
            await refetchWebpushQuota()

            setWebpushSuccessDialog(true)
            Toast.success("Campanha de webpush criada com sucesso!")
        } catch (error: any) {
            console.error("Erro ao criar campanha de webpush:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar campanha de webpush"
            Toast.error(errorMessage)
        }
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

    const handleWebpushTemplateSelect = (templateId: string) => {
        const template = webpushTemplates.find(t => t.id === templateId)
        if (template) {
            if (template.isPremium && !isPro) {
                setUpgradeDialog(true)
                return
            }
            setSelectedWebpushTemplate(template)
            webpushForm.setValue("templateId", template.id)
            setSelectedEventForWebpushTemplate("")
            setSelectedCouponForWebpushTemplate("")
            const fields: Record<string, string> = {}
            template.editableFields.forEach(field => {
                fields[field] = ""
            })
            webpushForm.setValue("templateFields", fields)
        }
    }

    const getPreviewBody = () => {
        if (!selectedTemplate) return ""
        let preview = getTemplateBody(selectedTemplate.code)
        const selectedEvent = events.find(e => e.id === selectedEventForTemplate)
        const selectedCoupon = coupons.find((c: TCoupon) => c.id === selectedCouponForTemplate)
        const selectedPoll = opinionPolls.find((p: TOpinionPoll) => p.id === selectedOpinionPollForTemplate)
        
        preview = preview.replace(/\{\{nome\}\}/g, "{\{nome\}\}")
        
        if (selectedEvent) {
            preview = preview.replace(/\{\{evento\}\}/g, selectedEvent.name)
            const firstDate = selectedEvent.EventDates?.[0]
            const dateText = firstDate?.date 
                ? new Date(firstDate.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "[Data do evento]"
            const eventDescription = `Confira o evento "${selectedEvent.name}" que acontecerá em ${dateText}.`
            preview = preview.replace(/\[Descrição do evento\]/g, eventDescription)
            if (firstDate?.date) {
                preview = preview.replace(/\{\{data\}\}/g, dateText)
            } else {
                preview = preview.replace(/\{\{data\}\}/g, "[Data do evento]")
            }
            const locationText = selectedEvent.location || "Local ainda não definido"
            preview = preview.replace(/\{\{local\}\}/g, locationText)
        } else if (selectedPoll) {
            const eventName = selectedPoll.event.name.split(" -")[0].trim()
            preview = preview.replace(/\{\{evento\}\}/g, eventName)
            preview = preview.replace(/\[Selecione um evento\]/g, eventName)
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
        
        if (selectedTemplate.code === "crm-template-nutrir" && selectedEvent) {
            const firstDate = selectedEvent.EventDates?.[0]
            const dateText = firstDate?.date 
                ? new Date(firstDate.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "[Data do evento]"
            const eventDescription = `Confira o evento "${selectedEvent.name}" que acontecerá em ${dateText}.`
            preview = preview.replace(/\{\{eventoTexto\}\}/g, eventDescription)
            preview = preview.replace(/\[Descrição do evento\]/g, eventDescription)
        } else if (selectedTemplate.code === "crm-template-nutrir") {
            preview = preview.replace(/\{\{eventoTexto\}\}/g, "[Descrição do evento]")
        }
        
        if (selectedTemplate.code === "crm-template-pesquisa" && selectedPoll) {
            const eventName = selectedPoll.event.name.split(" -")[0].trim()
            preview = preview.replace(/\[Selecione um evento\]/g, eventName)
            preview = preview.replace(/\{\{evento\}\}/g, eventName)
        } else if (selectedTemplate.code === "crm-template-pesquisa") {
            preview = preview.replace(/\[Selecione um evento\]/g, "[Selecione um evento]")
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

    const formatWebpushPreviewText = (text: string) => {
        let preview = text
        const selectedEvent = events.find(e => e.id === selectedEventForWebpushTemplate)
        const selectedCoupon = coupons.find((c: TCoupon) => c.id === selectedCouponForWebpushTemplate)
        const eventFromCoupon = selectedCoupon?.eventId ? events.find(e => e.id === selectedCoupon.eventId) : null
        const eventForPreview = selectedEvent ?? eventFromCoupon ?? null

        preview = preview.replace(/\{\{nome\}\}/g, "Cliente")

        if (eventForPreview) {
            preview = preview.replace(/\{\{evento\}\}/g, eventForPreview.name)
            const firstDate = eventForPreview.EventDates?.[0]
            const dateText = firstDate?.date
                ? new Date(firstDate.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "[Data do evento]"
            preview = preview.replace(/\{\{data\}\}/g, dateText)
            preview = preview.replace(/\{\{eventoTexto\}\}/g, `Confira o evento "${eventForPreview.name}" em ${dateText}.`)
        } else {
            preview = preview.replace(/\{\{evento\}\}/g, "[Selecione um evento]")
            preview = preview.replace(/\{\{data\}\}/g, "[Data do evento]")
            preview = preview.replace(/\{\{eventoTexto\}\}/g, "[Descrição do evento]")
        }

        if (selectedCoupon) {
            const discountText = selectedCoupon.discountType === "PERCENTAGE"
                ? `${selectedCoupon.discountValue}%`
                : `${ValueUtils.centsToCurrency(selectedCoupon.discountValue)}`
            preview = preview.replace(/\{\{cupomCodigo\}\}/g, selectedCoupon.code)
            preview = preview.replace(/\{\{cupomDesconto\}\}/g, discountText)
        } else {
            preview = preview.replace(/\{\{cupomCodigo\}\}/g, "[Código do cupom]")
            preview = preview.replace(/\{\{cupomDesconto\}\}/g, "[Desconto]")
        }

        return preview
    }

    const getWebpushPreviewTitle = () => {
        if (!selectedWebpushTemplate) return ""
        return formatWebpushPreviewText(selectedWebpushTemplate.title)
    }

    const getWebpushPreviewBody = () => {
        if (!selectedWebpushTemplate) return ""
        return formatWebpushPreviewText(selectedWebpushTemplate.body)
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

    const formatClientName = (client: TTagClientListResponse): string => {
        return `${client.firstName} ${client.lastName}`.trim()
    }

    const formatClientAddress = (client: TTagClientListResponse): string => {
        if (!client.address) return "-"
        const addr = client.address
        const parts: string[] = []
        if (addr.street) parts.push(addr.street)
        if (addr.number) parts.push(addr.number)
        if (addr.complement) parts.push(addr.complement)
        if (addr.neighborhood) parts.push(addr.neighborhood)
        if (addr.city) parts.push(addr.city)
        if (addr.state) parts.push(addr.state)
        if (addr.zipCode) parts.push(addr.zipCode)
        return parts.length > 0 ? parts.join(", ") : "-"
    }

    const formatEvents = (client: TTagClientListResponse): string => {
        if (!client.events || client.events.length === 0) return "-"
        const uniqueEventNames = [...new Set(client.events.map(e => e.eventName))]
        return uniqueEventNames.join(", ")
    }

    const formatLastPurchaseDate = (lastPurchaseDate: string | null): string => {
        if (!lastPurchaseDate) return "-"
        if (lastPurchaseDate.includes("/")) {
            return lastPurchaseDate
        }
        try {
            return DateUtils.formatDate(lastPurchaseDate, "DD/MM/YYYY")
        } catch {
            return lastPurchaseDate
        }
    }

    const generatePDF = (clients: TTagClientListResponse[], tagName: string) => {
        const doc = new jsPDF("landscape", "mm", "a4")
        
        doc.setFontSize(16)
        doc.text("Lista de Clientes", 14, 15)
        
        doc.setFontSize(10)
        doc.text(`Tag: ${tagName}`, 14, 22)
        doc.text(`Data de geração: ${DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm")}`, 14, 27)
        doc.text(`Total de clientes: ${clients.length}`, 14, 32)

        const tableData = clients.map((client, index) => [
            (index + 1).toString(),
            formatClientName(client),
            client.email || "-",
            client.phone || "-",
            client.document || "-",
            client.nationality || "-",
            client.birth ? DateUtils.formatDate(client.birth, "DD/MM/YYYY") : "-",
            formatClientAddress(client),
            formatEvents(client),
            client.totalPurchases.toString(),
            ValueUtils.centsToCurrency(client.totalSpent),
            formatLastPurchaseDate(client.lastPurchaseDate),
            client.lastPurchaseTime || "-"
        ])

        autoTable(doc, {
            startY: 38,
            head: [["#", "Nome", "E-mail", "Telefone", "Documento", "Nacionalidade", "Nascimento", "Endereço", "Eventos", "Compras", "Total Gasto", "Última Compra", "Hora"]],
            body: tableData,
            styles: { 
                fontSize: 7,
                cellPadding: 1.5,
                overflow: "linebreak",
                cellWidth: "wrap",
                lineWidth: 0.1,
                lineColor: [200, 200, 200],
                textColor: [0, 0, 0]
            },
            headStyles: { 
                fillColor: [108, 75, 255],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 7,
                cellPadding: 2
            },
            columnStyles: {
                0: { cellWidth: 8, halign: "center" },
                1: { cellWidth: 28 },
                2: { cellWidth: 32 },
                3: { cellWidth: 22 },
                4: { cellWidth: 22 },
                5: { cellWidth: 18 },
                6: { cellWidth: 18 },
                7: { cellWidth: 35 },
                8: { cellWidth: 35 },
                9: { cellWidth: 12, halign: "center" },
                10: { cellWidth: 18, halign: "right" },
                11: { cellWidth: 18 },
                12: { cellWidth: 12 }
            },
            margin: { left: 10, right: 10, top: 38 },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            },
            showHead: "everyPage",
            showFoot: "never"
        })

        const fileName = `lista-clientes-${tagName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.pdf`
        doc.save(fileName)
        
        Toast.success("PDF gerado com sucesso!")
    }

    const generateXLSX = (clients: TTagClientListResponse[], tagName: string) => {
        const worksheetData: any[] = []

        worksheetData.push(["Lista de Clientes"])
        worksheetData.push([])
        worksheetData.push(["Tag", tagName])
        worksheetData.push(["Data de geração", DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm")])
        worksheetData.push(["Total de clientes", clients.length])
        worksheetData.push([])

        const headers = ["#", "Nome", "E-mail", "Telefone", "Documento", "Nacionalidade", "Nascimento", "Endereço", "Eventos", "Compras", "Total Gasto", "Última Compra", "Hora"]
        worksheetData.push(headers)

        clients.forEach((client, index) => {
            worksheetData.push([
                index + 1,
                formatClientName(client),
                client.email || "-",
                client.phone || "-",
                client.document || "-",
                client.nationality || "-",
                client.birth ? DateUtils.formatDate(client.birth, "DD/MM/YYYY") : "-",
                formatClientAddress(client),
                formatEvents(client),
                client.totalPurchases,
                ValueUtils.centsToCurrency(client.totalSpent),
                formatLastPurchaseDate(client.lastPurchaseDate),
                client.lastPurchaseTime || "-"
            ])
        })

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

        const columnWidths = [
            { wch: 5 },
            { wch: 30 },
            { wch: 35 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 50 },
            { wch: 50 },
            { wch: 10 },
            { wch: 15 },
            { wch: 15 },
            { wch: 10 }
        ]
        worksheet["!cols"] = columnWidths

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes")

        const fileName = `lista-clientes-${tagName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.xlsx`
        XLSX.writeFile(workbook, fileName)
        
        Toast.success("Arquivo Excel gerado com sucesso!")
    }

    const escapeCSVField = (field: string): string => {
        if (field.includes(",") || field.includes('"') || field.includes("\n")) {
            return `"${field.replace(/"/g, '""')}"`
        }
        return field
    }

    const generateCSV = (clients: TTagClientListResponse[], tagName: string) => {
        const csvRows: string[] = []

        csvRows.push("Lista de Clientes")
        csvRows.push("")
        csvRows.push(`Tag,${escapeCSVField(tagName)}`)
        csvRows.push(`Data de geração,${escapeCSVField(DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm"))}`)
        csvRows.push(`Total de clientes,${clients.length}`)
        csvRows.push("")

        const headers = ["#", "Nome", "E-mail", "Telefone", "Documento", "Nacionalidade", "Nascimento", "Endereço", "Eventos", "Compras", "Total Gasto", "Última Compra", "Hora"]
        csvRows.push(headers.map(escapeCSVField).join(","))

        clients.forEach((client, index) => {
            const row = [
                (index + 1).toString(),
                formatClientName(client),
                client.email || "-",
                client.phone || "-",
                client.document || "-",
                client.nationality || "-",
                client.birth ? DateUtils.formatDate(client.birth, "DD/MM/YYYY") : "-",
                formatClientAddress(client),
                formatEvents(client),
                client.totalPurchases.toString(),
                ValueUtils.centsToCurrency(client.totalSpent),
                formatLastPurchaseDate(client.lastPurchaseDate),
                client.lastPurchaseTime || "-"
            ]
            csvRows.push(row.map(escapeCSVField).join(","))
        })

        const csvContent = csvRows.join("\n")
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `lista-clientes-${tagName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        Toast.success("Arquivo CSV gerado com sucesso!")
    }

    const generateJSON = (clients: TTagClientListResponse[], tagName: string) => {
        const jsonData = {
            tag: {
                id: selectedExportSegment,
                nome: tagName,
                dataGeracao: DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm"),
                totalClientes: clients.length
            },
            clientes: clients.map((client, index) => ({
                numero: index + 1,
                id: client.id,
                nome: formatClientName(client),
                email: client.email || null,
                telefone: client.phone || null,
                documento: client.document || null,
                nacionalidade: client.nationality || null,
                nascimento: client.birth ? DateUtils.formatDate(client.birth, "DD/MM/YYYY") : null,
                endereco: client.address ? {
                    rua: client.address.street || null,
                    numero: client.address.number || null,
                    complemento: client.address.complement || null,
                    bairro: client.address.neighborhood || null,
                    cidade: client.address.city || null,
                    estado: client.address.state || null,
                    pais: client.address.country || null,
                    cep: client.address.zipCode || null
                } : null,
                eventos: client.events.map(e => ({
                    id: e.id,
                    eventId: e.eventId,
                    eventName: e.eventName,
                    paymentId: e.paymentId,
                    paymentDate: DateUtils.formatDate(e.paymentDate, "DD/MM/YYYY"),
                    paymentValue: ValueUtils.centsToCurrency(e.paymentValue),
                    ticketsCount: e.ticketsCount
                })),
                totalCompras: client.totalPurchases,
                totalGasto: ValueUtils.centsToCurrency(client.totalSpent),
                ultimaCompra: formatLastPurchaseDate(client.lastPurchaseDate) !== "-" ? formatLastPurchaseDate(client.lastPurchaseDate) : null,
                horaUltimaCompra: client.lastPurchaseTime || null,
                dataCriacao: DateUtils.formatDate(client.createdAt, "DD/MM/YYYY HH:mm")
            }))
        }

        const jsonContent = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `lista-clientes-${tagName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        Toast.success("Arquivo JSON gerado com sucesso!")
    }

    const handleDownload = async (format: "pdf" | "xlsx" | "csv" | "json", segmentId?: string) => {
        if (!segmentId) {
            Toast.error("Selecione uma tag para exportar os dados")
            return
        }

        const segment = emailSegments.find(s => s.id === segmentId)
        
        if (!segment || segment.type !== "tag") {
            Toast.error("Selecione uma tag para exportar os dados")
            return
        }

        setSelectedFormat(format)
        setIsGenerating(true)

        try {
            const response = await TagClientService.listClients(segmentId)
            const clientsData = response.data || []
            
            if (clientsData.length === 0) {
                Toast.error("Nenhum cliente encontrado para esta tag")
                return
            }

            if (format === "pdf") {
                generatePDF(clientsData, segment.name)
            } else if (format === "xlsx") {
                generateXLSX(clientsData, segment.name)
            } else if (format === "csv") {
                generateCSV(clientsData, segment.name)
            } else if (format === "json") {
                generateJSON(clientsData, segment.name)
            }
            
            setExportDialog(false)
            setSelectedExportSegment("")
        } catch (error: any) {
            console.error("Erro ao exportar lista:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao exportar lista de clientes"
            Toast.error(errorMessage)
        } finally {
            setIsGenerating(false)
            setSelectedFormat(null)
        }
    }

    const selectedCampaign = campaigns.find(c => c.id === emailHistoryDialog.emailId)
    const selectedCampaignTemplate = templates.find(t => t.id === selectedCampaign?.templateId)
    const selectedWebpushCampaign = webpushCampaigns.find(c => c.id === webpushHistoryDialog.webpushId)
    const selectedWebpushCampaignTemplate = webpushTemplatesRaw.find(t => t.id === selectedWebpushCampaign?.templateId)

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <div className="p-6">
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">Total de Clientes</p>
                            <div className="text-3xl font-bold text-psi-dark">{customersLoading ? "-" : totalCustomers}</div>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">E-mails Enviados (últimos 30 dias)</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-3xl font-bold text-psi-dark">{emailUsed}</div>
                                <div className="text-sm text-psi-dark/60">/ {emailLimit}</div>
                                <div className="text-xs text-psi-dark/50 mt-1">({emailRemaining} restantes)</div>
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
                            <p className="text-sm font-medium text-psi-dark/60 mb-2">Webpush Enviados (últimos 30 dias)</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-3xl font-bold text-psi-dark">{webpushUsed}</div>
                                <div className="text-sm text-psi-dark/60">/ {webpushLimit}</div>
                                <div className="text-xs text-psi-dark/50 mt-1">({webpushRemaining} restantes)</div>
                            </div>
                            <div className="h-2 bg-psi-primary/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-psi-primary rounded-full transition-all"
                                    style={{ width: `${(webpushUsed / webpushLimit) * 100}%` }}
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
                                        <Crown className="h-5.5 w-5.5 text-psi-primary" />
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
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === "webpush"
                                    ? "text-psi-dark border-b-2 border-psi-primary"
                                    : "text-psi-dark/60 hover:text-psi-dark"
                            }`}
                            onClick={() => setActiveTab("webpush")}
                        >
                            Webpush
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === "plan"
                                    ? "text-psi-dark border-b-2 border-psi-primary"
                                    : "text-psi-dark/60 hover:text-psi-dark"
                            }`}
                            onClick={() => setActiveTab("plan")}
                        >
                            Plano
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
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setEmailDialog({ open: true })}
                                            className="gap-2"
                                        >
                                            <Send className="h-4 w-4" />
                                            Enviar E-mail
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setWebpushDialog({ open: true })}
                                            className="gap-2"
                                        >
                                            <Bell className="h-4 w-4" />
                                            Enviar Webpush
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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => {
                                                if (!isPro) {
                                                    setReportsProDialog(true)
                                                } else {
                                                    setReportsDialog(true)
                                                }
                                            }}
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Relatórios
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Input
                                        placeholder="Buscar por nome, e-mail, telefone..."
                                        value={searchInput}
                                        onChange={(e) => {
                                            setSearchInput(e.target.value)
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
                                        onValueChange={(value) => {
                                            setFilters(prev => ({ ...prev, eventId: value === "all" ? undefined : value }))
                                            setCurrentPage(1)
                                        }}
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
                                            setSearchInput("")
                                            setSearch("")
                                            setCurrentPage(1)
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
                                        <>
                                            <div className="p-4 bg-psi-primary/5 border-b border-psi-dark/10">
                                                <p className="text-sm text-psi-dark/70">
                                                    {filters.tagId || filters.eventId ? (
                                                        <>Mostrando <strong>{totalFiltered}</strong> de <strong>{totalCustomers}</strong> cliente{totalCustomers !== 1 ? "s" : ""} (com filtros aplicados)</>
                                                    ) : (
                                                        <>Total de <strong>{totalFiltered}</strong> cliente{totalFiltered !== 1 ? "s" : ""}</>
                                                    )}
                                                </p>
                                            </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Nome</TableHead>
                                                    <TableHead>E-mail</TableHead>
                                                    <TableHead>Celular</TableHead>
                                                    <TableHead>E-mail Marketing</TableHead>
                                                    <TableHead>Webpush</TableHead>
                                                    <TableHead>Compras</TableHead>
                                                    <TableHead>Total Gasto</TableHead>
                                                    <TableHead>Última Compra</TableHead>
                                                    <TableHead className="w-24">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                    {customers.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={9} className="text-center py-8 text-psi-dark/60">
                                                            Nenhum cliente encontrado
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                        customers.map(customer => (
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
                                                            <TableCell>{DocumentUtils.formatPhone(customer.phone || "")}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={customer.isMarketingConsent ? "psi-secondary" : "outline"}>
                                                                    {customer.isMarketingConsent ? (
                                                                        <span className="flex items-center gap-1">
                                                                            <MailCheck className="h-3 w-3" />
                                                                            Ativo
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1">
                                                                            <MailX className="h-3 w-3" />
                                                                            Inativo
                                                                        </span>
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={customer.isWebpushConsent ? "psi-secondary" : "outline"}>
                                                                    {customer.isWebpushConsent ? (
                                                                        <span className="flex items-center gap-1">
                                                                            <Bell className="h-3 w-3" />
                                                                            Ativo
                                                                            </span>
                                                                            ) : (
                                                                            <span className="flex items-center gap-1">
                                                                                <Bell className="h-3 w-3" />
                                                                                Inativo
                                                                            </span>
                                                                            )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{customer.totalPurchases}</TableCell>
                                                            <TableCell>
                                                                <span className="inline-block rounded-lg bg-psi-primary/10 text-psi-primary font-semibold px-2 py-0.5
                                                                text-sm
                                                                sm:text-base
                                                                tracking-tight">
                                                                    {ValueUtils.centsToCurrency(customer.totalSpent)}
                                                                </span>
                                                            </TableCell>
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
                                                                <TableCell colSpan={10} className="bg-psi-primary/5">
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
                                        </>
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
                                                        {customers.filter(c => c.tags.some(t => t.id === tag.id)).length} cliente{customers.filter(c => c.tags.some(t => t.id === tag.id)).length !== 1 ? "s" : ""}
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
                                {campaignsLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Skeleton key={i} className="h-24 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {campaigns.length === 0 ? (
                                            <div className="text-center py-8 text-psi-dark/60">
                                                Nenhuma campanha de e-mail enviada ainda
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {campaigns.map(campaign => {
                                                    const template = templates.find(t => t.id === campaign.templateId)
                                                    const templateName = template?.name || "Template não encontrado"
                                                    
                                                    return (
                                                        <Card key={campaign.id}>
                                                            <div className="p-4">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <h4 className="font-semibold text-psi-dark">
                                                                                {(campaign as TCampaign).name?.trim() || templateName}
                                                                            </h4>
                                                                            <Badge variant={
                                                                                campaign.status === "SENT" 
                                                                                    ? "psi-secondary" 
                                                                                    : campaign.status === "FAILED"
                                                                                        ? "destructive"
                                                                                        : campaign.status === "SENDING"
                                                                                            ? "secondary"
                                                                                            : "outline"
                                                                            }>
                                                                                {campaign.status === "SENT" 
                                                                                    ? "Enviado" 
                                                                                    : campaign.status === "FAILED"
                                                                                        ? "Falhou"
                                                                                        : campaign.status === "SENDING"
                                                                                            ? "Enviando"
                                                                                            : "Pendente"}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="text-sm text-psi-dark/60 space-y-1">
                                                                            <p>Template: {templateName}</p>
                                                                            <p>Destinatários: {campaign.totalRecipients} ({campaign.sentCount} enviados)</p>
                                                                            <p>Criado em: {formatDateTime(campaign.createdAt)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setEmailHistoryDialog({ open: true, emailId: campaign.id })
                                                                            setSelectedCampaignId(campaign.id)
                                                                        }}
                                                                        className="gap-2"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        Ver Detalhes
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    )
                                                })}
                                            </div>
                                        )}
                                        {campaignsData?.data && campaignsData.data.total > 50 && (
                                            <div className="mt-4">
                                                <Pagination
                                                    currentPage={campaignsPage}
                                                    totalPages={Math.ceil(campaignsData.data.total / 50)}
                                                    onPageChange={(page) => {
                                                        setCampaignsPage(page)
                                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                    )}

                    {activeTab === "webpush" && (
                        <div className="space-y-4">
                            <Card>
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-psi-dark">Histórico de Webpush</h2>
                                            <p className="text-sm text-psi-dark/60 mt-1">
                                                Visualize todos os webpush enviados para seus clientes
                                            </p>
                                        </div>
                                        <Button
                                            variant="primary"
                                            onClick={() => setWebpushDialog({ open: true })}
                                            className="gap-2"
                                        >
                                            <Bell className="h-4 w-4" />
                                            Novo Webpush
                                        </Button>
                                    </div>
                                    {webpushCampaignsLoading ? (
                                        <div className="space-y-4">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Skeleton key={i} className="h-24 w-full" />
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            {webpushCampaigns.length === 0 ? (
                                                <div className="text-center py-8 text-psi-dark/60">
                                                    Nenhuma campanha de webpush enviada ainda
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {webpushCampaigns.map((campaign: TWebpushCampaign) => {
                                                        const template = webpushTemplates.find(t => t.id === campaign.templateId)
                                                        const templateName = template?.name || "Template não encontrado"

                                                        return (
                                                            <Card key={campaign.id}>
                                                                <div className="p-4">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <h4 className="font-semibold text-psi-dark">
                                                                                    {campaign.name?.trim() || templateName}
                                                                                </h4>
                                                                                <Badge variant={
                                                                                    campaign.status === "SENT"
                                                                                        ? "psi-secondary"
                                                                                        : "destructive"
                                                                                }>
                                                                                    {campaign.status === "SENT" ? "Enviado" : "Falhou"}
                                                                                </Badge>
                                                                            </div>
                                                                            <div className="text-sm text-psi-dark/60 space-y-1">
                                                                                <p>Template: {templateName}</p>
                                                                                <p>Destinatários: {campaign.totalRecipients} ({campaign.sentCount} enviados)</p>
                                                                                <p>Criado em: {formatDateTime(campaign.createdAt)}</p>
                                                                            </div>
                                                                        </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setWebpushHistoryDialog({ open: true, webpushId: campaign.id })
                                                                                setSelectedWebpushCampaignId(campaign.id)
                                                                            }}
                                                                            className="gap-2"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                            Ver Detalhes
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                            {webpushCampaignsData?.data && webpushCampaignsData.data.total > 50 && (
                                                <div className="mt-4">
                                                    <Pagination
                                                        currentPage={webpushCampaignsPage}
                                                        totalPages={Math.ceil(webpushCampaignsData.data.total / 50)}
                                                        onPageChange={(page) => {
                                                            setWebpushCampaignsPage(page)
                                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === "plan" && (
                        <div className="space-y-4">
                            <Card>
                                <div className="p-6">
                                    {isLoadingSubscriptionInfo ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-32 w-full" />
                                            <Skeleton className="h-32 w-full" />
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-psi-dark mb-2">Seu Plano Atual</h2>
                                                <div className="flex items-center gap-3">
                                                    {isPro ? (
                                                        <>
                                                            <Crown className="h-6 w-6 text-psi-primary" />
                                                            <div>
                                                                <p className="text-lg font-semibold text-psi-dark">CRM Pro</p>
                                                                {subscriptionInfo && (
                                                                    <p className="text-sm text-psi-dark/80">
                                                                        Código da assinatura: <span className="text-xs font-medium text-psi-dark/60">{subscriptionInfo.code}</span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BarChart3 className="h-6 w-6 text-psi-dark/40" />
                                                            <div>
                                                                <p className="text-lg font-semibold text-psi-dark">CRM Básico</p>
                                                                <p className="text-sm text-psi-dark/60">Plano gratuito</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {subscriptionInfo?.expiresAt && (
                                                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                                                    <div className="flex items-start gap-3">
                                                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-amber-900 mb-1">
                                                                Assinatura cancelada
                                                            </p>
                                                            <p className="text-sm text-amber-800">
                                                                Sua assinatura do CRM Pro foi cancelada e voltará para o plano gratuito em{" "}
                                                                <strong>{DateUtils.formatDate(subscriptionInfo.expiresAt)}</strong>.
                                                            </p>
                                                            <p className="text-sm font-medium text-amber-900 mt-2">
                                                                ✓ Não haverá mais cobranças no seu cartão de crédito
                                                            </p>
                                                            <p className="text-xs text-amber-700 mt-1">
                                                                Você poderá contratar o plano PRO novamente após esta data.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <Separator />

                                            <div>
                                                <h3 className="text-lg font-semibold text-psi-dark mb-4">Benefícios do seu plano</h3>
                                                {isPro ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Até 5.000 e-mails por mês</p>
                                                                <p className="text-sm text-psi-dark/60">50x mais que o plano básico</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Até 5.000 webpush por mês</p>
                                                                <p className="text-sm text-psi-dark/60">Notificações push no navegador e no celular. No plano Pro você pode enviar até 5.000 webpush por mês para engajar sua audiência em tempo real.</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Até 200 tags</p>
                                                                <p className="text-sm text-psi-dark/60">Organize seus clientes com tags personalizadas</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Clientes ilimitados</p>
                                                                <p className="text-sm text-psi-dark/60">Gerencie quantos clientes precisar</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Com relatórios</p>
                                                                <p className="text-sm text-psi-dark/60">Análises detalhadas e insights estratégicos</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Sugestões por IA frequentes</p>
                                                                <p className="text-sm text-psi-dark/60">Receba recomendações automáticas e inteligentes</p>
                                                            </div>
                                                        </div>
                                                        {subscriptionInfo?.card && (
                                                            <div className="mt-4 p-4 bg-psi-primary/5 rounded-lg border border-psi-primary/20">
                                                                <p className="text-sm font-medium text-psi-dark mb-2">Cartão de Crédito Cadastrado</p>
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={getCardBrandIcon(subscriptionInfo.card.brand)}
                                                                        alt={subscriptionInfo.card.brand}
                                                                        className="h-8 w-8 object-contain"
                                                                    />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-psi-dark">
                                                                            {subscriptionInfo.card.name}
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            •••• •••• •••• {subscriptionInfo.card.last4}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-psi-dark/40 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Até 100 e-mails por mês</p>
                                                                <p className="text-sm text-psi-dark/60">Limite mensal de envios</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-psi-dark/40 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Até 100 webpush por mês</p>
                                                                <p className="text-sm text-psi-dark/60">Limite mensal de envios</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-psi-dark/40 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Até 200 tags</p>
                                                                <p className="text-sm text-psi-dark/60">Organize seus clientes com tags personalizadas</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <CheckCircle2 className="h-5 w-5 text-psi-dark/40 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Clientes ilimitados</p>
                                                                <p className="text-sm text-psi-dark/60">Gerencie quantos clientes precisar</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <XCircle className="h-5 w-5 text-psi-dark/40 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Sem relatórios</p>
                                                                <p className="text-sm text-psi-dark/60">Relatórios avançados não disponíveis</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <XCircle className="h-5 w-5 text-psi-dark/40 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-psi-dark">Poucas sugestões por IA</p>
                                                                <p className="text-sm text-psi-dark/60">Sugestões limitadas de inteligência artificial</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <Separator />

                                            <div className="flex gap-3">
                                                {isPro ? (
                                                    <>
                                                        {!subscriptionInfo?.expiresAt && (
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => setCancelSubscriptionDialog(true)}
                                                                className="gap-2"
                                                                size="sm"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                                Cancelar Assinatura
                                                            </Button>
                                                        )}
                                                        {
                                                            !subscriptionInfo?.expiresAt && (
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setUpdateCardDialog(true)
                                                                        if (subscriptionInfo?.card) {
                                                                            setSelectedCardIdForUpdate(subscriptionInfo.card.id)
                                                                        }
                                                                    }}
                                                                    className="gap-2"
                                                                >
                                                                    <CreditCard className="h-4 w-4" />
                                                                    Atualizar Cartão
                                                                </Button>
                                                            )
                                                        }
                                                    </>
                                                ) : (
                                                    <>
                                                        {subscriptionInfo?.expiresAt && new Date(subscriptionInfo.expiresAt) > new Date() ? (
                                                            <div className="flex flex-col gap-2">
                                                                <Button
                                                                    variant="primary"
                                                                    disabled
                                                                    className="gap-2"
                                                                >
                                                                    <Crown className="h-4 w-4" />
                                                                    Upgrade para CRM Pro
                                                                </Button>
                                                                <p className="text-xs text-psi-dark/60 text-center">
                                                                    Você poderá contratar o plano PRO novamente após {formatDateTime(subscriptionInfo.expiresAt)}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => setUpgradeDialog(true)}
                                                                className="gap-2"
                                                            >
                                                                <Crown className="h-4 w-4" />
                                                                Upgrade para CRM Pro
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={tagDialog.open} onOpenChange={(open) => {
                setTagDialog({ open, mode: "create" })
                tagForm.reset()
                setEnableAutomation(false)
            }}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

                        <div className="pt-4 border-t border-psi-dark/10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <label className="text-sm font-medium text-psi-dark block">Automação (Opcional)</label>
                                    <p className="text-xs text-psi-dark/60 mt-1">
                                        Configure regras para atribuir esta tag automaticamente aos clientes
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEnableAutomation(!enableAutomation)
                                        if (!enableAutomation) {
                                            tagForm.setValue("automationRules", {
                                                eventId: undefined,
                                                eventCategoryId: undefined,
                                                minTotalSpent: undefined,
                                                minTicketsCount: undefined,
                                                purchaseDateFrom: undefined,
                                                purchaseDateTo: undefined
                                            })
                                        } else {
                                            tagForm.setValue("automationRules", undefined)
                                        }
                                    }}
                                >
                                    {enableAutomation ? "Desativar" : "Ativar"}
                                </Button>
                            </div>

                                {enableAutomation && (
                                    <div className="space-y-4 p-4 bg-psi-primary/5 rounded-lg border border-psi-primary/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                    Evento Específico
                                                </label>
                                                <Select
                                                    value={tagForm.watch("automationRules")?.eventId || undefined}
                                                    onValueChange={(value) => {
                                                        const currentRules = tagForm.watch("automationRules") || {}
                                                        tagForm.setValue("automationRules", {
                                                            ...currentRules,
                                                            eventId: value
                                                        })
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione um evento (opcional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {events.map(event => (
                                                            <SelectItem key={event.id} value={event.id}>
                                                                {event.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                    Cliente que comprar ingresso deste evento
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                    Categoria de Evento
                                                </label>
                                                <Select
                                                    value={tagForm.watch("automationRules")?.eventCategoryId || undefined}
                                                    onValueChange={(value) => {
                                                        const currentRules = tagForm.watch("automationRules") || {}
                                                        tagForm.setValue("automationRules", {
                                                            ...currentRules,
                                                            eventCategoryId: value
                                                        })
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione uma categoria (opcional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[...categories]
                                                            .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                                                            .map(category => (
                                                                <SelectItem key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))
                                                        }
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                    Cliente que comprar ingresso de eventos desta categoria
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                    Valor Mínimo Gasto (R$)
                                                </label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={tagForm.getValues("automationRules")?.minTotalSpent ?? ""}
                                                    onChange={(e) => {
                                                        const currentRules = tagForm.getValues("automationRules") || {}
                                                        const value = e.target.value ? parseFloat(e.target.value) : undefined
                                                        tagForm.setValue("automationRules", {
                                                            ...currentRules,
                                                            minTotalSpent: value
                                                        })
                                                    }}
                                                />
                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                    Cliente que gastar este valor ou mais
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                    Quantidade Mínima de Ingressos
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="1"
                                                    value={tagForm.getValues("automationRules")?.minTicketsCount ?? ""}
                                                    onChange={(e) => {
                                                        const currentRules = tagForm.getValues("automationRules") || {}
                                                        const value = e.target.value ? parseInt(e.target.value) : undefined
                                                        tagForm.setValue("automationRules", {
                                                            ...currentRules,
                                                            minTicketsCount: value
                                                        })
                                                    }}
                                                />
                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                    Cliente que comprar esta quantidade ou mais
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                    Período de Compra - De
                                                </label>
                                                <DatePicker
                                                    value={tagForm.getValues("automationRules")?.purchaseDateFrom || null}
                                                    onChange={(value) => {
                                                        const currentRules = tagForm.getValues("automationRules") || {}
                                                        tagForm.setValue("automationRules", {
                                                            ...currentRules,
                                                            purchaseDateFrom: value || undefined
                                                        })
                                                    }}
                                                    className="w-full"
                                                    absoluteClassName={true}
                                                />
                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                    Data inicial do período
                                                </p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                    Período de Compra - Até
                                                </label>
                                                <DatePicker
                                                    value={tagForm.getValues("automationRules")?.purchaseDateTo || null}
                                                    onChange={(value) => {
                                                        const currentRules = tagForm.getValues("automationRules") || {}
                                                        tagForm.setValue("automationRules", {
                                                            ...currentRules,
                                                            purchaseDateTo: value || undefined
                                                        })
                                                    }}
                                                    className="w-full"
                                                    minDate={tagForm.getValues("automationRules")?.purchaseDateFrom || undefined}
                                                    absoluteClassName={true}
                                                />
                                                <p className="text-xs text-psi-dark/50 mt-1">
                                                    Data final do período
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setTagDialog({ open: false, mode: "create" })
                                    tagForm.reset()
                                    setEnableAutomation(false)
                                }}
                                className="z-0!"
                                disabled={isCreatingTag || isUpdatingTag}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="primary"
                                disabled={isCreatingTag || isUpdatingTag}
                                className="gap-2"
                            >
                                {isCreatingTag || isUpdatingTag ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {tagDialog.mode === "create" ? "Criando..." : "Salvando..."}
                                    </>
                                ) : (
                                    tagDialog.mode === "create" ? "Criar" : "Salvar"
                                )}
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
                <SheetContent side="right" className="w-[90vw] sm:w-[90vw] lg:w-[1200px] 3xl:w-[1400px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-semibold text-psi-primary">Enviar E-mail</SheetTitle>
                        <SheetDescription>
                            Escolha um template e selecione os destinatários
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={emailForm.handleSubmit(handleSendEmail)} className="space-y-6 mt-6 mx-4">
                        <div>
                            <label htmlFor="email-campaign-name" className="text-sm font-medium text-psi-dark mb-2 block">
                                Nome da campanha <span className="text-psi-dark/50 font-normal">(opcional)</span>
                            </label>
                            <Input
                                id="email-campaign-name"
                                placeholder="Ex: Newsletter janeiro 2025"
                                maxLength={255}
                                className="max-w-md"
                                {...emailForm.register("name")}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-3 block">Selecione um Template</label>
                            {templatesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Skeleton key={i} className="h-32 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {emailTemplates.map((template: TEmailTemplate) => (
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
                            )}
                            {emailForm.formState.errors.templateId && (
                                <p className="text-sm text-destructive mt-2">{emailForm.formState.errors.templateId.message}</p>
                            )}
                        </div>

                        {selectedTemplate && (
                            <>
                                <Separator />
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-psi-dark">Preview do E-mail</h4>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setEmailPreviewDialog(true)}
                                            className="gap-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Visualizar
                                        </Button>
                                    </div>
                                    <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4 space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-psi-dark/60 mb-1">Assunto:</p>
                                            <p className="text-sm font-medium text-psi-dark">{getPreviewSubject()}</p>
                                        </div>
                                        <div>
                                            <Collapsible>
                                                <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 mb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary" aria-label="Mostrar corpo do e-mail">
                                                    Corpo:
                                                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div className="bg-white p-3 rounded border border-psi-dark/10 text-sm text-psi-dark/70 whitespace-pre-line mt-2">
                                                {getPreviewBody()}
                                            </div>
                                                </CollapsibleContent>
                                            </Collapsible>
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
                                                if (field === "opinionPoll") {
                                                    return (
                                                        <div key={field}>
                                                            <label className="text-sm font-medium text-psi-dark mb-1 block">
                                                                Pesquisa de Opinião
                                                            </label>
                                                            <Select
                                                                value={selectedOpinionPollForTemplate}
                                                                onValueChange={(value) => {
                                                                    setSelectedOpinionPollForTemplate(value)
                                                                    emailForm.setValue("templateFields.opinionPoll", value)
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione uma pesquisa de opinião" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {opinionPolls.length === 0 ? (
                                                                        <SelectItem value="no-polls" disabled>
                                                                            Nenhuma pesquisa disponível
                                                                        </SelectItem>
                                                                    ) : (
                                                                        opinionPolls.map((poll: TOpinionPoll) => (
                                                                            <SelectItem key={poll.id} value={poll.id}>
                                                                                {poll.event.name} - {poll.commentsCount} comentários
                                                                            </SelectItem>
                                                                        ))
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            {selectedOpinionPollForTemplate && (() => {
                                                                const selectedPoll = opinionPolls.find((p: TOpinionPoll) => p.id === selectedOpinionPollForTemplate)
                                                                if (!selectedPoll) return null
                                                                return (
                                                                    <div className="mt-2 p-2 bg-psi-primary/5 rounded border border-psi-primary/20">
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            <strong>Evento:</strong> {selectedPoll.event.name}
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/60 mt-1">
                                                                            <strong>Comentários:</strong> {selectedPoll.commentsCount}
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/60 mt-1">
                                                                            <strong>Avaliação média:</strong> {selectedPoll.averageStars.toFixed(1)} ⭐
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
                                                variant="primary"
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
                                                            {segment.type === "tag" ? "Tag" : "Todos"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-psi-dark/60">{segment.description}</p>
                                                    <p className="text-xs text-psi-dark/50 mt-1">{segment.count} destinatários</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {segment.type === "tag" && segment.id !== "all" && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setViewTagClientsDialog({
                                                                    open: true,
                                                                    tagId: segment.id,
                                                                    tagName: segment.name
                                                                })
                                                                setSelectedTagIdForClients(segment.id)
                                                            }}
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    )}
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
                                <strong>E-mails restantes este mês:</strong> {emailRemaining} / {emailLimit}
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
                                <Button type="submit" variant="primary" disabled={emailRemaining <= 0 || isCreatingCampaign}>
                                    {isCreatingCampaign ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar E-mail"
                                    )}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <Sheet open={webpushDialog.open} onOpenChange={(open) => {
                setWebpushDialog({ open })
                webpushForm.reset()
                setSelectedWebpushTemplate(null)
                setSelectedEventForWebpushTemplate("")
                setSelectedCouponForWebpushTemplate("")
            }}>
                <SheetContent side="right" className="w-[90vw] sm:w-[90vw] lg:w-[1100px] 3xl:w-[1300px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-semibold text-psi-primary">Enviar Webpush</SheetTitle>
                        <SheetDescription>
                            Escolha um template e selecione os destinatários
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={webpushForm.handleSubmit(handleSendWebpush)} className="space-y-6 mt-6 mx-4">
                        <div>
                            <label htmlFor="webpush-campaign-name" className="text-sm font-medium text-psi-dark mb-2 block">
                                Nome da campanha <span className="text-psi-dark/50 font-normal">(opcional)</span>
                            </label>
                            <Input
                                id="webpush-campaign-name"
                                placeholder="Ex: Oferta especial - Black Friday"
                                maxLength={255}
                                className="max-w-md"
                                {...webpushForm.register("name")}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-psi-dark mb-3 block">Selecione um Template</label>
                            {webpushTemplatesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Skeleton key={i} className="h-32 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {webpushTemplates.map((template: TWebpushTemplate) => (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => handleWebpushTemplateSelect(template.id)}
                                            disabled={template.isPremium && !isPro}
                                            className={`p-4 rounded-lg border-2 text-left transition-all relative ${
                                                selectedWebpushTemplate?.id === template.id
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
                            )}
                            {webpushForm.formState.errors.templateId && (
                                <p className="text-sm text-destructive mt-2">{webpushForm.formState.errors.templateId.message}</p>
                            )}
                        </div>

                        {selectedWebpushTemplate && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold text-psi-dark mb-3">Preview do Webpush</h4>
                                    <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4 space-y-3">
                                        <div>
                                            <p className="text-xs font-medium text-psi-dark/60 mb-1">Título:</p>
                                            <p className="text-sm font-medium text-psi-dark">{getWebpushPreviewTitle()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-psi-dark/60 mb-1">Mensagem:</p>
                                            <p className="text-sm text-psi-dark/80 whitespace-pre-line">{getWebpushPreviewBody()}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedWebpushTemplate.editableFields.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-psi-dark mb-3">Informações do Template</h4>
                                        <div className="space-y-3">
                                            {selectedWebpushTemplate.editableFields.map(field => {
                                                if (field === "evento") {
                                                    return (
                                                        <div key={field}>
                                                            <label className="text-sm font-medium text-psi-dark mb-1 block">
                                                                Evento
                                                            </label>
                                                            <Select
                                                                value={selectedEventForWebpushTemplate}
                                                                onValueChange={(value) => {
                                                                    setSelectedEventForWebpushTemplate(value)
                                                                    webpushForm.setValue("templateFields.evento", value)
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
                                                                value={selectedCouponForWebpushTemplate}
                                                                onValueChange={(value) => {
                                                                    setSelectedCouponForWebpushTemplate(value)
                                                                    webpushForm.setValue("templateFields.cupom", value)
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
                                                        </div>
                                                    )
                                                }
                                                return null
                                            })}
                                        </div>
                                    </div>
                                )}

                                <Separator />
                                <div>
                                    <label className="text-sm font-medium text-psi-dark mb-3 block">Selecione os Destinatários</label>
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {emailSegments.map(segment => (
                                            <div key={segment.id} className="flex items-center justify-between p-3 border border-psi-dark/10 rounded-lg hover:bg-psi-primary/5 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-medium text-psi-dark">{segment.name}</h5>
                                                        <Badge variant="outline" className="text-xs">
                                                            {segment.type === "tag" ? "Tag" : "Todos"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-psi-dark/60">{segment.description}</p>
                                                    <p className="text-xs text-psi-dark/50 mt-1">{segment.count} destinatários</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {segment.type === "tag" && segment.id !== "all" && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setViewTagClientsDialog({
                                                                    open: true,
                                                                    tagId: segment.id,
                                                                    tagName: segment.name
                                                                })
                                                                setSelectedTagIdForClients(segment.id)
                                                            }}
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <input
                                                        type="checkbox"
                                                        checked={webpushForm.watch("segments")?.includes(segment.id) || false}
                                                        onChange={(e) => {
                                                            const current = webpushForm.watch("segments") || []
                                                            if (e.target.checked) {
                                                                webpushForm.setValue("segments", [...current, segment.id])
                                                            } else {
                                                                webpushForm.setValue("segments", current.filter(id => id !== segment.id))
                                                            }
                                                        }}
                                                        className="ml-4"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {webpushForm.formState.errors.segments && (
                                        <p className="text-sm text-destructive mt-2">{webpushForm.formState.errors.segments.message}</p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-3">
                            <p className="text-sm text-psi-dark/70">
                                <strong>Webpush restantes este mês:</strong> {webpushRemaining} / {webpushLimit}
                            </p>
                        </div>
                        <SheetFooter className="gap-2">
                            <div className="flex items-end justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setWebpushDialog({ open: false })
                                        webpushForm.reset()
                                        setSelectedWebpushTemplate(null)
                                        setSelectedEventForWebpushTemplate("")
                                        setSelectedCouponForWebpushTemplate("")
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" disabled={webpushRemaining <= 0 || isCreatingWebpushCampaign}>
                                    {isCreatingWebpushCampaign ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar Webpush"
                                    )}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <Dialog open={emailPreviewDialog} onOpenChange={setEmailPreviewDialog}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Visualização do E-mail</DialogTitle>
                        <DialogDescription>
                            Veja como o e-mail será exibido para seus clientes em diferentes dispositivos
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {selectedTemplate && (
                            <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4">
                                <p className="text-sm font-medium text-psi-dark mb-2">
                                    Template: {selectedTemplate.name}
                                </p>
                                <p className="text-xs text-psi-dark/60 mb-4">
                                    Assunto: {getPreviewSubject()}
                                </p>
                            </div>
                        )}
                        
                        {selectedTemplate && (() => {
                            const templateName = selectedTemplate.code.replace("crm-template-", "")
                            const imagePath = `/images/crm/visualizar-crm-template-${templateName}.png`
                            
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <h5 className="text-sm font-semibold text-psi-dark">Desktop</h5>
                                        </div>
                                        <div className="relative bg-gray-100 rounded-lg p-3 shadow-lg">
                                            <div className="bg-white rounded border-2 border-gray-300 overflow-hidden">
                                                <div className="bg-gray-200 h-6 flex items-center gap-1.5 px-2 border-b border-gray-300">
                                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <div className="flex-1 bg-gray-300 rounded h-3 mx-2"></div>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <img
                                                        src={imagePath}
                                                        alt="Preview do e-mail - Desktop"
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                            <h5 className="text-sm font-semibold text-psi-dark">Tablet</h5>
                                        </div>
                                        <div className="relative bg-gray-100 rounded-lg p-4 shadow-lg flex justify-center">
                                            <div className="bg-white rounded-lg border-3 border-gray-400 overflow-hidden shadow-xl" style={{ width: "100%", maxWidth: "400px" }}>
                                                <div className="bg-gray-200 h-8 flex items-center justify-center border-b border-gray-300">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <img
                                                        src={imagePath}
                                                        alt="Preview do e-mail - Tablet"
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                            <h5 className="text-sm font-semibold text-psi-dark">Mobile</h5>
                                        </div>
                                        <div className="relative bg-gray-100 rounded-lg p-3 shadow-lg flex justify-center">
                                            <div className="bg-black rounded-3xl p-1.5 shadow-2xl" style={{ width: "100%", maxWidth: "200px" }}>
                                                <div className="bg-white rounded-2xl overflow-hidden">
                                                    <div className="bg-gray-200 h-8 flex items-center justify-center border-b border-gray-300 relative">
                                                        <div className="absolute left-2 h-0.5 w-8 bg-gray-400 rounded"></div>
                                                        <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                                                        <div className="absolute right-2 flex gap-0.5">
                                                            <div className="h-0.5 w-0.5 rounded-full bg-gray-400"></div>
                                                            <div className="h-0.5 w-0.5 rounded-full bg-gray-400"></div>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <img
                                                            src={imagePath}
                                                            alt="Preview do e-mail - Mobile"
                                                            className="w-full h-auto"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEmailPreviewDialog(false)}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={emailSuccessDialog} onOpenChange={setEmailSuccessDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Campanha Criada com Sucesso!
                        </DialogTitle>
                        <DialogDescription>
                            Sua campanha de e-mail foi criada e os e-mails estão sendo disparados com sucesso.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-psi-dark/70">
                            Os destinatários selecionados receberão o e-mail em breve. Você pode acompanhar o progresso da campanha na aba "E-mails".
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="primary"
                            onClick={() => setEmailSuccessDialog(false)}
                        >
                            Entendi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={webpushSuccessDialog} onOpenChange={setWebpushSuccessDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Campanha Criada com Sucesso!
                        </DialogTitle>
                        <DialogDescription>
                            Sua campanha de webpush foi criada e as notificações estão sendo disparadas.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-psi-dark/70">
                            Os destinatários selecionados receberão o webpush em breve. Você pode acompanhar o progresso na aba "Webpush".
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="primary"
                            onClick={() => setWebpushSuccessDialog(false)}
                        >
                            Entendi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={emailHistoryDialog.open} onOpenChange={(open) => {
                setEmailHistoryDialog({ open })
                if (!open) {
                    setSelectedCampaignId(undefined)
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Campanha</DialogTitle>
                        <DialogDescription>
                            Visualize os detalhes e destinatários da campanha de e-mail
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCampaign && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Template</h4>
                                <p className="text-psi-dark/70">{selectedCampaignTemplate?.name || "Template não encontrado"}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Status</h4>
                                <Badge variant={
                                    selectedCampaign.status === "SENT" 
                                        ? "psi-secondary" 
                                        : selectedCampaign.status === "FAILED"
                                            ? "destructive"
                                            : selectedCampaign.status === "SENDING"
                                                ? "secondary"
                                                : "outline"
                                }>
                                    {selectedCampaign.status === "SENT" 
                                        ? "Enviado" 
                                        : selectedCampaign.status === "FAILED"
                                            ? "Falhou"
                                            : selectedCampaign.status === "SENDING"
                                                ? "Enviando"
                                                : "Pendente"}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Criado em</h4>
                                <p className="text-psi-dark/70">{formatDateTime(selectedCampaign.createdAt)}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Destinatários ({selectedCampaign.totalRecipients} total, {selectedCampaign.sentCount} enviados)</h4>
                                {campaignLogsLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Skeleton key={i} className="h-16 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-60 border border-psi-dark/10 rounded-lg p-4 overflow-y-auto">
                                        {campaignLogs.length === 0 ? (
                                            <p className="text-sm text-psi-dark/60 text-center py-8">
                                                Nenhum log encontrado para esta campanha
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {campaignLogs.map(log => {
                                                    const getDeliveryStatusConfig = () => {
                                                        switch (log.status) {
                                                            case "DELIVERED":
                                                                return {
                                                                    icon: MailCheck,
                                                                    label: "Entregue",
                                                                    variant: "psi-primary" as const,
                                                                    color: "text-green-600"
                                                                }
                                                            case "FAILED":
                                                                return {
                                                                    icon: MailX,
                                                                    label: "Falhou",
                                                                    variant: "destructive" as const,
                                                                    color: "text-red-600"
                                                                }
                                                            case "BOUNCED":
                                                                return {
                                                                    icon: MailWarning,
                                                                    label: "Retornou",
                                                                    variant: "destructive" as const,
                                                                    color: "text-orange-600"
                                                                }
                                                            case "PENDING":
                                                                return {
                                                                    icon: Clock,
                                                                    label: "Pendente",
                                                                    variant: "secondary" as const,
                                                                    color: "text-yellow-600"
                                                                }
                                                            case "QUEUED":
                                                                return {
                                                                    icon: Clock,
                                                                    label: "Na fila",
                                                                    variant: "secondary" as const,
                                                                    color: "text-amber-600"
                                                                }
                                                            case "PROCESSING":
                                                                return {
                                                                    icon: Clock,
                                                                    label: "Processando",
                                                                    variant: "secondary" as const,
                                                                    color: "text-blue-600"
                                                                }
                                                            case "ACCEPTED":
                                                                return {
                                                                    icon: Clock,
                                                                    label: "Aceito",
                                                                    variant: "secondary" as const,
                                                                    color: "text-yellow-600"
                                                                }
                                                            case "OPENED":
                                                                return {
                                                                    icon: MailOpen,
                                                                    label: "Aberto",
                                                                    variant: "psi-secondary" as const,
                                                                    color: "text-blue-600"
                                                                }
                                                            case "CLICKED":
                                                                return {
                                                                    icon: MousePointerClick,
                                                                    label: "Clicado",
                                                                    variant: "psi-primary" as const,
                                                                    color: "text-green-600"
                                                                }
                                                            case "COMPLAINED":
                                                                return {
                                                                    icon: AlertCircle,
                                                                    label: "Reclamado",
                                                                    variant: "destructive" as const,
                                                                    color: "text-red-600"
                                                                }
                                                            case "UNSUBSCRIBED":
                                                                return {
                                                                    icon: MailX,
                                                                    label: "Descadastrado",
                                                                    variant: "destructive" as const,
                                                                    color: "text-red-600"
                                                                }
                                                            default:
                                                                return {
                                                                    icon: Mail,
                                                                    label: "Desconhecido",
                                                                    variant: "secondary" as const,
                                                                    color: "text-psi-dark/60"
                                                                }
                                                        }
                                                    }

                                                    const statusConfig = getDeliveryStatusConfig()
                                                    const StatusIcon = statusConfig.icon

                                                    return (
                                                        <div key={log.id} className="border border-psi-dark/10 rounded-lg p-3 hover:bg-psi-primary/5 transition-colors">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs text-psi-dark/60 mb-2 truncate">
                                                                        {log.email}
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <Badge variant={statusConfig.variant} className="gap-1 text-xs">
                                                                            <StatusIcon className="h-3 w-3" />
                                                                            {statusConfig.label}
                                                                        </Badge>
                                                                    </div>
                                                                    {log.errorMessage && (
                                                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                                                            <div className="flex items-start gap-1">
                                                                                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                                                                <span className="font-medium">Motivo da falha:</span>
                                                                            </div>
                                                                            <p className="mt-1 ml-4">{log.errorMessage}</p>
                                                                        </div>
                                                                    )}
                                                                    {log.openedAt && (
                                                                        <p className="mt-2 text-xs text-psi-dark/50">
                                                                            Aberto em: {formatDateTime(log.openedAt)}
                                                                        </p>
                                                                    )}
                                                                    {log.clickedAt && (
                                                                        <p className="mt-2 text-xs text-psi-dark/50">
                                                                            Clicado em: {formatDateTime(log.clickedAt)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={webpushHistoryDialog.open} onOpenChange={(open) => {
                setWebpushHistoryDialog({ open })
                if (!open) {
                    setSelectedWebpushCampaignId(undefined)
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Campanha</DialogTitle>
                        <DialogDescription>
                            Visualize os detalhes e destinatários da campanha de webpush
                        </DialogDescription>
                    </DialogHeader>
                    {selectedWebpushCampaign && (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Template</h4>
                                <p className="text-psi-dark/70">{selectedWebpushCampaignTemplate?.name || "Template não encontrado"}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Status</h4>
                                <Badge
                                    variant={
                                        selectedWebpushCampaign.status === "SENT"
                                            ? "psi-secondary"
                                            : selectedWebpushCampaign.status === "QUEUED" || selectedWebpushCampaign.status === "PROCESSING"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {selectedWebpushCampaign.status === "SENT"
                                        ? "Enviado"
                                        : selectedWebpushCampaign.status === "QUEUED"
                                            ? "Na fila"
                                            : selectedWebpushCampaign.status === "PROCESSING"
                                                ? "Processando"
                                                : "Falhou"}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">Criado em</h4>
                                <p className="text-psi-dark/70">{formatDateTime(selectedWebpushCampaign.createdAt)}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-psi-dark mb-2">
                                    Destinatários ({selectedWebpushCampaign.totalRecipients} total, {selectedWebpushCampaign.sentCount} enviados)
                                </h4>
                                {webpushCampaignLogsLoading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Skeleton key={i} className="h-16 w-full" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-60 border border-psi-dark/10 rounded-lg p-4 overflow-y-auto">
                                        {webpushCampaignLogs.length === 0 ? (
                                            <p className="text-sm text-psi-dark/60 text-center py-8">
                                                Nenhum log encontrado para esta campanha
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {webpushCampaignLogs.map((log: TWebpushCampaignLog) => {
                                                    const getWebpushLogStatusConfig = () => {
                                                        switch (log.status) {
                                                            case "SENT":
                                                                return {
                                                                    icon: CheckCircle2,
                                                                    label: "Enviado",
                                                                    variant: "psi-secondary" as const,
                                                                    color: "text-green-600"
                                                                }
                                                            case "QUEUED":
                                                                return {
                                                                    icon: Clock,
                                                                    label: "Na fila",
                                                                    variant: "secondary" as const,
                                                                    color: "text-amber-600"
                                                                }
                                                            case "PROCESSING":
                                                                return {
                                                                    icon: Clock,
                                                                    label: "Processando",
                                                                    variant: "secondary" as const,
                                                                    color: "text-blue-600"
                                                                }
                                                            case "FAILED":
                                                                return {
                                                                    icon: AlertCircle,
                                                                    label: "Falhou",
                                                                    variant: "destructive" as const,
                                                                    color: "text-red-600"
                                                                }
                                                            default:
                                                                return {
                                                                    icon: Clock,
                                                                    label: log.status || "Desconhecido",
                                                                    variant: "secondary" as const,
                                                                    color: "text-psi-dark/60"
                                                                }
                                                        }
                                                    }
                                                    const statusConfig = getWebpushLogStatusConfig()
                                                    const StatusIcon = statusConfig.icon
                                                    const recipientName = log.user
                                                        ? `${log.user.firstName} ${log.user.lastName}`.trim()
                                                        : "Usuário não identificado"
                                                    const recipientEmail = log.user?.email || "-"

                                                    return (
                                                        <div key={log.id} className="border border-psi-dark/10 rounded-lg p-3 hover:bg-psi-primary/5 transition-colors">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs text-psi-dark/60 mb-1 truncate">
                                                                        {recipientName} • {recipientEmail}
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <Badge variant={statusConfig.variant} className="gap-1 text-xs">
                                                                            <StatusIcon className="h-3 w-3" />
                                                                            {statusConfig.label}
                                                                        </Badge>
                                                                    </div>
                                                                    {log.errorMessage && (
                                                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                                                            <div className="flex items-start gap-1">
                                                                                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                                                                <span className="font-medium">Motivo da falha:</span>
                                                                            </div>
                                                                            <p className="mt-1 ml-4">{log.errorMessage}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                    className={cn(
                                        "flex items-center justify-between p-3 border border-psi-dark/10 rounded-lg transition-colors",
                                        isCreatingTagClient 
                                            ? "opacity-50 cursor-not-allowed" 
                                            : "hover:bg-psi-primary/5 cursor-pointer"
                                    )}
                                    onClick={() => {
                                        if (!isCreatingTagClient && addTagToCustomerDialog.customerId) {
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
                                        {customers.filter(c => c.tags.some(t => t.id === tag.id)).length} cliente{customers.filter(c => c.tags.some(t => t.id === tag.id)).length !== 1 ? "s" : ""}
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
                confirmText={isDeletingTag ? "Excluindo..." : "Excluir"}
                cancelText="Cancelar"
                variant="destructive"
                isLoading={isDeletingTag}
            />

            <DialogConfirm
                open={removeTagFromCustomerDialog.open}
                onOpenChange={(open) => setRemoveTagFromCustomerDialog({ open })}
                onConfirm={confirmRemoveTagFromCustomer}
                title="Remover Tag do Cliente"
                description={`Tem certeza que deseja remover a tag "${removeTagFromCustomerDialog.tagName}" deste cliente? Esta ação não pode ser desfeita.`}
                confirmText={isDeletingTagClient ? "Removendo..." : "Remover"}
                cancelText="Cancelar"
                variant="destructive"
                isLoading={isDeletingTagClient}
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
                        {tagCustomersDialog.tagId && customers.filter(c => c.tags.some(t => t.id === tagCustomersDialog.tagId)).map(customer => (
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

            <Sheet open={upgradeDialog} onOpenChange={(open) => {
                setUpgradeDialog(open)
                if (!open) {
                    setSelectedCardId(null)
                    setShowNewCardForm(false)
                    setCardData({ number: "", name: "", expiry: "", cvv: "" })
                }
            }}>
                <SheetContent side="right" className="w-[90vw] sm:w-[90vw] lg:w-[1000px] overflow-y-auto">
                    <SheetHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="h-20 w-20 rounded-full bg-linear-to-br from-psi-tertiary/40 via-psi-primary/20 to-psi-secondary/40 flex items-center justify-center border-2 border-psi-primary/60">
                                <Crown className="h-10 w-10 text-psi-primary" />
                            </div>
                        </div>
                        <SheetTitle className="text-2xl text-center">Upgrade para CRM Pro</SheetTitle>
                        <SheetDescription className="text-center text-base">
                            Potencialize sua comunicação e gestão de clientes
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-6 mx-4">
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
                                <div className="mb-2">
                                    <Crown
                                        className="h-8 w-8 text-psi-primary"
                                        aria-label="Coroa representando exclusividade PRO"
                                    />
                                </div>
                                <div className="flex flex-col items-center mb-2">
                                    <span className="text-5xl font-extrabold text-psi-primary leading-none">R$ 99,90<span className="text-sm text-psi-dark/60 font-medium">/mês</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                        <div>
                                    <p className="text-sm font-medium text-psi-dark mb-1">Assinatura Mensal</p>
                                    <p className="text-sm text-psi-dark/70">
                                        Esta é uma assinatura recorrente mensal. Você será cobrado R$ 99,90 por mês. 
                                        Você pode cancelar a qualquer momento, sem taxas ou compromissos longos. 
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-psi-dark mb-3">Por que assinar o CRM Pro?</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Mail className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Até 5.000 e-mails por mês</p>
                                        <p className="text-sm text-psi-dark/60">
                                            50x mais que o plano básico. Marketing agressivo para alcançar mais clientes e aumentar suas vendas.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bell className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Até 5.000 webpush por mês</p>
                                        <p className="text-sm text-psi-dark/60">
                                            Notificações push no navegador e no celular. No plano Pro você pode enviar até 5.000 webpush por mês para engajar sua audiência em tempo real.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <LayoutPanelTop className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Templates ilimitados</p>
                                        <p className="text-sm text-psi-dark/60">
                                            Acesso a todos os templates premium para campanhas profissionais e personalizadas.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <BarChart3 className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Relatórios avançados</p>
                                        <p className="text-sm text-psi-dark/60">
                                            Análises detalhadas de campanhas e engajamento para tomar decisões estratégicas baseadas em dados.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Eye className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Visão estratégica completa</p>
                                        <p className="text-sm text-psi-dark/60">
                                            Tenha total controle sobre o desempenho das suas campanhas, visualizando resultados por gráficos intuitivos e focados nos objetivos do seu evento.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Stars className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Inteligência Artificial integrada</p>
                                        <p className="text-sm text-psi-dark/60">
                                            Utilize IA para acompanhar toda a jornada de cada cliente, prever comportamento, otimizar campanhas e aumentar suas conversões. Receba recomendações automáticas e monitore a efetividade de cada entrega.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-emerald-900 mb-2">O poder do E-mail Marketing</p>
                                    <ul className="text-sm text-emerald-800 space-y-1 list-disc list-inside mb-3">
                                        <li>ROI médio de R$ 42 para cada R$ 1 investido em e-mail marketing</li>
                                        <li>E-mails personalizados geram 6x mais transações</li>
                                        <li>Campanhas segmentadas aumentam receita em até 760%</li>
                                        <li>E-mail marketing é 40x mais eficaz que redes sociais para conversão</li>
                                        <li>Clientes que recebem e-mails promocionais gastam 83% mais</li>
                                    </ul>
                                    <div className="pt-2 border-t border-emerald-200">
                                        <p className="text-xs text-emerald-700 font-medium mb-1">Fontes:</p>
                                        <ul className="text-xs text-emerald-600 space-y-0.5">
                                            <li>• DMA (Data & Marketing Association) - Email Marketing ROI Report</li>
                                            <li>• Campaign Monitor - Email Marketing Statistics</li>
                                            <li>• Litmus - State of Email Report</li>
                                            <li>• McKinsey & Company - The Value of Email Marketing</li>
                                            <li>• Epsilon - Email Marketing Benchmarks</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="max-w-3xl mx-auto border border-psi-dark/20 rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold text-psi-dark mb-4">Pagamento</h4>
                            <p className="text-sm text-psi-dark/60 mb-4">
                                A assinatura do CRM Pro aceita apenas cartão de crédito. Selecione um cartão cadastrado ou adicione um novo.
                            </p>

                            {isLoadingCards ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-32 w-full" />
                                    <Skeleton className="h-32 w-full" />
                        </div>
                            ) : (
                                <>
                                    {cards.length > 0 && !showNewCardForm && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="text-sm font-medium text-psi-dark">Cartões Cadastrados</h5>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setShowNewCardForm(true)
                                                        setSelectedCardId(null)
                                                    }}
                                                >
                                                    Adicionar novo cartão
                                                </Button>
                    </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {cards.map(card => {
                                                    const isSelected = selectedCardId === card.id
                                                    const cardBrandLower = card.brand.toLowerCase()
                                                    const brandColors: Record<string, { bg: string; text: string }> = {
                                                        visa: { bg: "bg-[#1A1F71]", text: "text-white" },
                                                        mastercard: { bg: "bg-[#EB001B]", text: "text-white" },
                                                        amex: { bg: "bg-[#006FCF]", text: "text-white" },
                                                        elo: { bg: "bg-[#FFCB05]", text: "text-[#231F20]" },
                                                        hipercard: { bg: "bg-[#DF0F50]", text: "text-white" },
                                                        jcb: { bg: "bg-[#052F9C]", text: "text-white" },
                                                        discover: { bg: "bg-[#00AEEF]", text: "text-white" },
                                                        cabal: { bg: "bg-[#000000]", text: "text-white" },
                                                        banescard: { bg: "bg-[#000000]", text: "text-white" },
                                                    }
                                                    const brandColor = brandColors[cardBrandLower] || { bg: "bg-gray-600", text: "text-white" }

                                                    return (
                                                        <button
                                                            key={card.id}
                                                            type="button"
                                                            onClick={() => setSelectedCardId(card.id)}
                                                            className={`relative p-4 rounded-xl border-2 transition-all text-left overflow-hidden ${
                                                                isSelected
                                                                    ? "border-psi-primary bg-psi-primary/5"
                                                                    : "border-psi-dark/10 hover:border-psi-primary/30 bg-white"
                                                            }`}
                                                        >
                                                            <div className={`absolute top-0 right-0 w-20 h-20 ${brandColor.bg} rounded-full -mr-10 -mt-10 opacity-20`} />
                                                            <div className="relative space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="h-10 flex items-center">
                                                                        <img
                                                                            src={getCardBrandIcon(card.brand)}
                                                                            alt={card.brand}
                                                                            className="h-full object-contain"
                                                                        />
                                                                    </div>
                                                                    {isSelected && (
                                                                        <CheckCircle2 className="h-5 w-5 text-psi-primary" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-psi-dark/60 mb-1">Número do Cartão</p>
                                                                    <p className="text-lg font-medium text-psi-dark font-mono">
                                                                        •••• •••• •••• {card.last4}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Nome</p>
                                                                        <p className="text-sm font-medium text-psi-dark">{card.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Validade</p>
                                                                        <p className="text-sm font-medium text-psi-dark">
                                                                            {card.expMonth?.padStart(2, "0")}/{card.expYear?.slice(-2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {(showNewCardForm || cards.length === 0) && (
                                        <div className="space-y-4">
                                            {cards.length > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-sm font-medium text-psi-dark">Novo Cartão</h5>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowNewCardForm(false)
                                                            setCardData({ number: "", name: "", expiry: "", cvv: "" })
                                                            if (cards.length > 0) {
                                                                setSelectedCardId(cards[0].id)
                                                            }
                                                        }}
                                                    >
                                                        Usar cartão cadastrado
                                                    </Button>
                                                </div>
                                            )}
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Número do Cartão *
                                                </label>
                                                <div className="relative">
                                                    <InputMask
                                                        mask="0000 0000 0000 0000"
                                                        value={cardData.number}
                                                        onAccept={(value) => setCardData({ ...cardData, number: value as string })}
                                                        placeholder="0000 0000 0000 0000"
                                                        icon={CreditCard}
                                                    />
                                                    {cardBrand && (
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <img
                                                                src={getCardBrandIcon(cardBrand)}
                                                                alt={cardBrand}
                                                                className="h-10 w-auto object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Nome no Cartão *
                                                </label>
                                                <Input
                                                    value={cardData.name}
                                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                                                    required
                                                />
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Validade *
                                                    </label>
                                                    <InputMask
                                                        mask="00/00"
                                                        value={cardData.expiry}
                                                        onAccept={(value) => setCardData({ ...cardData, expiry: value as string })}
                                                        placeholder="MM/AA"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        CVV *
                                                    </label>
                                                    <InputMask
                                                        mask="000"
                                                        value={cardData.cvv}
                                                        onAccept={(value) => setCardData({ ...cardData, cvv: value as string })}
                                                        placeholder="000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <Separator />
                    <SheetFooter className="gap-2">
                        <div className="flex items-center justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setUpgradeDialog(false)}
                        >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpgradeSubmit}
                                className="gap-2"
                                disabled={isCreatingSubscription || (!selectedCardId && (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv))}
                            >
                                {isCreatingSubscription ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Crown className="h-4 w-4" />
                                        Assinar CRM Pro
                                    </>
                                )}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Sheet open={reportsDialog} onOpenChange={setReportsDialog}>
                <SheetContent side="right" className="w-[95vw] sm:w-[95vw] lg:w-[1400px] 3xl:w-[1800px] p-4 overflow-y-auto">
                    <SheetHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <SheetTitle className="text-2xl font-semibold text-psi-primary flex items-center gap-2">
                                    <BarChart3 className="h-6 w-6" />
                                    Relatórios Avançados
                                </SheetTitle>
                                <SheetDescription className="text-base mt-2">
                                    Análises detalhadas e insights estratégicos do seu CRM
                                </SheetDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={async () => {
                                        setIsDownloadingReport(true)
                                        try {
                                            const blob = await ReportService.downloadReport("pdf", reportFilters)
                                            const url = window.URL.createObjectURL(blob)
                                            const a = document.createElement("a")
                                            a.href = url
                                            a.download = `relatorio-crm-${new Date().toISOString().split("T")[0]}.pdf`
                                            document.body.appendChild(a)
                                            a.click()
                                            document.body.removeChild(a)
                                            window.URL.revokeObjectURL(url)
                                            Toast.success("Relatório PDF baixado com sucesso!")
                                        } catch (error) {
                                            Toast.error("Erro ao baixar relatório")
                                        } finally {
                                            setIsDownloadingReport(false)
                                        }
                                    }}
                                    disabled={isDownloadingReport}
                                >
                                    <Download className="h-4 w-4" />
                                    Exportar PDF
                                </Button>
                        </div>
                        </div>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                        <div className="bg-white rounded-lg border border-psi-dark/10 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="h-5 w-5 text-psi-primary" />
                                <h3 className="font-semibold text-psi-dark">Filtros</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-psi-dark/70 mb-1.5">Data Inicial</label>
                                    <DatePicker
                                        value={reportDateFrom}
                                        onChange={setReportDateFrom}
                                        absoluteClassName={true}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-psi-dark/70 mb-1.5">Data Final</label>
                                    <DatePicker
                                        value={reportDateTo}
                                        onChange={setReportDateTo}
                                        absoluteClassName={true}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-psi-dark/70 mb-1.5">Tags</label>
                                    <Select
                                        value={selectedReportTags.length > 0 ? selectedReportTags[0] : ""}
                                        onValueChange={(value) => {
                                            if (value && !selectedReportTags.includes(value)) {
                                                setSelectedReportTags([...selectedReportTags, value])
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione tags" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tags.map((tag) => (
                                                <SelectItem key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedReportTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedReportTags.map((tagId) => {
                                                const tag = tags.find((t) => t.id === tagId)
                                                return tag ? (
                                                    <Badge
                                                        key={tagId}
                                                        className="gap-1"
                                                        style={{ backgroundColor: tag.color + "20", borderColor: tag.color, color: tag.color }}
                                                    >
                                                        {tag.name}
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() => setSelectedReportTags(selectedReportTags.filter((id) => id !== tagId))}
                                                        />
                                                    </Badge>
                                                ) : null
                                            })}
                            </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-psi-dark/70 mb-1.5">Eventos</label>
                                    <Select
                                        value={selectedReportEvents.length > 0 ? selectedReportEvents[0] : ""}
                                        onValueChange={(value) => {
                                            if (value && !selectedReportEvents.includes(value)) {
                                                setSelectedReportEvents([...selectedReportEvents, value])
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione eventos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {events.map((event) => (
                                                <SelectItem key={event.id} value={event.id}>
                                                    {event.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedReportEvents.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedReportEvents.map((eventId) => {
                                                const event = events.find((e) => e.id === eventId)
                                                return event ? (
                                                    <Badge key={eventId} variant="outline" className="gap-1">
                                                        {event.name}
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() => setSelectedReportEvents(selectedReportEvents.filter((id) => id !== eventId))}
                                                        />
                                                    </Badge>
                                                ) : null
                                            })}
                                </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        setReportFilters({
                                            dateFrom: reportDateFrom || undefined,
                                            dateTo: reportDateTo || undefined,
                                            tagIds: selectedReportTags.length > 0 ? selectedReportTags : undefined,
                                            eventIds: selectedReportEvents.length > 0 ? selectedReportEvents : undefined
                                        })
                                    }}
                                >
                                    Aplicar Filtros
                                </Button>
                            </div>
                        </div>

                        {reportLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-64 w-full" />
                                ))}
                                    </div>
                        ) : !reportData ? null : (
                            (() => {
                                const COLORS = ["#6C4BFF", "#FF6F91", "#FFD447", "#4ECDC4", "#FF6B6B"]
                                
                                const averageDeliveryRate = reportData.campaignPerformance.length > 0
                                    ? reportData.campaignPerformance.reduce((sum, campaign) => sum + campaign.deliveredRate, 0) / reportData.campaignPerformance.length
                                    : 0
                                
                                return (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                                        <Card className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm text-psi-dark/60">Total de Campanhas</p>
                                                <Mail className="h-4 w-4 text-psi-primary" />
                                            </div>
                                            <p className="text-2xl font-bold text-psi-dark">{reportData.overview.totalCampaigns}</p>
                                        </Card>
                                    </div>

                                    <div className="bg-white rounded-lg border border-psi-dark/10 p-6 mb-6">
                                        <h3 className="font-semibold text-psi-dark mb-4">Funil de Engajamento</h3>
                                        <div className="space-y-6">
                                            <div className="flex flex-col items-center">
                                                <div className="w-full max-w-4xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <MailCheck className="h-4 w-4 text-psi-primary" />
                                                            <p className="text-sm font-medium text-psi-dark">Taxa de Entrega</p>
                                                        </div>
                                                        <p className="text-lg font-bold text-psi-dark">{averageDeliveryRate.toFixed(1)}%</p>
                                                    </div>
                                                    <div className="w-full bg-psi-dark/10 rounded-lg h-12 overflow-hidden relative">
                                                        <div 
                                                            className="bg-psi-primary h-full rounded-lg transition-all flex items-center justify-end pr-4"
                                                            style={{ width: `${averageDeliveryRate}%` }}
                                                        >
                                                            <span className="text-white text-xs font-medium">{averageDeliveryRate.toFixed(1)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-center">
                                                <div className="w-full max-w-3xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <MailOpen className="h-4 w-4 text-psi-secondary" />
                                                            <p className="text-sm font-medium text-psi-dark">Taxa de Abertura</p>
                                                        </div>
                                                        <p className="text-lg font-bold text-psi-dark">{reportData.overview.averageOpenRate.toFixed(1)}%</p>
                                                    </div>
                                                    <div className="w-full bg-psi-dark/10 rounded-lg h-12 overflow-hidden relative">
                                                        <div 
                                                            className="bg-psi-secondary h-full rounded-lg transition-all flex items-center justify-end pr-4"
                                                            style={{ width: `${reportData.overview.averageOpenRate}%` }}
                                                        >
                                                            <span className="text-white text-xs font-medium">{reportData.overview.averageOpenRate.toFixed(1)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-center">
                                                <div className="w-full max-w-2xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <MousePointer className="h-4 w-4 text-psi-tertiary" />
                                                            <p className="text-sm font-medium text-psi-dark">Taxa de Clique</p>
                                                        </div>
                                                        <p className="text-lg font-bold text-psi-dark">{reportData.overview.averageClickRate.toFixed(1)}%</p>
                                                    </div>
                                                    <div className="w-full bg-psi-dark/10 rounded-lg h-12 overflow-hidden relative">
                                                        <div 
                                                            className="bg-psi-tertiary h-full rounded-lg transition-all flex items-center justify-end pr-4"
                                                            style={{ width: `${reportData.overview.averageClickRate}%` }}
                                                        >
                                                            <span className="text-white text-xs font-medium">{reportData.overview.averageClickRate.toFixed(1)}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-6 border-t border-psi-dark/10">
                                            <div className="flex items-center justify-center gap-2">
                                                <DollarSign className="h-5 w-5 text-emerald-600" />
                                                <p className="text-sm font-medium text-psi-dark/70">Receita Total:</p>
                                                <p className="text-xl font-bold text-psi-dark">{ValueUtils.centsToCurrency(reportData.overview.totalRevenue)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                        <h3 className="font-semibold text-psi-dark mb-4 flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-psi-primary" />
                                            Sugestões por IA
                                        </h3>
                            <div className="space-y-3">
                                            {reportData.aiSuggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion.id}
                                                    className={`p-4 rounded-lg border ${
                                                        suggestion.priority === "high"
                                                            ? "border-psi-primary/30 bg-psi-primary/5"
                                                            : suggestion.priority === "medium"
                                                            ? "border-psi-secondary/30 bg-psi-secondary/5"
                                                            : "border-psi-dark/10 bg-psi-dark/5"
                                                    }`}
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-psi-dark">{suggestion.title}</h4>
                                                            <Badge
                                                                variant={
                                                                    suggestion.priority === "high"
                                                                        ? "destructive"
                                                                        : suggestion.priority === "medium"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {suggestion.priority === "high" ? "Alta" : suggestion.priority === "medium" ? "Média" : "Baixa"}
                                                            </Badge>
                                    </div>
                                                        <p className="text-sm text-psi-dark/70">{suggestion.description}</p>
                                    </div>
                                </div>
                                            ))}
                                    </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                            <h3 className="font-semibold text-psi-dark mb-4">Performance de Campanhas</h3>
                                            <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                                {reportData.campaignPerformance.map((campaign) => (
                                                    <div key={campaign.campaignId} className="border-b border-psi-dark/10 pb-4 last:border-0 last:pb-0">
                                                        <div className="flex items-start justify-between mb-2">
                                    <div>
                                                                <p className="font-medium text-psi-dark">{campaign.templateName}</p>
                                                                <p className="text-xs text-psi-dark/60 mt-1">{campaign.subject}</p>
                                    </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                {new Date(campaign.sentAt).toLocaleDateString("pt-BR")}
                                                            </Badge>
                                </div>
                                                        <div className="mt-4">
                                                            <div className="flex items-end gap-1.5 h-36">
                                                                <div className="flex-1 flex flex-col items-center justify-end min-w-0">
                                                                    <div className="w-full bg-psi-dark/10 rounded-t-lg p-2.5 text-center h-full flex flex-col justify-end">
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Enviados</p>
                                                                        <p className="text-base font-bold text-psi-dark">{campaign.totalRecipients}</p>
                                                                        <p className="text-xs text-psi-dark/50 mt-0.5">100%</p>
                                    </div>
                                    </div>
                                                                <div className="flex-1 flex flex-col items-center justify-end min-w-0" style={{ flex: `${campaign.deliveredRate / 100}` }}>
                                                                    <div className="w-full bg-psi-primary/20 rounded-t-lg p-2.5 text-center border-t-2 border-psi-primary h-full flex flex-col justify-end">
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Entregues</p>
                                                                        <p className="text-base font-bold text-psi-primary">{campaign.deliveredCount}</p>
                                                                        <p className="text-xs text-psi-dark/50 mt-0.5">{campaign.deliveredRate.toFixed(1)}%</p>
                                </div>
                                    </div>
                                                                <div className="flex-1 flex flex-col items-center justify-end min-w-0" style={{ flex: `${campaign.acceptedRate / 100}` }}>
                                                                    <div className="w-full bg-psi-secondary/20 rounded-t-lg p-2.5 text-center border-t-2 border-psi-secondary h-full flex flex-col justify-end">
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Aceitos</p>
                                                                        <p className="text-base font-bold text-psi-secondary">{campaign.acceptedCount}</p>
                                                                        <p className="text-xs text-psi-dark/50 mt-0.5">{campaign.acceptedRate.toFixed(1)}%</p>
                                    </div>
                                </div>
                                                                <div className="flex-1 flex flex-col items-center justify-end min-w-0" style={{ flex: `${campaign.openRate / 100}` }}>
                                                                    <div className="w-full bg-psi-tertiary/20 rounded-t-lg p-2.5 text-center border-t-2 border-psi-tertiary h-full flex flex-col justify-end">
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Abertos</p>
                                                                        <p className="text-base font-bold text-psi-tertiary">{campaign.openedCount}</p>
                                                                        <p className="text-xs text-psi-dark/50 mt-0.5">{campaign.openRate.toFixed(1)}%</p>
                                    </div>
                                    </div>
                                                                <div className="flex-1 flex flex-col items-center justify-end min-w-0" style={{ flex: `${campaign.clickRate / 100}` }}>
                                                                    <div className="w-full bg-psi-primary/30 rounded-t-lg p-2.5 text-center border-t-2 border-psi-primary h-full flex flex-col justify-end">
                                                                        <p className="text-xs text-psi-dark/60 mb-1">Cliques</p>
                                                                        <p className="text-base font-bold text-psi-primary">{campaign.clickedCount}</p>
                                                                        <p className="text-xs text-psi-dark/50 mt-0.5">{campaign.clickRate.toFixed(1)}%</p>
                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                </div>
                                                ))}
                            </div>
                        </div>

                                        <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-psi-dark">Estatísticas ao Longo do Tempo</h3>
                                                <div className="flex items-center gap-2">
                                                    <Select value={selectedStatsMonth} onValueChange={setSelectedStatsMonth}>
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue placeholder="Selecione o mês" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableStatsMonths.map((month) => (
                                                                <SelectItem key={month} value={month}>
                                                                    {month}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={selectedStatsYear} onValueChange={setSelectedStatsYear}>
                                                        <SelectTrigger className="w-[100px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableStatsYears.map((year) => (
                                                                <SelectItem key={year} value={year.toString()}>
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                </div>
                            </div>
                                            <ResponsiveContainer width="100%" height={500}>
                                                <ComposedChart data={filteredCampaignStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                                                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar yAxisId="left" dataKey="sent" fill="#6C4BFF" name="Enviados" radius={[4, 4, 0, 0]} />
                                                    <Bar yAxisId="left" dataKey="opened" fill="#FF6F91" name="Abertos" radius={[4, 4, 0, 0]} />
                                                    <Line yAxisId="right" type="monotone" dataKey="clicked" stroke="#FFD447" strokeWidth={3} name="Cliques" dot={{ fill: "#FFD447", r: 4 }} />
                                                </ComposedChart>
                                            </ResponsiveContainer>
                        </div>
                    </div>

                                    <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-psi-dark">Entrada de Clientes</h3>
                                            <Select value={selectedReportYear} onValueChange={setSelectedReportYear}>
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableYears.map((year) => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                        </div>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={filteredCustomerEntries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 11 }} />
                                                <Tooltip />
                                                <Legend />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="newCustomers" 
                                                    stroke="#6C4BFF" 
                                                    strokeWidth={3}
                                                    name="Novos Clientes"
                                                    dot={{ fill: "#6C4BFF", r: 5 }}
                                                    activeDot={{ r: 7 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                            <h3 className="font-semibold text-psi-dark mb-4">Vendas por Evento</h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart data={reportData.salesByEvent} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                                    <YAxis dataKey="eventName" type="category" width={150} tick={{ fontSize: 11 }} />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="ticketsSold" fill="#6C4BFF" name="Ingressos Vendidos" radius={[0, 4, 4, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                    </div>

                                        <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                            <h3 className="font-semibold text-psi-dark mb-4">Segmentos de Clientes</h3>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <PieChart>
                                                    <Pie
                                                        data={reportData.customerSegments}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={(props: any) => {
                                                            const { segmentName, customerCount } = props
                                                            return `${segmentName}: ${customerCount}`
                                                        }}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="customerCount"
                                                    >
                                                        {reportData.customerSegments.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg border border-psi-dark/10 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-psi-dark">Segmentos de Clientes - Detalhes</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEngagementDialog(true)}
                                                className="gap-2 text-psi-primary hover:text-psi-primary/80"
                                            >
                                                <Info className="h-4 w-4" />
                                                Como funciona o cálculo de engajamento?
                                            </Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Segmento</TableHead>
                                                        <TableHead>Clientes</TableHead>
                                                        <TableHead>Ticket Médio</TableHead>
                                                        <TableHead>Receita Total</TableHead>
                                                        <TableHead>Engajamento</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {reportData.customerSegments.map((segment) => (
                                                        <TableRow key={segment.segmentName}>
                                                            <TableCell className="font-medium">{segment.segmentName}</TableCell>
                                                            <TableCell>{segment.customerCount}</TableCell>
                                                            <TableCell>{ValueUtils.centsToCurrency(segment.averageTicketPrice)}</TableCell>
                                                            <TableCell>{ValueUtils.centsToCurrency(segment.totalRevenue)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex-1 bg-psi-dark/10 rounded-full h-2">
                                                                        <div
                                                                            className="bg-psi-primary h-2 rounded-full"
                                                                            style={{ width: `${(segment.engagementScore / 10) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm text-psi-dark/70">{segment.engagementScore.toFixed(1)}</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </>
                                )
                            })()
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={engagementDialog} onOpenChange={setEngagementDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-psi-dark flex items-center gap-2">
                            <Info className="h-5 w-5 text-psi-primary" />
                            Como funciona o cálculo de engajamento?
                        </DialogTitle>
                        <DialogDescription className="text-base mt-2">
                            Entenda como é calculado o score de engajamento dos segmentos de clientes
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-psi-primary/5 border border-psi-primary/20 rounded-lg p-4">
                            <h4 className="font-semibold text-psi-dark mb-2">O que é o Score de Engajamento?</h4>
                            <p className="text-sm text-psi-dark/70">
                                O score de engajamento é uma métrica que varia de 0 a 10 e indica o nível de interação e participação dos clientes de um segmento com suas campanhas e eventos.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-psi-dark mb-3">Fatores que influenciam o cálculo:</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <MailOpen className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Taxa de Abertura de E-mails</p>
                                        <p className="text-sm text-psi-dark/70">
                                            Percentual de e-mails abertos pelos clientes do segmento. Quanto maior a taxa, maior o engajamento.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <MousePointer className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Taxa de Clique em Links</p>
                                        <p className="text-sm text-psi-dark/70">
                                            Percentual de cliques em links dos e-mails. Indica interesse ativo no conteúdo.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Ticket className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Frequência de Compra</p>
                                        <p className="text-sm text-psi-dark/70">
                                            Quantidade de ingressos comprados por cliente no período analisado. Clientes mais frequentes têm maior engajamento.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-psi-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Calendar className="h-4 w-4 text-psi-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-psi-dark">Recência de Interação</p>
                                        <p className="text-sm text-psi-dark/70">
                                            Tempo desde a última compra ou interação. Clientes que interagiram recentemente têm maior engajamento.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-psi-secondary/5 border border-psi-secondary/20 rounded-lg p-4">
                            <h4 className="font-semibold text-psi-dark mb-2">Interpretação do Score</h4>
                            <ul className="text-sm text-psi-dark/70 space-y-1 list-disc list-inside">
                                <li><strong>8.0 - 10.0:</strong> Engajamento muito alto - Clientes altamente ativos e engajados</li>
                                <li><strong>6.0 - 7.9:</strong> Engajamento alto - Clientes regulares e interessados</li>
                                <li><strong>4.0 - 5.9:</strong> Engajamento médio - Clientes com participação moderada</li>
                                <li><strong>0.0 - 3.9:</strong> Engajamento baixo - Clientes pouco ativos ou inativos</li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="primary" onClick={() => setEngagementDialog(false)}>
                            Entendi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={exportDialog} onOpenChange={setExportDialog}>
                <DialogContent className="w-full p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-psi-dark">
                            <FileSpreadsheet className="h-5 w-5 text-psi-primary" />
                            Exportar Lista de Clientes
                        </DialogTitle>
                        <DialogDescription className="text-psi-dark/70 mt-2">
                            Escolha o formato em que deseja exportar a lista de clientes.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-3 p-4 rounded-xl border border-psi-primary/20 bg-psi-primary/5">
                            <p className="text-sm font-medium text-psi-dark">Filtros</p>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-psi-dark/70 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Segmento
                                </label>
                                <div className="flex gap-2">
                            <Select
                                value={selectedExportSegment || ""}
                                onValueChange={(value) => setSelectedExportSegment(value)}
                            >
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Selecione uma tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    {emailSegments
                                        .filter(segment => segment.type === "tag")
                                        .map(segment => (
                                            <SelectItem key={segment.id} value={segment.id}>
                                                {segment.name} ({segment.count} clientes)
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setViewSegmentCustomersDialog(true)}
                                    disabled={!selectedExportSegment}
                                    className="shrink-0"
                                    title="Visualizar clientes da tag"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleDownload("pdf", selectedExportSegment)}
                                disabled={isGenerating || !selectedExportSegment}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                            {isGenerating && selectedFormat === "pdf" ? (
                                                <Loader2 className="h-6 w-6 text-psi-primary animate-spin" />
                                            ) : (
                                                <FileText className="h-6 w-6 text-psi-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-psi-dark">PDF</p>
                                                <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20">
                                                    Mais utilizado
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                Performance ideal para impressão e compartilhamento
                                            </p>
                                        </div>
                                    </div>
                                    {isGenerating && selectedFormat === "pdf" ? (
                                        <Loader2 className="h-5 w-5 text-psi-primary animate-spin" />
                                    ) : (
                                        <Download className="h-5 w-5 text-psi-dark/40" />
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => handleDownload("xlsx", selectedExportSegment)}
                                disabled={isGenerating || !selectedExportSegment}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                            {isGenerating && selectedFormat === "xlsx" ? (
                                                <Loader2 className="h-6 w-6 text-psi-primary animate-spin" />
                                            ) : (
                                                <FileSpreadsheet className="h-6 w-6 text-psi-primary/80" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-psi-dark">Excel (xlsx)</p>
                                            </div>
                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                Formato ideal para análise e edição
                                            </p>
                                        </div>
                                    </div>
                                    {isGenerating && selectedFormat === "xlsx" ? (
                                        <Loader2 className="h-5 w-5 text-psi-primary animate-spin" />
                                    ) : (
                                        <Download className="h-5 w-5 text-psi-dark/40" />
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => handleDownload("csv", selectedExportSegment)}
                                disabled={isGenerating || !selectedExportSegment}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                                    "focus:outline-none focus:ring-2 focus:ring-psi-primary focus:ring-offset-2"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-psi-secondary/10 flex items-center justify-center">
                                            {isGenerating && selectedFormat === "csv" ? (
                                                <Loader2 className="h-6 w-6 text-psi-secondary animate-spin" />
                                            ) : (
                                                <FileText className="h-6 w-6 text-psi-secondary" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">CSV</p>
                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                Formato simples e compatível
                                            </p>
                                        </div>
                                    </div>
                                    {isGenerating && selectedFormat === "csv" ? (
                                        <Loader2 className="h-5 w-5 text-psi-secondary animate-spin" />
                                    ) : (
                                        <Download className="h-5 w-5 text-psi-dark/40" />
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => handleDownload("json", selectedExportSegment)}
                                disabled={isGenerating || !selectedExportSegment}
                                className={cn(
                                    "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                                    "focus:outline-none focus:ring-2 focus:ring-psi-primary focus:ring-offset-2"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-psi-tertiary/10 flex items-center justify-center">
                                            {isGenerating && selectedFormat === "json" ? (
                                                <Loader2 className="h-6 w-6 text-psi-tertiary animate-spin" />
                                            ) : (
                                                <Code className="h-6 w-6 text-psi-tertiary" />
                                            )}
                            </div>
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">JSON</p>
                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                Formato para integração e desenvolvimento
                                            </p>
                        </div>
                    </div>
                                    {isGenerating && selectedFormat === "json" ? (
                                        <Loader2 className="h-5 w-5 text-psi-tertiary animate-spin" />
                                    ) : (
                                        <Download className="h-5 w-5 text-psi-dark/40" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                        <DialogClose asChild>
                        <Button
                            variant="outline"
                                className="w-full sm:w-auto"
                            onClick={() => {
                                setSelectedExportSegment("")
                            }}
                        >
                            Cancelar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={viewSegmentCustomersDialog} onOpenChange={setViewSegmentCustomersDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Clientes do Segmento</DialogTitle>
                        <DialogDescription>
                            {selectedExportSegment && selectedExportSegment !== "all" ? (
                                <>
                                    Visualizando clientes do segmento: <strong>{emailSegments.find(s => s.id === selectedExportSegment)?.name}</strong>
                                </>
                            ) : (
                                "Selecione um segmento para visualizar os clientes"
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {!selectedExportSegment || selectedExportSegment === "all" ? (
                            <p className="text-sm text-psi-dark/60 text-center py-8">
                                Selecione um segmento específico para visualizar os clientes
                            </p>
                        ) : (() => {
                            const segment = emailSegments.find(s => s.id === selectedExportSegment)
                            if (!segment) return null
                            
                            let segmentCustomers: TCustomer[] = []
                            
                            if (segment.type === "event") {
                                const segmentName = segment.name.replace("Evento: ", "").trim()
                                segmentCustomers = customers.filter(c => 
                                    c.events.some(e => e.name.toLowerCase().includes(segmentName.toLowerCase()) || e.id === selectedExportSegment)
                                )
                            } else if (segment.type === "tag") {
                                const segmentName = segment.name.replace("Tag: ", "").trim()
                                segmentCustomers = customers.filter(c => 
                                    c.tags.some(t => t.name.toLowerCase().includes(segmentName.toLowerCase()) || t.id === selectedExportSegment)
                                )
                            } else {
                                segmentCustomers = customers
                            }
                            
                            return (
                                <>
                                    <div className="border border-psi-dark/10 rounded-lg p-4 bg-psi-primary/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-psi-dark">{segment.name}</h4>
                                            <Badge variant="outline" className="text-xs">
                                                {segment.type === "event" ? "Evento" : segment.type === "tag" ? "Tag" : "Personalizado"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-psi-dark/60 mb-2">{segment.description}</p>
                                        <p className="text-sm text-psi-dark/70">
                                            <strong>Total de clientes:</strong> {segmentCustomers.length}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {segmentCustomers.length === 0 ? (
                                            <p className="text-sm text-psi-dark/60 text-center py-8">
                                                Nenhum cliente encontrado neste segmento
                                            </p>
                                        ) : (
                                            segmentCustomers.map(customer => (
                                                <div key={customer.id} className="flex items-center justify-between p-3 border border-psi-dark/10 rounded-lg hover:bg-psi-primary/5 transition-colors">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-psi-dark text-sm truncate">{customer.name}</p>
                                                        <p className="text-xs text-psi-dark/60 truncate">{customer.email}</p>
                                                        {customer.phone && (
                                                            <p className="text-xs text-psi-dark/50 mt-1">{customer.phone}</p>
                                                        )}
                                                    </div>
                                                    {customer.tags && customer.tags.length > 0 && (
                                                        <div className="flex gap-1 ml-2 flex-wrap">
                                                            {customer.tags.slice(0, 2).map(tag => (
                                                                <Badge
                                                                    key={tag.id}
                                                                    variant="outline"
                                                                    style={{ borderColor: tag.color, color: tag.color }}
                                                                    className="text-xs"
                                                                >
                                                                    {tag.name}
                                                                </Badge>
                                                            ))}
                                                            {customer.tags.length > 2 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{customer.tags.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )
                        })()}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setViewSegmentCustomersDialog(false)}
                        >
                            Fechar
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
                                            ? customers 
                                            : segment.type === "event"
                                                ? customers.filter(c => c.events.some(e => e.id === segmentId))
                                                : segment.type === "tag"
                                                    ? customers.filter(c => c.tags.some(t => t.id === segmentId))
                                                    : customers
                                        
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

            <Dialog open={reportsProDialog} onOpenChange={setReportsProDialog}>
                <DialogContent className="max-w-lg p-0 overflow-hidden">
                    <div className="relative overflow-hidden bg-gradient-to-br from-psi-primary/10 via-psi-secondary/5 to-psi-tertiary/10 p-6">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-psi-primary/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-psi-tertiary/20 rounded-full blur-3xl" />
                        </div>
                        <div className="relative flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-psi-primary to-psi-secondary flex items-center justify-center mb-4 shadow-lg">
                                <Crown className="h-8 w-8 text-white" />
                            </div>
                            <DialogTitle className="text-2xl font-bold text-psi-dark mb-2">
                                Relatórios Avançados
                            </DialogTitle>
                            <DialogDescription className="text-base text-psi-dark/70">
                                Exclusivo do plano <span className="font-semibold text-psi-primary">CRM Pro</span>
                            </DialogDescription>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-psi-primary/20 bg-psi-primary/5 hover:bg-psi-primary/10 transition-colors">
                                <div className="h-12 w-12 rounded-lg bg-psi-primary/20 flex items-center justify-center shrink-0">
                                    <BarChart3 className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-psi-dark mb-1">Análises Detalhadas</p>
                                    <p className="text-sm text-psi-dark/60 leading-relaxed">
                                        Visualize métricas completas de suas campanhas, clientes e performance com gráficos interativos e insights profundos.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-psi-secondary/20 bg-psi-secondary/5 hover:bg-psi-secondary/10 transition-colors">
                                <div className="h-12 w-12 rounded-lg bg-psi-secondary/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-6 w-6 text-psi-secondary" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-psi-dark mb-1">Sugestões por IA</p>
                                    <p className="text-sm text-psi-dark/60 leading-relaxed">
                                        Receba recomendações inteligentes e personalizadas para otimizar suas campanhas e aumentar o engajamento dos clientes.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-psi-tertiary/20 bg-psi-tertiary/5 hover:bg-psi-tertiary/10 transition-colors">
                                <div className="h-12 w-12 rounded-lg bg-psi-tertiary/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="h-6 w-6 text-psi-dark/80" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-psi-dark mb-1">Insights Estratégicos</p>
                                    <p className="text-sm text-psi-dark/60 leading-relaxed">
                                        Tome decisões baseadas em dados reais e aumente sua receita com análises de funil de conversão e segmentação avançada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="px-6 pb-6 pt-0">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setReportsProDialog(false)}
                                className="flex-1"
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setReportsProDialog(false)
                                    setUpgradeDialog(true)
                                }}
                                className="flex-1 gap-2"
                            >
                                <Crown className="h-4 w-4" />
                                Assinar CRM Pro
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={cancelSubscriptionDialog} onOpenChange={setCancelSubscriptionDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            Cancelar Assinatura CRM Pro
                        </DialogTitle>
                        <DialogDescription className="pt-2 space-y-2">
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-sm font-medium text-amber-900 mb-1">
                                    ⚠️ Atenção: Esta ação é irreversível
                                </p>
                                <p className="text-xs text-amber-800">
                                    Ao cancelar sua assinatura, você perderá acesso a todos os benefícios do CRM Pro.
                                </p>
                            </div>
                            <div className="pt-2 space-y-2">
                                <p className="text-sm font-medium text-psi-dark">Você perderá acesso a:</p>
                                <ul className="text-sm text-psi-dark/70 space-y-1 list-disc list-inside">
                                    <li>Envio de até 5.000 e-mails por mês (voltará para 100 e-mails/mês)</li>
                                    <li>Relatórios avançados e análises detalhadas</li>
                                    <li>Sugestões frequentes por IA</li>
                                    <li>Templates premium de e-mail</li>
                                </ul>
                                <p className="text-sm text-psi-dark/70 mt-3">
                                    Sua assinatura será cancelada ao final do período atual. Você continuará tendo acesso ao CRM Pro até o fim do período já pago.
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCancelSubscriptionDialog(false)}
                            disabled={isCancellingSubscription}
                        >
                            Manter Assinatura
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                setCancelSubscriptionDialog(false)
                                setPasswordConfirmationDialog(true)
                            }}
                            disabled={isCancellingSubscription}
                        >
                            Confirmar Cancelamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={updateCardDialog} onOpenChange={(open) => {
                setUpdateCardDialog(open)
                if (!open) {
                    setSelectedCardIdForUpdate(null)
                    setShowNewCardFormForUpdate(false)
                    setCardDataForUpdate({ number: "", name: "", expiry: "", cvv: "" })
                }
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Atualizar Cartão de Crédito</DialogTitle>
                        <DialogDescription>
                            Escolha um cartão cadastrado ou adicione um novo cartão para sua assinatura CRM Pro
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {isLoadingCards ? (
                            <div className="space-y-4">
                                <Skeleton className="h-32 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        ) : (
                            <>
                                {cards.length > 0 && !showNewCardFormForUpdate && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-sm font-medium text-psi-dark">Cartões Cadastrados</h5>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowNewCardFormForUpdate(true)
                                                    setSelectedCardIdForUpdate(null)
                                                }}
                                            >
                                                Adicionar novo cartão
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {cards.map(card => {
                                                const isSelected = selectedCardIdForUpdate === card.id
                                                const cardBrandLower = card.brand.toLowerCase()
                                                const brandColors: Record<string, { bg: string; text: string }> = {
                                                    visa: { bg: "bg-[#1A1F71]", text: "text-white" },
                                                    mastercard: { bg: "bg-[#EB001B]", text: "text-white" },
                                                    amex: { bg: "bg-[#006FCF]", text: "text-white" },
                                                    elo: { bg: "bg-[#FFCB05]", text: "text-[#231F20]" },
                                                    hipercard: { bg: "bg-[#DF0F50]", text: "text-white" },
                                                    jcb: { bg: "bg-[#052F9C]", text: "text-white" },
                                                    discover: { bg: "bg-[#00AEEF]", text: "text-white" },
                                                    cabal: { bg: "bg-[#000000]", text: "text-white" },
                                                    banescard: { bg: "bg-[#000000]", text: "text-white" },
                                                }
                                                const brandColor = brandColors[cardBrandLower] || { bg: "bg-gray-600", text: "text-white" }

                                                return (
                                                    <button
                                                        key={card.id}
                                                        type="button"
                                                        onClick={() => setSelectedCardIdForUpdate(card.id)}
                                                        className={`relative p-4 rounded-xl border-2 transition-all text-left overflow-hidden ${
                                                            isSelected
                                                                ? "border-psi-primary bg-psi-primary/5"
                                                                : "border-psi-dark/10 hover:border-psi-primary/30 bg-white"
                                                        }`}
                                                    >
                                                        <div className={`absolute top-0 right-0 w-20 h-20 ${brandColor.bg} rounded-full -mr-10 -mt-10 opacity-20`} />
                                                        <div className="relative space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className="h-10 flex items-center">
                                                                    <img
                                                                        src={getCardBrandIcon(card.brand)}
                                                                        alt={card.brand}
                                                                        className="h-full object-contain"
                                                                    />
                                                                </div>
                                                                {isSelected && (
                                                                    <CheckCircle2 className="h-5 w-5 text-psi-primary" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-psi-dark/60 mb-1">Número do Cartão</p>
                                                                <p className="text-lg font-medium text-psi-dark font-mono">
                                                                    •••• •••• •••• {card.last4}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs text-psi-dark/60 mb-1">Nome</p>
                                                                    <p className="text-sm font-medium text-psi-dark">{card.name}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-psi-dark/60 mb-1">Validade</p>
                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                        {card.expMonth?.padStart(2, "0")}/{card.expYear?.slice(-2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {(showNewCardFormForUpdate || cards.length === 0) && (
                                    <div className="space-y-4">
                                        {cards.length > 0 && (
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-sm font-medium text-psi-dark">Novo Cartão</h5>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setShowNewCardFormForUpdate(false)
                                                        setCardDataForUpdate({ number: "", name: "", expiry: "", cvv: "" })
                                                        if (cards.length > 0) {
                                                            setSelectedCardIdForUpdate(cards[0].id)
                                                        }
                                                    }}
                                                >
                                                    Usar cartão cadastrado
                                                </Button>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Número do Cartão *
                                            </label>
                                            <div className="relative">
                                                <InputMask
                                                    mask="0000 0000 0000 0000"
                                                    value={cardDataForUpdate.number}
                                                    onAccept={(value) => setCardDataForUpdate({ ...cardDataForUpdate, number: value as string })}
                                                    placeholder="0000 0000 0000 0000"
                                                    icon={CreditCard}
                                                />
                                                {cardBrandForUpdate && (
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <img
                                                            src={getCardBrandIcon(cardBrandForUpdate)}
                                                            alt={cardBrandForUpdate}
                                                            className="h-10 w-auto object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Nome no Cartão *
                                            </label>
                                            <Input
                                                value={cardDataForUpdate.name}
                                                onChange={(e) => setCardDataForUpdate({ ...cardDataForUpdate, name: e.target.value.toUpperCase() })}
                                                placeholder="NOME COMO ESTÁ NO CARTÃO"
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Validade *
                                                </label>
                                                <InputMask
                                                    mask="00/00"
                                                    value={cardDataForUpdate.expiry}
                                                    onAccept={(value) => setCardDataForUpdate({ ...cardDataForUpdate, expiry: value as string })}
                                                    placeholder="MM/AA"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    CVV *
                                                </label>
                                                <InputMask
                                                    mask="000"
                                                    value={cardDataForUpdate.cvv}
                                                    onAccept={(value) => setCardDataForUpdate({ ...cardDataForUpdate, cvv: value as string })}
                                                    placeholder="000"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setUpdateCardDialog(false)
                                setSelectedCardIdForUpdate(null)
                                setShowNewCardFormForUpdate(false)
                                setCardDataForUpdate({ number: "", name: "", expiry: "", cvv: "" })
                            }}
                            disabled={isUpdatingCreditCard}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={async () => {
                                try {
                                    let payload: TUpdateSubscriptionCreditCard

                                    if (selectedCardIdForUpdate) {
                                        payload = {
                                            creditCardToken: selectedCardIdForUpdate
                                        }
                                    } else {
                                        if (!cardDataForUpdate.number || !cardDataForUpdate.name || !cardDataForUpdate.expiry || !cardDataForUpdate.cvv) {
                                            Toast.error("Por favor, preencha todos os campos do cartão de crédito ou selecione um cartão cadastrado.")
                                            return
                                        }

                                        if (!user) {
                                            Toast.error("Erro ao obter informações do usuário")
                                            return
                                        }

                                        if (!user.Address) {
                                            Toast.error("Por favor, complete seu endereço no perfil antes de atualizar o cartão")
                                            return
                                        }

                                        if (!user.document) {
                                            Toast.error("Por favor, complete seu documento no perfil antes de atualizar o cartão")
                                            return
                                        }

                                        if (!user.phone) {
                                            Toast.error("Por favor, complete seu telefone no perfil antes de atualizar o cartão")
                                            return
                                        }

                                        const [expMonth, expYear] = cardDataForUpdate.expiry.split("/")
                                        const cardNumber = cardDataForUpdate.number.replace(/\s/g, "")
                                        const zipCode = user.Address.zipCode.replace(/\D/g, "")
                                        const document = user.document.replace(/\D/g, "")
                                        const phone = user.phone.replace(/\D/g, "")

                                        payload = {
                                            creditCard: {
                                                holderName: cardDataForUpdate.name,
                                                number: cardNumber,
                                                expiryMonth: expMonth,
                                                expiryYear: `20${expYear}`,
                                                ccv: cardDataForUpdate.cvv
                                            }
                                        }
                                    }

                                    await updateCreditCard(payload)
                                    Toast.success("Cartão de crédito atualizado com sucesso")
                                    setUpdateCardDialog(false)
                                    setSelectedCardIdForUpdate(null)
                                    setShowNewCardFormForUpdate(false)
                                    setCardDataForUpdate({ number: "", name: "", expiry: "", cvv: "" })
                                    await refetchSubscriptionInfo()
                                } catch (error: any) {
                                    console.error("Erro ao atualizar cartão:", error)
                                    const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar cartão de crédito"
                                    Toast.error(errorMessage)
                                }
                            }}
                            disabled={isUpdatingCreditCard || (!selectedCardIdForUpdate && (!cardDataForUpdate.number || !cardDataForUpdate.name || !cardDataForUpdate.expiry || !cardDataForUpdate.cvv))}
                        >
                            {isUpdatingCreditCard ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Atualizando...
                                </>
                            ) : (
                                "Atualizar Cartão"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogPasswordConfirmation
                open={passwordConfirmationDialog}
                onOpenChange={setPasswordConfirmationDialog}
                onConfirm={async () => {
                    try {
                        await cancelSubscription()
                        Toast.success("Assinatura cancelada com sucesso")
                        setPasswordConfirmationDialog(false)
                        await refetchSubscriptionInfo()
                        if (user) {
                            const updatedUser = { ...user }
                            if (updatedUser.Organizer) {
                                setUser(updatedUser)
                            }
                        }
                    } catch (error: any) {
                        console.error("Erro ao cancelar assinatura:", error)
                        const errorMessage = error?.response?.data?.message || error?.message || "Erro ao cancelar assinatura"
                        Toast.error(errorMessage)
                    }
                }}
                title="Confirmar Cancelamento"
                description="Por motivos de segurança, digite sua senha para confirmar o cancelamento da assinatura do CRM Pro."
            />

            <Dialog open={viewTagClientsDialog.open} onOpenChange={(open) => {
                setViewTagClientsDialog({ open })
                if (!open) {
                    setSelectedTagIdForClients(undefined)
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Clientes com a Tag "{viewTagClientsDialog.tagName}"</DialogTitle>
                        <DialogDescription>
                            Lista de todos os clientes que possuem esta tag
                        </DialogDescription>
                    </DialogHeader>
                    {tagClientsLoading ? (
                        <div className="space-y-4 py-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {tagClients.length === 0 ? (
                                <p className="text-sm text-psi-dark/60 text-center py-8">
                                    Nenhum cliente encontrado com esta tag
                                </p>
                            ) : (
                                tagClients.map(client => (
                                    <div key={client.id} className="p-3 border border-psi-dark/10 rounded-lg hover:bg-psi-primary/5 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-psi-dark">{client.firstName} {client.lastName}</p>
                                                <p className="text-sm text-psi-dark/60">{client.email}</p>
                                                {client.phone && (
                                                    <p className="text-xs text-psi-dark/50 mt-1">{client.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setViewTagClientsDialog({ open: false })
                                setSelectedTagIdForClients(undefined)
                            }}
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
