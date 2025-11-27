"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Phone, FileText, Globe, MapPin, Building2, Hash, User, Mail } from "lucide-react"
import { UserProfileUpdateValidator, type TUserProfileUpdate } from "@/validators/User/UserProfileUpdateValidator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { FieldError } from "@/components/FieldError/FieldError"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Background } from "@/components/Background/Background"
import { Avatar } from "@/components/Avatar/Avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { TUser } from "@/types/User/TUser"
import { getStates, getCitiesByState } from "@/utils/Helpers/IBGECitiesAndStates/IBGECitiesAndStates"
import { getCountries, getCountriesSync } from "@/utils/Helpers/Countries/Countries"
import { useMemo, useEffect, useRef, useState } from "react"
import { useUserUpdate } from "@/hooks/User/useUserUpdate"
import { useUserUploadProfilePicture } from "@/hooks/User/useUserUploadProfilePicture"
import { Toast } from "@/components/Toast/Toast"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"

const genres = [
    { value: "MALE", label: "Masculino" },
    { value: "FEMALE", label: "Feminino" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefiro não informar" },
]

const MeuPerfilCustomer = () => {
    const { user, setUser } = useAuthStore()
    const states = getStates()
    const { mutateAsync: updateUser, isPending: isUpdating } = useUserUpdate()
    const { mutateAsync: uploadProfilePicture, isPending: isUploading } = useUserUploadProfilePicture()
    const [countries, setCountries] = useState(getCountriesSync())

    const formatBirthForForm = (birth: string | null | undefined): string => {
        if (!birth) return ""
        const [year, month, day] = birth.split("-")
        if (year && month && day) {
            return `${day}/${month}/${year}`
        }
        return birth
    }

    const form = useForm<TUserProfileUpdate>({
        resolver: zodResolver(UserProfileUpdateValidator),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            image: null,
            phone: user?.phone || "",
            document: user?.document || "",
            nationality: user?.nationality || "",
            gender: user?.gender || null,
            birth: formatBirthForForm(user?.birth),
            address: user?.Address ? {
                street: user.Address.street,
                number: user.Address.number || "",
                complement: user.Address.complement || "",
                neighborhood: user.Address.neighborhood,
                zipCode: user.Address?.zipCode,
                city: user.Address.city,
                state: user.Address.state,
                country: user.Address.country,
            } : null
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
                form.setValue("address.city", "")
            }
        }
    }, [selectedState, form])

    const imageValue = form.watch("image")
    const uploadedFileRef = useRef<File | null>(null)
    
    useEffect(() => {
        const uploadImage = async () => {
            if (imageValue instanceof File && imageValue !== uploadedFileRef.current) {
                uploadedFileRef.current = imageValue
                try {
                    const response = await uploadProfilePicture(imageValue)
                    if (response && response.success && response.data?.user) {
                        setUser(response.data.user)
                        form.setValue("image", null)
                        uploadedFileRef.current = null
                        Toast.success("Foto de perfil atualizada com sucesso!")
                    }
                } catch (error: any) {
                    Toast.error(error?.response?.data?.message || "Erro ao fazer upload da foto. Tente novamente.")
                    form.setValue("image", null)
                    uploadedFileRef.current = null
                }
            }
        }

        uploadImage()
    }, [imageValue, uploadProfilePicture, setUser, form])

    const updateAddressField = (field: string, value: string) => {
        const currentAddress = form.getValues("address") || {}
        const updatedAddress = {
            ...currentAddress,
            [field]: value || ""
        } as any
        
        if (field === "state") {
            updatedAddress.city = ""
        }
        
        form.setValue("address", updatedAddress)
    }

    const handleSubmit = async (data: TUserProfileUpdate) => {
        try {
            const updateData: any = {}

            if (data.firstName) updateData.firstName = data.firstName
            if (data.lastName) updateData.lastName = data.lastName
            if (data.phone) updateData.phone = data.phone
            if (data.document) updateData.document = data.document
            
            if (data.nationality !== undefined) {
                updateData.nationality = data.nationality || null
            }
            
            if (data.gender !== undefined) {
                updateData.gender = data.gender || null
            }

            if (data.birth) {
                updateData.birth = data.birth
            }

            if (data.address) {
                updateData.address = {}
                
                if (data.address.street !== undefined) updateData.address.street = data.address.street || null
                if (data.address.number !== undefined) updateData.address.number = data.address.number || null
                if (data.address.complement !== undefined) updateData.address.complement = data.address.complement || null
                if (data.address.neighborhood !== undefined) updateData.address.neighborhood = data.address.neighborhood || null
                if (data.address.city !== undefined) updateData.address.city = data.address.city || null
                if (data.address.state !== undefined) updateData.address.state = data.address.state || null
                if (data.address.country !== undefined) updateData.address.country = data.address.country || null
                if (data.address.zipCode !== undefined) updateData.address.zipCode = data.address.zipCode || null
            }

            const response = await updateUser(updateData)

            if (response && response.success && response.data) {
                setUser(response.data)
                Toast.success("Perfil atualizado com sucesso!")
            } else {
                Toast.error("Erro ao atualizar perfil. Tente novamente.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Erro ao atualizar perfil. Tente novamente.")
        }
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[100px]
            sm:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-psi-primary mb-2
                            sm:text-4xl">
                                Meu Perfil
                            </h1>
                            <p className="text-psi-dark/60">
                                Complete seu cadastro para agilizar suas compras
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                        sm:p-8 shadow-sm">
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-psi-dark">Foto de Perfil</h2>
                                    
                                    <div className="flex items-center gap-6">
                                        <Controller
                                            name="image"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Avatar
                                                    src={
                                                        field.value instanceof File
                                                            ? URL.createObjectURL(field.value)
                                                            : user?.image ? ImageUtils.getUserImageUrl(user.image) : null
                                                    }
                                                    name={`${form.watch("firstName") || user?.firstName || ""} ${form.watch("lastName") || user?.lastName || ""}`}
                                                    size="lg"
                                                    onChange={(file) => field.onChange(file)}
                                                    editable
                                                />
                                            )}
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-psi-dark/80 mb-1">
                                                Passe o mouse sobre a foto para alterar
                                            </p>
                                            <p className="text-xs text-psi-dark/60">
                                                Opcional. Formatos aceitos: PNG, JPG, GIF até 10MB
                                            </p>
                                            {isUploading && (
                                                <p className="text-xs text-psi-primary mt-1">
                                                    Enviando foto...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                    <h2 className="text-xl font-semibold text-psi-dark">Informações Pessoais</h2>

                                    <div className="grid gap-4
                                    sm:grid-cols-3">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-psi-dark mb-2">
                                                Nome
                                            </label>
                                            <Controller
                                                name="firstName"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        icon={User}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.firstName?.message || ""} />
                                        </div>

                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-psi-dark mb-2">
                                                Sobrenome
                                            </label>
                                            <Controller
                                                name="lastName"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        icon={User}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.lastName?.message || ""} />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-psi-dark mb-2">
                                                E-mail
                                            </label>
                                            <Input
                                                type="email"
                                                value={user?.email || ""}
                                                disabled
                                                icon={Mail}
                                                className="bg-psi-dark/5"
                                            />
                                        </div>
                                    </div>


                                    <div className="grid gap-4
                                    sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-psi-dark mb-2">
                                                Telefone
                                            </label>
                                            <Controller
                                                name="phone"
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
                                            <FieldError message={form.formState.errors.phone?.message || ""} />
                                        </div>

                                        <div>
                                            <label htmlFor="document" className="block text-sm font-medium text-psi-dark mb-2">
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
                                    sm:grid-cols-3">
                                        <div>
                                            <label htmlFor="nationality" className="block text-sm font-medium text-psi-dark mb-2">
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
                                            <label htmlFor="genre" className="block text-sm font-medium text-psi-dark mb-2">
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

                                        <div>
                                            <label htmlFor="birth" className="block text-sm font-medium text-psi-dark mb-2">
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
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.birth?.message || ""} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                    <h2 className="text-xl font-semibold text-psi-dark">Endereço</h2>

                                    <div className="grid gap-4
                                    sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="address?.zipCode" className="block text-sm font-medium text-psi-dark mb-2">
                                                CEP
                                            </label>
                                            <Controller
                                                name="address.zipCode"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <InputMask
                                                        mask="00000-000"
                                                        value={field.value || ""}
                                                        onAccept={(value) => updateAddressField("zipcode", value as string)}
                                                        placeholder="00000-000"
                                                        icon={Hash}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.zipCode?.message || ""} />
                                        </div>

                                        <div>
                                            <label htmlFor="address.complement" className="block text-sm font-medium text-psi-dark mb-2">
                                                Complemento
                                            </label>
                                            <Controller
                                                name="address.complement"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        value={field.value || ""}
                                                        onChange={(e) => updateAddressField("complement", e.target.value)}
                                                        placeholder="Apartamento, bloco, etc."
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.complement?.message || ""} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4
                                    sm:grid-cols-3">
                                        <div>
                                            <label htmlFor="address.street" className="block text-sm font-medium text-psi-dark mb-2">
                                                Rua
                                            </label>
                                            <Controller
                                                name="address.street"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        value={field.value || ""}
                                                        onChange={(e) => updateAddressField("street", e.target.value)}
                                                        placeholder="Nome da rua"
                                                        icon={MapPin}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.street?.message || ""} />
                                        </div>

                                        <div>
                                            <label htmlFor="address.number" className="block text-sm font-medium text-psi-dark mb-2">
                                                Número
                                            </label>
                                            <Controller
                                                name="address.number"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        value={field.value || ""}
                                                        onChange={(e) => updateAddressField("number", e.target.value)}
                                                        placeholder="123"
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.number?.message || ""} />
                                        </div>

                                        <div>
                                            <label htmlFor="address.neighborhood" className="block text-sm font-medium text-psi-dark mb-2">
                                                Bairro
                                            </label>
                                            <Controller
                                                name="address.neighborhood"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        value={field.value || ""}
                                                        onChange={(e) => updateAddressField("neighborhood", e.target.value)}
                                                        placeholder="Nome do bairro"
                                                        icon={Building2}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.address?.neighborhood?.message || ""} />
                                        </div>
                                    </div>


                                    <div className="grid gap-4
                                    sm:grid-cols-3">
                                        <div>
                                            <label htmlFor="address.country" className="block text-sm font-medium text-psi-dark mb-2">
                                                País
                                            </label>
                                            <Controller
                                                name="address.country"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => updateAddressField("country", value)}
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

                                        <div>
                                            <label htmlFor="address.state" className="block text-sm font-medium text-psi-dark mb-2">
                                                Estado
                                            </label>
                                            <Controller
                                                name="address.state"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => {
                                                            field.onChange(value)
                                                            updateAddressField("state", value)
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
                                            <label htmlFor="address.city" className="block text-sm font-medium text-psi-dark mb-2">
                                                Cidade
                                            </label>
                                            <Controller
                                                name="address.city"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value || undefined}
                                                        onValueChange={(value) => updateAddressField("city", value)}
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
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-psi-dark/10 flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <LoadingButton message="Salvando..." />
                                        ) : (
                                            "Salvar Alterações"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    MeuPerfilCustomer
}

