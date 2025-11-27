"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useEffect, useState } from "react"
import { 
    Building2, 
    CreditCard, 
    Wallet, 
    FileText, 
    Camera, 
    Instagram, 
    Facebook, 
    Mail, 
    Phone,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    ImageIcon,
    FileEdit,
    User,
    Globe,
    MapPin,
    Hash,
    ChevronDown,
    ChevronUp
} from "lucide-react"
import { OrganizerUpdateValidator, type TOrganizerUpdate } from "@/validators/Organizer/OrganizerValidator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { FieldError } from "@/components/FieldError/FieldError"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { ImageUpload } from "@/components/ImageUpload/ImageUpload"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { useOrganizerUpdate } from "@/hooks/Organizer/useOrganizerUpdate"
import { useBankFind } from "@/hooks/Organizer/useBankFind"
import { Toast } from "@/components/Toast/Toast"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import type { TOrganizer } from "@/types/Organizer/TOrganizer"
import type { TUser } from "@/types/User/TUser"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { getStates, getCitiesByState } from "@/utils/Helpers/IBGECitiesAndStates/IBGECitiesAndStates"
import { getCountries, getCountriesSync } from "@/utils/Helpers/Countries/Countries"

const genres = [
    { value: "MALE", label: "Masculino" },
    { value: "FEMALE", label: "Feminino" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefiro não informar" },
]

const MeuPerfilOrganizer = () => {
    const { user, setUser } = useAuthStore()
    const { data: banksData, isLoading: isLoadingBanks } = useBankFind()
    const { mutateAsync: updateOrganizer, isPending: isUpdating } = useOrganizerUpdate()
    const [countries, setCountries] = useState(getCountriesSync())
    const states = useMemo(() => getStates(), [])
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        personalData: true,
        companyInfo: false,
        logoDescription: false,
        bankAccount: false,
        pix: false,
        documents: false,
        socialMedia: false,
        support: false,
    })

    const organizer = useMemo(() => {
        return user?.Organizer || null
    }, [user])

    const formatBirthForForm = (birth: string | null | undefined): string => {
        if (!birth) return ""
        if (birth.includes("/")) {
            return birth
        }
        const [year, month, day] = birth.split("-")
        if (year && month && day) {
            return `${day}/${month}/${year}`
        }
        return birth
    }

    const banks = useMemo(() => {
        if (banksData?.data && Array.isArray(banksData.data)) {
            return banksData.data
        }
        return []
    }, [banksData])

    const getDocumentType = (document: string | null | undefined): "CPF" | "CNPJ" | null => {
        if (!document) return null
        const digitsOnly = document.replace(/\D/g, "")
        return digitsOnly.length === 11 ? "CPF" : digitsOnly.length === 14 ? "CNPJ" : null
    }

    const form = useForm<TOrganizerUpdate>({
        resolver: zodResolver(OrganizerUpdateValidator),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            birth: user?.birth || "",
            document: user?.document || "",
            nationality: user?.nationality || null,
            gender: user?.gender || null,
            address: user?.Address ? {
                street: user.Address.street || null,
                number: user.Address.number || null,
                complement: user.Address.complement || null,
                neighborhood: user.Address.neighborhood || null,
                city: user.Address.city || null,
                state: user.Address.state || null,
                country: user.Address.country || null,
                zipCode: user.Address.zipCode || null,
            } : undefined,
            companyName: user?.Organizer?.companyName || "",
            companyDocument: user?.Organizer?.companyDocument || "",
            companyAddress: user?.Organizer?.companyAddress || "",
            description: user?.Organizer?.description || "",
            logo: user?.Organizer?.logo || null,
            bankId: user?.Organizer?.bankId || "",
            bankAccountName: user?.Organizer?.bankAccountName || "",
            bankAccountOwnerName: user?.Organizer?.bankAccountOwnerName || "",
            bankAccountOwnerBirth: user?.Organizer?.bankAccountOwnerBirth || "",
            bankAccountOwnerDocumentType: getDocumentType(user?.Organizer?.bankAccountOwnerDocument) || null,
            bankAccountOwnerDocument: user?.Organizer?.bankAccountOwnerDocument || "",
            bankAccountAgency: user?.Organizer?.bankAccountAgency || "",
            bankAccountNumber: user?.Organizer?.bankAccountNumber || "",
            bankAccountDigit: user?.Organizer?.bankAccountDigit || "",
            bankAccountType: user?.Organizer?.bankAccountType || null,
            pixAddressKey: user?.Organizer?.pixAddressKey || "",
            pixAddressType: user?.Organizer?.pixAddressType || null,
            payoutMethod: user?.Organizer?.payoutMethod || null,
            identityDocumentFronUrl: user?.Organizer?.identityDocumentFront || null,
            identityDocumentBackUrl: user?.Organizer?.identityDocumentBack || null,
            identityDocumentSelfieUrl: user?.Organizer?.identityDocumentSelfie || null,
            instagramUrl: user?.Organizer?.instagramUrl || "",
            facebookUrl: user?.Organizer?.facebookUrl || "",
            supportEmail: user?.Organizer?.supportEmail || "",
            supportPhone: user?.Organizer?.supportPhone || "",
        }
    })

    const selectedState = form.watch("address.state")
    const cities = useMemo(() => {
        const state = selectedState || ""
        return getCitiesByState(state)
    }, [selectedState])

    useEffect(() => {
        const loadCountries = async () => {
            const countriesList = await getCountries()
            setCountries(countriesList)
        }
        loadCountries()
    }, [])

    useEffect(() => {
        if (selectedState) {
            const currentCity = form.getValues("address.city")
            const availableCities = getCitiesByState(selectedState)
            const cityExists = availableCities.some(city => city.value === currentCity)
            if (!cityExists && currentCity) {
                form.setValue("address.city", null)
            }
        }
    }, [selectedState, form])

    useEffect(() => {
        if (organizer && user) {
            const getDocumentType = (document: string | null | undefined): "CPF" | "CNPJ" | null => {
                if (!document) return null
                const digitsOnly = document.replace(/\D/g, "")
                return digitsOnly.length === 11 ? "CPF" : digitsOnly.length === 14 ? "CNPJ" : null
            }

            const resetData = {
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                birth: formatBirthForForm(user.birth),
                document: user.document || "",
                nationality: user.nationality || null,
                gender: user.gender || null,
                address: user.Address ? {
                    street: user.Address.street || null,
                    number: user.Address.number || null,
                    complement: user.Address.complement || null,
                    neighborhood: user.Address.neighborhood || null,
                    city: user.Address.city || null,
                    state: user.Address.state || null,
                    country: user.Address.country || null,
                    zipCode: user.Address.zipCode || null,
                } : undefined,
                companyName: organizer.companyName || "",
                companyDocument: organizer.companyDocument || "",
                companyAddress: organizer.companyAddress || "",
                description: organizer.description || "",
                logo: organizer.logo || null,
                bankId: organizer.bankId || "",
                bankAccountName: organizer.bankAccountName || "",
                bankAccountOwnerName: organizer.bankAccountOwnerName || "",
                bankAccountOwnerBirth: formatBirthForForm(organizer.bankAccountOwnerBirth),
                bankAccountOwnerDocumentType: getDocumentType(organizer.bankAccountOwnerDocument),
                bankAccountOwnerDocument: organizer.bankAccountOwnerDocument || "",
                bankAccountAgency: organizer.bankAccountAgency || "",
                bankAccountNumber: organizer.bankAccountNumber || "",
                bankAccountDigit: organizer.bankAccountDigit || "",
                bankAccountType: organizer.bankAccountType ?? null,
                pixAddressKey: organizer.pixAddressKey || "",
                pixAddressType: organizer.pixAddressType ?? null,
                payoutMethod: organizer.payoutMethod ?? null,
                identityDocumentFronUrl: organizer.identityDocumentFront || null,
                identityDocumentBackUrl: organizer.identityDocumentBack || null,
                identityDocumentSelfieUrl: organizer.identityDocumentSelfie || null,
                instagramUrl: organizer.instagramUrl || "",
                facebookUrl: organizer.facebookUrl || "",
                supportEmail: organizer.supportEmail || "",
                supportPhone: organizer.supportPhone || "",
            }
            form.reset(resetData)
        }
    }, [organizer, user])

    const hasBankAccount = useMemo(() => {
        const values = form.watch()
        return !!(
            values.bankId &&
            values.bankAccountName &&
            values.bankAccountOwnerName &&
            values.bankAccountOwnerDocument &&
            values.bankAccountAgency &&
            values.bankAccountNumber &&
            values.bankAccountDigit &&
            values.bankAccountType
        )
    }, [form.watch(["bankId", "bankAccountName", "bankAccountOwnerName", "bankAccountOwnerDocument", "bankAccountAgency", "bankAccountNumber", "bankAccountDigit", "bankAccountType"])])

    const hasPix = useMemo(() => {
        const values = form.watch()
        return !!(values.pixAddressKey && values.pixAddressType)
    }, [form.watch(["pixAddressKey", "pixAddressType"])])

    const hasAllDocuments = useMemo(() => {
        if (!organizer) return false
        return !!(
            organizer.identityDocumentFront &&
            organizer.identityDocumentBack &&
            organizer.identityDocumentSelfie
        )
    }, [organizer])

    const handleSubmit = async (data: TOrganizerUpdate) => {
        try {
            const updateData: TOrganizerUpdate = { ...data }

            const response = await updateOrganizer(updateData)
            if (response.success) {
                Toast.success("Dados atualizados com sucesso")
                
                if (user && response.data) {
                    const updatedUser = response.data as TUser
                    setUser(updatedUser)
                }
            } else {
            }
        } catch (error) {
        }
    }

    const getVerificationStatusMessage = () => {
        if (!organizer?.verificationStatus) {
            return {
                message: "Complete seu cadastro para iniciar a verificação",
                icon: AlertCircle,
                variant: "default" as const
            }
        }

        switch (organizer.verificationStatus) {
            case "PENDING":
                return {
                    message: "Sua conta está em processo de aprovação, aguarde.",
                    icon: Clock,
                    variant: "secondary" as const
                }
            case "APPROVED":
                return {
                    message: "Sua conta está ativa!",
                    icon: CheckCircle2,
                    variant: "default" as const
                }
            case "REJECTED":
                return {
                    message: "Seus dados foram rejeitados. Entre em contato com a organização da plataforma para mais informações.",
                    icon: XCircle,
                    variant: "destructive" as const
                }
            default:
                return {
                    message: "Status desconhecido",
                    icon: AlertCircle,
                    variant: "default" as const
                }
        }
    }

    const statusInfo = getVerificationStatusMessage()
    const StatusIcon = statusInfo.icon

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[100px]
            sm:py-12">
                <div className="max-w-4xl mx-auto px-4
                sm:px-6
                lg:px-8">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-psi-primary mb-2
                            sm:text-4xl">
                                { organizer?.verificationStatus === "APPROVED" ? "Meu Perfil" : "Verificação de Organizador" }
                            </h1>
                            {organizer?.verificationStatus === "APPROVED" ? (
                                <p className="text-psi-dark/60">
                                    Mantenha seus dados atualizados para garantir uma melhor experiência para seus clientes!
                                </p>
                            ) : (
                                <p className="text-psi-dark/60">
                                    Preencha os dados necessários para verificar sua conta e começar a anunciar eventos
                                </p>
                            )}
                        </div>

                        {organizer?.verificationStatus && (
                            <div className={`rounded-2xl border p-6 flex items-start gap-4 ${
                                organizer.verificationStatus === "APPROVED" 
                                    ? "border-green-200 bg-green-50" 
                                    : organizer.verificationStatus === "REJECTED"
                                    ? "border-red-200 bg-red-50"
                                    : "border-amber-200 bg-amber-50"
                            }`}>
                                <StatusIcon className={`h-6 w-6 shrink-0 ${
                                    organizer.verificationStatus === "APPROVED"
                                        ? "text-green-600"
                                        : organizer.verificationStatus === "REJECTED"
                                        ? "text-red-600"
                                        : "text-amber-600"
                                }`} />
                                <div>
                                    <p className={`font-semibold ${
                                        organizer.verificationStatus === "APPROVED"
                                            ? "text-green-900"
                                            : organizer.verificationStatus === "REJECTED"
                                            ? "text-red-900"
                                            : "text-amber-900"
                                    }`}>
                                        {statusInfo.message}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                            <Collapsible
                                open={openSections.personalData}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, personalData: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Dados Pessoais</h2>
                                                    <p className="text-sm text-psi-dark/60">Informações básicas do organizador</p>
                                                </div>
                                            </div>
                                            {openSections.personalData ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">

                                <div className="grid gap-4
                                sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Nome
                                        </label>
                                        <Controller
                                            name="firstName"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Nome"
                                                    icon={User}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.firstName?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Sobrenome
                                        </label>
                                        <Controller
                                            name="lastName"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Sobrenome"
                                                    icon={User}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.lastName?.message || ""} />
                                    </div>
                                </div>

                                <div className="grid gap-4
                                sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Data de Nascimento
                                        </label>
                                        <Controller
                                            name="birth"
                                            control={form.control}
                                            render={({ field }) => (
                                                <InputMask
                                                    {...field}
                                                    value={field.value || ""}
                                                    mask="00/00/0000"
                                                    placeholder="DD/MM/AAAA"
                                                    icon={FileText}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.birth?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            CPF
                                        </label>
                                        <Controller
                                            name="document"
                                            control={form.control}
                                            render={({ field }) => (
                                                <InputMask
                                                    {...field}
                                                    value={field.value || ""}
                                                    mask="000.000.000-00"
                                                    placeholder="000.000.000-00"
                                                    icon={FileText}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.document?.message || ""} />
                                    </div>
                                </div>

                                <div className="grid gap-4
                                sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Nacionalidade
                                        </label>
                                        <Controller
                                            name="nationality"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value || undefined}
                                                    onValueChange={(value) => field.onChange(value || null)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="size-4 text-muted-foreground" />
                                                            <SelectValue placeholder="Selecione..." />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map((country) => (
                                                            <SelectItem key={country.value} value={country.value}>
                                                                {country.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.nationality?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Gênero
                                        </label>
                                        <Controller
                                            name="gender"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value || undefined}
                                                    onValueChange={(value) => field.onChange(value || null)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {genres.map((genre) => (
                                                            <SelectItem key={genre.value} value={genre.value}>
                                                                {genre.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.gender?.message || ""} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-psi-dark/10">
                                    <h3 className="text-lg font-semibold text-psi-dark mb-4">Endereço</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            CEP
                                        </label>
                                        <Controller
                                            name="address.zipCode"
                                            control={form.control}
                                            render={({ field }) => (
                                                <InputMask
                                                    mask="00000-000"
                                                    value={field.value || ""}
                                                    onAccept={(value) => {
                                                        const currentAddress = form.getValues("address") || {}
                                                        form.setValue("address", {
                                                            ...currentAddress,
                                                            zipCode: value as string || null
                                                        })
                                                    }}
                                                    placeholder="00000-000"
                                                    icon={Hash}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.address?.zipCode?.message || ""} />
                                    </div>
                                    
                                    <div className="grid gap-4
                                    sm:grid-cols-2 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Rua
                                            </label>
                                            <Controller
                                                name="address.street"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        value={field.value || ""}
                                                        onChange={(e) => {
                                                            const currentAddress = form.getValues("address") || {}
                                                            form.setValue("address", {
                                                                ...currentAddress,
                                                                street: e.target.value || null
                                                            })
                                                        }}
                                                        placeholder="Nome da rua"
                                                        icon={MapPin}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.street?.message || ""} />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Número (opcional)
                                            </label>
                                            <Controller
                                                name="address.number"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        value={field.value || ""}
                                                        onChange={(e) => {
                                                            const currentAddress = form.getValues("address") || {}
                                                            form.setValue("address", {
                                                                ...currentAddress,
                                                                number: e.target.value || null
                                                            })
                                                        }}
                                                        placeholder="123"
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.number?.message || ""} />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Complemento (opcional)
                                        </label>
                                        <Controller
                                            name="address.complement"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const currentAddress = form.getValues("address") || {}
                                                        form.setValue("address", {
                                                            ...currentAddress,
                                                            complement: e.target.value || null
                                                        })
                                                    }}
                                                    placeholder="Apartamento, bloco, etc."
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.address?.complement?.message || ""} />
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Bairro
                                        </label>
                                        <Controller
                                            name="address.neighborhood"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const currentAddress = form.getValues("address") || {}
                                                        form.setValue("address", {
                                                            ...currentAddress,
                                                            neighborhood: e.target.value || null
                                                        })
                                                    }}
                                                    placeholder="Nome do bairro"
                                                    icon={Building2}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.address?.neighborhood?.message || ""} />
                                    </div>
                                    
                                    <div className="grid gap-4
                                    sm:grid-cols-3 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Estado
                                            </label>
                                            <Controller
                                                name="address.state"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => {
                                                            const currentAddress = form.getValues("address") || {}
                                                            form.setValue("address", {
                                                                ...currentAddress,
                                                                state: value || null,
                                                                city: null
                                                            })
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {states.map((state) => (
                                                                <SelectItem key={state.value} value={state.value}>
                                                                    {state.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.state?.message || ""} />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Cidade
                                            </label>
                                            <Controller
                                                name="address.city"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => {
                                                            const currentAddress = form.getValues("address") || {}
                                                            form.setValue("address", {
                                                                ...currentAddress,
                                                                city: value || null
                                                            })
                                                        }}
                                                        disabled={!selectedState}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={selectedState ? "Selecione..." : "Selecione um estado primeiro"} />
                                                        </SelectTrigger>
                                                        <SelectContent key={selectedState || "no-state"}>
                                                            {cities.length > 0 ? (
                                                                cities.map((city) => {
                                                                    const cityValue = city.value || ""
                                                                    if (!cityValue) return null
                                                                    return (
                                                                        <SelectItem key={cityValue} value={cityValue}>
                                                                            {city.label || ""}
                                                                        </SelectItem>
                                                                    )
                                                                })
                                                            ) : (
                                                                <div className="px-2 py-1.5 text-sm text-psi-dark/60">
                                                                    Nenhuma cidade encontrada
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.city?.message || ""} />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                País
                                            </label>
                                            <Controller
                                                name="address.country"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => {
                                                            const currentAddress = form.getValues("address") || {}
                                                            form.setValue("address", {
                                                                ...currentAddress,
                                                                country: value || null
                                                            })
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countries.map((country) => (
                                                                <SelectItem key={country.value} value={country.value}>
                                                                    {country.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.country?.message || ""} />
                                        </div>
                                    </div>
                                </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible
                                open={openSections.companyInfo}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, companyInfo: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <Building2 className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Informações da Empresa</h2>
                                                    <p className="text-sm text-psi-dark/60">Opcional - Preencha se for pessoa jurídica</p>
                                                </div>
                                            </div>
                                            {openSections.companyInfo ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">

                                <div className="grid gap-4
                                sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Nome da empresa
                                        </label>
                                        <Controller
                                            name="companyName"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Nome da empresa"
                                                    icon={Building2}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.companyName?.message || ""} />
                                        <p className="text-xs text-psi-dark/50 mt-1">
                                            Preencha se você for uma pessoa jurídica para aumentar as chances de aprovação
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            CNPJ
                                        </label>
                                        <Controller
                                            name="companyDocument"
                                            control={form.control}
                                            render={({ field }) => (
                                                <InputMask
                                                    {...field}
                                                    value={field.value || ""}
                                                    mask="00.000.000/0000-00"
                                                    placeholder="00.000.000/0000-00"
                                                    icon={FileText}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.companyDocument?.message || ""} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                        Endereço da empresa
                                    </label>
                                    <Controller
                                        name="companyAddress"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Endereço completo"
                                                icon={Building2}
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.companyAddress?.message || ""} />
                                </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible
                                open={openSections.logoDescription}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, logoDescription: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <ImageIcon className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Logo e Descrição</h2>
                                                    <p className="text-sm text-amber-700 font-medium">Altamente recomendado</p>
                                                </div>
                                            </div>
                                            {openSections.logoDescription ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">

                                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                                            <p className="text-sm text-amber-900">
                                                <strong>Importante:</strong> Adicionar uma logo e descrição ajuda a criar conexão com o público e aumenta a confiança nos seus eventos.
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Logo do organizador
                                        </label>
                                        <Controller
                                            name="logo"
                                            control={form.control}
                                            render={({ field }) => (
                                                <ImageUpload
                                                    value={ImageUtils.getOrganizerLogoUrl(field.value as string || "")}
                                                    onChange={(file) => field.onChange(file)}
                                                    error={form.formState.errors.logo?.message}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.logo?.message || ""} />
                                        <p className="text-xs text-psi-dark/50 mt-1">
                                            Recomendado: imagem quadrada (1:1) ou retangular, até 10MB
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Descrição do organizador
                                        </label>
                                        <Controller
                                            name="description"
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        {...field}
                                                        value={field.value || ""}
                                                        placeholder="Conte um pouco sobre você ou sua organização. Isso ajuda a criar conexão com o público..."
                                                        className="min-h-[200px] resize-none"
                                                        maxLength={600}
                                                    />
                                                    <div className="flex items-center justify-between text-xs text-psi-dark/50">
                                                        <span>Máximo de 600 caracteres</span>
                                                        <span className={field.value && field.value.length > 550 ? "text-amber-600 font-medium" : ""}>
                                                            {field.value?.length || 0}/600
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.description?.message || ""} />
                                        <p className="text-xs text-psi-dark/50 mt-1">
                                            Uma boa descrição gera conexão com o público e aumenta a confiança
                                        </p>
                                    </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible
                                open={openSections.bankAccount}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, bankAccount: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <CreditCard className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Conta Bancária</h2>
                                                    <p className="text-sm text-psi-dark/60">Opcional - Se preencher, todos os campos marcados com * são obrigatórios</p>
                                                </div>
                                            </div>
                                            {openSections.bankAccount ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">
                                        <div className="grid gap-4
                                        sm:grid-cols-2
                                        lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Banco *
                                                </label>
                                                <Controller
                                                    name="bankId"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? String(field.value) : undefined}
                                                            onValueChange={(value) => field.onChange(value || "")}
                                                            disabled={isLoadingBanks}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione o banco" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {banks.map((bank) => (
                                                                    <SelectItem key={bank.id} value={bank.id}>
                                                                        {bank.name} ({bank.code})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankId?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Tipo de conta *
                                                </label>
                                                <Controller
                                                    name="bankAccountType"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value ? String(field.value) : undefined}
                                                            onValueChange={(value) => field.onChange(value || null)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione o tipo" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="CONTA_CORRENTE">Conta Corrente</SelectItem>
                                                                <SelectItem value="CONTA_POUPANCA">Conta Poupança</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountType?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Agência *
                                                </label>
                                                <Controller
                                                    name="bankAccountAgency"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Número da agência"
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountAgency?.message || ""} />
                                            </div>
                                        </div>

                                        <div className="grid gap-4
                                        sm:grid-cols-2
                                        lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Número da conta *
                                                </label>
                                                <Controller
                                                    name="bankAccountNumber"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Número da conta"
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountNumber?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Dígito verificador *
                                                </label>
                                                <Controller
                                                    name="bankAccountDigit"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Dígito"
                                                            maxLength={2}
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountDigit?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Nome da conta *
                                                </label>
                                                <Controller
                                                    name="bankAccountName"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Nome da conta"
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountName?.message || ""} />
                                            </div>
                                        </div>

                                        <div className="grid gap-4
                                        sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Nome do titular *
                                                </label>
                                                <Controller
                                                    name="bankAccountOwnerName"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Nome completo do titular"
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountOwnerName?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Data de nascimento do titular *
                                                </label>
                                                <Controller
                                                    name="bankAccountOwnerBirth"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <InputMask
                                                            {...field}
                                                            value={field.value || ""}
                                                            mask="00/00/0000"
                                                            placeholder="DD/MM/AAAA"
                                                            icon={FileText}
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountOwnerBirth?.message || ""} />
                                            </div>
                                        </div>

                                        <div className="grid gap-4
                                        sm:grid-cols-2
                                        lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Tipo de documento *
                                                </label>
                                                <Controller
                                                    name="bankAccountOwnerDocumentType"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value || undefined}
                                                            onValueChange={(value) => {
                                                                field.onChange(value || null)
                                                                if (!value) {
                                                                    form.setValue("bankAccountOwnerDocument", "")
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Tipo" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="CPF">CPF</SelectItem>
                                                                <SelectItem value="CNPJ">CNPJ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountOwnerDocumentType?.message || ""} />
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    CPF/CNPJ do titular *
                                                </label>
                                                <Controller
                                                    name="bankAccountOwnerDocument"
                                                    control={form.control}
                                                    render={({ field }) => {
                                                        const documentType = form.watch("bankAccountOwnerDocumentType")
                                                        const mask = documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"
                                                        const placeholder = documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"
                                                        
                                                        return (
                                                            <InputMask
                                                                {...field}
                                                                value={field.value || ""}
                                                                mask={mask}
                                                                placeholder={placeholder}
                                                                icon={FileText}
                                                                disabled={!documentType}
                                                            />
                                                        )
                                                    }}
                                                />
                                                <FieldError message={form.formState.errors.bankAccountOwnerDocument?.message || ""} />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible
                                open={openSections.pix}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, pix: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <Wallet className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Chave PIX</h2>
                                                    <p className="text-sm text-psi-dark/60">Opcional - Se preencher, todos os campos marcados com * são obrigatórios</p>
                                                </div>
                                            </div>
                                            {openSections.pix ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">
                                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                                            <p className="text-sm text-amber-900">
                                                <strong>Importante:</strong> É necessário preencher pelo menos uma conta bancária ou chave PIX para receber os pagamentos.
                                            </p>
                                        </div>

                                        <div className="grid gap-4
                                        sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Tipo de chave PIX *
                                        </label>
                                        <Controller
                                            name="pixAddressType"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value ? String(field.value) : undefined}
                                                    onValueChange={(value) => field.onChange(value || null)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CPF">CPF</SelectItem>
                                                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                                                        <SelectItem value="EMAIL">E-mail</SelectItem>
                                                        <SelectItem value="PHONE">Telefone</SelectItem>
                                                        <SelectItem value="EVP">Chave aleatória</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.pixAddressType?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Chave PIX *
                                        </label>
                                        <Controller
                                            name="pixAddressKey"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    placeholder="Digite a chave PIX"
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.pixAddressKey?.message || ""} />
                                    </div>
                                </div>

                                {hasBankAccount && hasPix && (
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                            Método de pagamento preferido *
                                        </label>
                                        <Controller
                                            name="payoutMethod"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value ? String(field.value) : undefined}
                                                    onValueChange={(value) => field.onChange(value || null)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o método preferido" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PIX">PIX</SelectItem>
                                                        <SelectItem value="BANK_ACCOUNT">Conta Bancária</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.payoutMethod?.message || ""} />
                                        <p className="text-xs text-psi-dark/50 mt-1">
                                            Selecione como você prefere receber os pagamentos quando ambos os métodos estiverem configurados
                                        </p>
                                    </div>
                                )}
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            {!hasAllDocuments && (
                                <Collapsible
                                    open={openSections.documents}
                                    onOpenChange={(open) => setOpenSections(prev => ({ ...prev, documents: open }))}
                                >
                                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                    sm:p-8 shadow-sm">
                                        <CollapsibleTrigger className="w-full">
                                            <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-psi-dark">Documentos de Identidade</h2>
                                                        <p className="text-sm text-red-600 font-medium">Obrigatório</p>
                                                    </div>
                                                </div>
                                                {openSections.documents ? (
                                                    <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                                )}
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="space-y-6 pt-6">

                                            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
                                                <p className="text-sm text-red-900">
                                                    <strong>Atenção:</strong> É obrigatório enviar a foto da frente e verso do RG, além de uma selfie segurando o RG. Sem essas imagens, sua conta não será verificada.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Foto da frente do RG *
                                            </label>
                                            <Controller
                                                name="identityDocumentFronUrl"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={(file) => field.onChange(file)}
                                                        error={form.formState.errors.identityDocumentFronUrl?.message}
                                                        variant="document"
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.identityDocumentFronUrl?.message || ""} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Foto do verso do RG *
                                            </label>
                                            <Controller
                                                name="identityDocumentBackUrl"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={(file) => field.onChange(file)}
                                                        error={form.formState.errors.identityDocumentBackUrl?.message}
                                                        variant="document"
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.identityDocumentBackUrl?.message || ""} />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Selfie segurando o RG *
                                            </label>
                                            <Controller
                                                name="identityDocumentSelfieUrl"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={(file) => field.onChange(file)}
                                                        error={form.formState.errors.identityDocumentSelfieUrl?.message}
                                                        variant="document"
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.identityDocumentSelfieUrl?.message || ""} />
                                        </div>
                                            </div>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            )}

                            <Collapsible
                                open={openSections.socialMedia}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, socialMedia: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <Instagram className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Redes Sociais</h2>
                                                    <p className="text-sm text-psi-dark/60">Opcional - Links para suas redes sociais</p>
                                                </div>
                                            </div>
                                            {openSections.socialMedia ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">
                                        <div className="grid gap-4
                                        sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Link do Instagram
                                                </label>
                                                <Controller
                                                    name="instagramUrl"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="https://instagram.com/seu-perfil"
                                                            icon={Instagram}
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.instagramUrl?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Link do Facebook
                                                </label>
                                                <Controller
                                                    name="facebookUrl"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="https://facebook.com/seu-perfil"
                                                            icon={Facebook}
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.facebookUrl?.message || ""} />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible
                                open={openSections.support}
                                onOpenChange={(open) => setOpenSections(prev => ({ ...prev, support: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                                    <Mail className="h-5 w-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-semibold text-psi-dark">Contato de Suporte</h2>
                                                    <p className="text-sm text-amber-700 font-medium">Obrigatório - Preencha pelo menos um dos campos marcados com *</p>
                                                </div>
                                            </div>
                                            {openSections.support ? (
                                                <ChevronUp className="h-5 w-5 text-psi-dark/60" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-psi-dark/60" />
                                            )}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">
                                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                                            <p className="text-sm text-amber-900">
                                                <strong>Importante:</strong> É necessário informar pelo menos um email ou telefone de suporte para que os clientes possam entrar em contato caso necessário.
                                            </p>
                                        </div>

                                        <div className="grid gap-4
                                        sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Email de suporte *
                                                </label>
                                                <Controller
                                                    name="supportEmail"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            type="email"
                                                            placeholder="suporte@exemplo.com"
                                                            icon={Mail}
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.supportEmail?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Telefone de suporte *
                                                </label>
                                                <Controller
                                                    name="supportPhone"
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <InputMask
                                                            {...field}
                                                            value={field.value || ""}
                                                            mask="(00) 00000-0000"
                                                            placeholder="(00) 00000-0000"
                                                            icon={Phone}
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.supportPhone?.message || ""} />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isUpdating}
                                >
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar alterações
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    MeuPerfilOrganizer
}
