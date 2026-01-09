"use client"

import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { Controller, useForm } from "react-hook-form"
import { useCouponFind } from "@/hooks/Coupon/useCouponFind"
import { useCouponCreate } from "@/hooks/Coupon/useCouponCreate"
import { useCouponUpdate } from "@/hooks/Coupon/useCouponUpdate"
import { useCouponUpdateIsActive } from "@/hooks/Coupon/useCouponUpdateIsActive"
import { useCouponDelete } from "@/hooks/Coupon/useCouponDelete"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import type { TCoupon } from "@/types/Coupon/TCoupon"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { Toast } from "@/components/Toast/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Background } from "@/components/Background/Background"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import {
    Percent,
    Gift,
    Loader2,
    TicketPercent,
    TimerReset,
    Trash2
} from "lucide-react"
import { queryClient } from "@/providers/QueryClientProvider/QueryClientProvider"

type TNewCouponForm = {
    code: string
    eventId: string
    discountType: "PERCENTAGE" | "FIXED"
    discountValue: string
    usageLimit: string
    expirationDate: string
}

const defaultNewCouponValues: TNewCouponForm = {
    code: "",
    eventId: "",
    discountType: "PERCENTAGE",
    discountValue: "10",
    usageLimit: "",
    expirationDate: ""
}

const CuponsPannel = () => {
    const { data, isLoading } = useCouponFind()
    const { mutateAsync: createCoupon, isPending: isCreating } = useCouponCreate()
    const { mutateAsync: updateCoupon, isPending: isUpdating } = useCouponUpdate()
    const { mutateAsync: updateIsActive } = useCouponUpdateIsActive()
    const { mutateAsync: deleteCoupon, isPending: isDeleting } = useCouponDelete()
    const { data: eventCacheData, isLoading: isEventCacheLoading } = useEventCache()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [couponToDelete, setCouponToDelete] = useState<string | null>(null)
    const couponsFromApi = useMemo(() => {
        if (data?.data && Array.isArray(data.data)) {
            return data.data
        }
        return []
    }, [data])
    const availableEvents = useMemo(() => {
        if (eventCacheData?.data && Array.isArray(eventCacheData.data)) {
            return eventCacheData.data
        }
        return []
    }, [eventCacheData])
    const [coupons, setCoupons] = useState<TCoupon[]>([])
    const [dirtyCoupons, setDirtyCoupons] = useState<Record<string, boolean>>({})
    const [savingCoupons, setSavingCoupons] = useState<Record<string, boolean>>({})

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm<TNewCouponForm>({
        defaultValues: defaultNewCouponValues
    })

    const newCouponDiscountType = watch("discountType")
    const selectedEventId = watch("eventId")

    useEffect(() => {
        const couponsWithEventName = couponsFromApi.map((coupon) => {
            const event = availableEvents.find((evt) => evt.id === coupon.eventId)
            return {
                ...coupon,
                eventName: event?.name || "Evento não encontrado"
            }
        })
        setCoupons(couponsWithEventName)
    }, [couponsFromApi, availableEvents])

    useEffect(() => {
        if (!selectedEventId && availableEvents.length > 0) {
            setValue("eventId", availableEvents[0].id, { shouldDirty: false })
        }
    }, [selectedEventId, availableEvents, setValue])

    const stats = useMemo(() => {
        const total = coupons.length
        const active = coupons.filter((coupon) => coupon.isActive).length
        const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.usageCount, 0)
        const expiringSoon = coupons.filter((coupon) => {
            if (!coupon.expirationDate) return false
            const diff = new Date(coupon.expirationDate).getTime() - Date.now()
            return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000
        }).length

        return {
            total,
            active,
            totalUsage,
            expiringSoon
        }
    }, [coupons])

    const markDirty = (couponId: string) => {
        setDirtyCoupons((prev) => ({
            ...prev,
            [couponId]: true
        }))
    }

    const handleCouponFieldChange = <K extends keyof TCoupon>(couponId: string, field: K, value: TCoupon[K]) => {
        setCoupons((prev) =>
            prev.map((coupon) =>
                coupon.id === couponId ? { ...coupon, [field]: value } : coupon
            )
        )
        markDirty(couponId)
    }

    const handleDiscountTypeChange = (couponId: string, type: "PERCENTAGE" | "FIXED") => {
        setCoupons((prev) =>
            prev.map((coupon) => {
                if (coupon.id !== couponId) return coupon

                const nextValue = type === "PERCENTAGE"
                    ? Math.max(1, Math.min(100, coupon.discountType === "PERCENTAGE" ? coupon.discountValue : 10))
                    : coupon.discountType === "FIXED" ? coupon.discountValue : 5000

                return {
                    ...coupon,
                    discountType: type,
                    discountValue: nextValue
                }
            })
        )
        markDirty(couponId)
    }

    const handleSaveCoupon = async (couponId: string) => {
        const coupon = coupons.find((item) => item.id === couponId)
        if (!coupon) return

        setSavingCoupons((prev) => ({
            ...prev,
            [couponId]: true
        }))

        const updatePayload = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            expirationDate: coupon.expirationDate,
            usageLimit: coupon.usageLimit
        }

        try {
            const response = await updateCoupon({ id: couponId, data: updatePayload })

            if (response.success) {
                setDirtyCoupons((prev) => ({
                    ...prev,
                    [couponId]: false
                }))
                Toast.success("Cupom atualizado com sucesso")
                queryClient.invalidateQueries({ queryKey: ["coupons"] })
            } else {
                Toast.error(response.message || "Não foi possível atualizar o cupom")
            }
        } catch (error) {
            Toast.error("Não foi possível atualizar o cupom")
        } finally {
            setSavingCoupons((prev) => ({
                ...prev,
                [couponId]: false
            }))
        }
    }

    const onCreateCoupon = async (formData: TNewCouponForm) => {
        if (!formData.code.trim()) {
            Toast.error("Informe o código do cupom")
            return
        }

        if (!formData.eventId) {
            Toast.error("Selecione um evento")
            return
        }

        const selectedEvent = availableEvents.find((event) => event.id === formData.eventId)

        if (!selectedEvent) {
            Toast.error("Evento selecionado é inválido")
            return
        }

        const normalizedDiscountValue = formData.discountType === "PERCENTAGE"
            ? Math.max(1, Math.min(100, Number(formData.discountValue) || 0))
            : Math.round((Number(formData.discountValue.replace(",", ".")) || 0) * 100)

        if (normalizedDiscountValue <= 0) {
            Toast.error("Defina um valor de desconto válido")
            return
        }

        try {
            const response = await createCoupon({
                code: formData.code,
                eventId: selectedEvent.id,
                discountType: formData.discountType,
                discountValue: normalizedDiscountValue,
                expirationDate: formData.expirationDate ? new Date(`${formData.expirationDate}T00:00:00`).toISOString() : null,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
            })

            if (response.success) {
                Toast.success("Cupom criado com sucesso")
                reset(defaultNewCouponValues)
                queryClient.invalidateQueries({ queryKey: ["coupons"] })
            } else {
                Toast.error(response.message || "Não foi possível criar o cupom")
            }
        } catch (error) {
            Toast.error("Não foi possível criar o cupom")
        }
    }

    const handleDeleteCoupon = async () => {
        if (!couponToDelete) return

        try {
            const response = await deleteCoupon(couponToDelete)
            if (response.success) {
                Toast.success("Cupom excluído com sucesso")
                setCoupons((prev) => prev.filter((coupon) => coupon.id !== couponToDelete))
                setDeleteDialogOpen(false)
                setCouponToDelete(null)
            } else {
                Toast.error(response.message || "Não foi possível excluir o cupom")
            }
        } catch (error) {
            Toast.error("Não foi possível excluir o cupom")
        }
    }

    const openDeleteDialog = (couponId: string) => {
        setCouponToDelete(couponId)
        setDeleteDialogOpen(true)
    }

    const renderDiscountValue = (coupon: TCoupon) => {
        if (coupon.discountType === "PERCENTAGE") {
            return `${coupon.discountValue}%`
        }
        return ValueUtils.centsToCurrency(coupon.discountValue)
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] container">
            <section className="space-y-10 px-4
            sm:px-6
            lg:px-8">
            <div className="space-y-4">
                <div className="space-y-3">
                    <h1 className="text-3xl font-semibold text-psi-primary
                    sm:text-4xl">
                        Cupons e incentivos
                    </h1>
                    <p className="text-psi-dark/70 max-w-3xl">
                        Crie incentivos exclusivos para seus eventos, controle vigência, limite de uso e acompanhe os resultados em tempo real.
                    </p>
                </div>
            </div>

            <div className="grid gap-4
            md:grid-cols-2
            xl:grid-cols-3">
                <StatCard
                    icon={Gift}
                    title="Cupons ativos"
                    value={`${stats.active}/${stats.total}`}
                    subtitle="Disponíveis agora"
                />
                <StatCard
                    icon={TicketPercent}
                    title="Total utilizados"
                    value={stats.totalUsage.toString()}
                    subtitle="Desde o início"
                />
                <StatCard
                    icon={TimerReset}
                    title="Expiram em breve"
                    value={stats.expiringSoon.toString()}
                    subtitle="Próximos 7 dias"
                />
            </div>

            <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-8 space-y-8 shadow-lg shadow-black/5">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium text-psi-dark flex items-center gap-2">
                        <Percent className="h-5 w-5 text-psi-primary" />
                        Criar novo cupom
                    </h2>
                    <p className="text-sm text-psi-dark/60">
                        Combine tipos de desconto, defina públicos e datas para potencializar suas vendas.
                    </p>
                </div>
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onCreateCoupon)}
                >
                    <div className="grid gap-6
                    md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">Código do cupom</label>
                            <Controller
                                control={control}
                                name="code"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        required
                                        placeholder="PORTO2025"
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value.toUpperCase())}
                                        maxLength={12}
                                        
                                    />
                                )}
                            />
                            <p className="text-xs text-psi-dark/50">Máximo de 12 caracteres</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">Evento</label>
                            <Controller
                                control={control}
                                name="eventId"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isEventCacheLoading || availableEvents.length === 0}
                                    >
                                        <SelectTrigger aria-label="Evento do cupom" >
                                            <SelectValue placeholder={isEventCacheLoading ? "Carregando eventos..." : "Selecione um evento"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableEvents.map((eventItem) => (
                                                <SelectItem key={eventItem.id} value={eventItem.id}>
                                                    {eventItem.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="border-t border-psi-dark/10 pt-6">
                        <h3 className="text-sm font-medium text-psi-dark mb-4">Configuração de desconto</h3>
                        <div className="grid gap-6
                        md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-psi-dark">Tipo de desconto</label>
                                <Controller
                                    control={control}
                                    name="discountType"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger aria-label="Tipo de desconto" >
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PERCENTAGE">Percentual (%)</SelectItem>
                                                <SelectItem value="FIXED">Valor fixo (R$)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-psi-dark">
                                    {newCouponDiscountType === "PERCENTAGE" ? "Percentual de desconto (em %)" : "Valor do desconto (em R$)"}
                                </label>
                                <Controller
                                    control={control}
                                    name="discountValue"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            required
                                            type="number"
                                            min="1"
                                            max={newCouponDiscountType === "PERCENTAGE" ? "100" : undefined}
                                            step={newCouponDiscountType === "PERCENTAGE" ? "1" : "0.01"}
                                            placeholder={newCouponDiscountType === "PERCENTAGE" ? "10" : "50.00"}
                                            
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-psi-dark/10 pt-6">
                        <h3 className="text-sm font-medium text-psi-dark mb-4">Regras e limites</h3>
                        <div className="grid gap-6
                        md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-psi-dark">Data de expiração (opcional)</label>
                                <Controller
                                    control={control}
                                    name="expirationDate"
                                    render={({ field }) => (
                                        <DatePicker
                                            value={field.value || null}
                                            onChange={(date) => field.onChange(date ?? "")}
                                            minDate={new Date().toISOString().split("T")[0]}
                                            absoluteClassName={true}
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-psi-dark">Limite de uso (opcional)</label>
                                <Controller
                                    control={control}
                                    name="usageLimit"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            min="1"
                                            placeholder="Ex: 100"
                                        />
                                    )}
                                />
                                <p className="text-xs text-psi-dark/50">Deixe vazio para ilimitado</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-psi-dark/10">
                        <Button type="submit" variant="primary" disabled={isCreating} className="min-w-[160px]">
                            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                            Criar cupom
                        </Button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-medium text-psi-dark">Cupons configurados</h2>
                        <p className="text-sm text-psi-dark/60">
                            Gerencie status, valores e regras de utilização
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-48 w-full rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {coupons.map((coupon) => {
                            const isDirty = dirtyCoupons[coupon.id]
                            const isSaving = savingCoupons[coupon.id]

                            return (
                                <div
                                    key={coupon.id}
                                    className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-8 space-y-6 shadow-lg shadow-black/5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-psi-dark/10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-medium text-psi-dark">{coupon.code}</span>
                                                <Badge variant={coupon.isActive ? "default" : "secondary"} className={coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-psi-dark/10 text-psi-dark"}>
                                                    {coupon.isActive ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </div>
                                            <hr />
                                            <p className="text-lg font-semibold text-psi-primary/80">
                                                {coupon.eventName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={coupon.isActive}
                                                onCheckedChange={async (checked) => {
                                                    handleCouponFieldChange(coupon.id, "isActive", checked)
                                                    try {
                                                        const response = await updateIsActive(coupon.id)
                                                        if (!response.success) {
                                                            handleCouponFieldChange(coupon.id, "isActive", !checked)
                                                            Toast.error(response.message || "Não foi possível atualizar o status do cupom")
                                                        } else {
                                                            Toast.success("Status do cupom atualizado")
                                                        }
                                                    } catch (error) {
                                                        handleCouponFieldChange(coupon.id, "isActive", !checked)
                                                        Toast.error("Não foi possível atualizar o status do cupom")
                                                    }
                                                }}
                                                aria-label={`Ativar cupom ${coupon.code}`}
                                            />
                                            <span className="text-sm font-medium text-psi-dark/70">
                                                {coupon.isActive ? "Disponível" : "Pausado"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-psi-dark mb-4">Configuração de desconto</h3>
                                            <div className="grid gap-4
                                            md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-psi-dark">Tipo de desconto</label>
                                                    <Select
                                                        value={coupon.discountType}
                                                        onValueChange={(value) => handleDiscountTypeChange(coupon.id, value as "PERCENTAGE" | "FIXED")}
                                                    >
                                                        <SelectTrigger aria-label={`Tipo do cupom ${coupon.code}`} >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PERCENTAGE">Percentual</SelectItem>
                                                            <SelectItem value="FIXED">Valor fixo</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-psi-dark">
                                                        Valor do desconto ({coupon.discountType === "PERCENTAGE" ? "%" : "R$"})
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={coupon.discountType === "PERCENTAGE" ? "100" : undefined}
                                                        step={coupon.discountType === "PERCENTAGE" ? "1" : "0.01"}
                                                        value={coupon.discountType === "PERCENTAGE" ? String(coupon.discountValue) : (coupon.discountValue / 100).toString()}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            const value = event.target.value
                                                            const parsed = coupon.discountType === "PERCENTAGE"
                                                                ? Math.max(1, Math.min(100, Number(value)))
                                                                : Math.round((Number(value) || 0) * 100)
                                                            handleCouponFieldChange(coupon.id, "discountValue", parsed || 0)
                                                        }}
                                                        required
                                                        
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-psi-dark/10 pt-6">
                                            <h3 className="text-sm font-medium text-psi-dark mb-4">Regras e limites</h3>
                                            <div className="grid gap-4
                                            md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-psi-dark">Limite de uso</label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={coupon.usageLimit ?? ""}
                                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            const value = event.target.value
                                                            handleCouponFieldChange(coupon.id, "usageLimit", value ? Number(value) : null)
                                                        }}
                                                        placeholder="Ilimitado"
                                                        
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-psi-dark">Data de expiração</label>
                                                    <DatePicker
                                                        value={coupon.expirationDate ? coupon.expirationDate.split("T")[0] : null}
                                                        onChange={(value) => handleCouponFieldChange(
                                                            coupon.id,
                                                            "expirationDate",
                                                            value ? new Date(`${value}T00:00:00`).toISOString() : null
                                                        )}
                                                        minDate={new Date().toISOString().split("T")[0]}
                                                        absoluteClassName={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-psi-dark/10 pt-6">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-6">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-psi-dark/50">Utilizações</p>
                                                        <p className="text-lg font-medium text-psi-dark">
                                                            {coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : " (ilimitado)"}
                                                        </p>
                                                    </div>
                                                    <div className="h-12 w-px bg-psi-dark/10" />
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-psi-dark/50">Desconto</p>
                                                        <p className="text-lg font-medium text-psi-primary">
                                                            {renderDiscountValue(coupon)}
                                                        </p>
                                                    </div>
                                                    {coupon.expirationDate && (
                                                        <>
                                                            <div className="h-12 w-px bg-psi-dark/10" />
                                                            <div className="space-y-1">
                                                                <p className="text-xs text-psi-dark/50">Expira em</p>
                                                                <p className="text-lg font-medium text-psi-dark">
                                                                    {new Date(coupon.expirationDate).toLocaleDateString("pt-BR")}
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {isDirty && (
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                                            Alterações pendentes
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        disabled={!isDirty || isSaving}
                                                        onClick={() => handleSaveCoupon(coupon.id)}
                                                        className="min-w-[160px]"
                                                    >
                                                        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                                        Salvar alterações
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => openDeleteDialog(coupon.id)}
                                                        className="min-w-[120px]"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {coupons.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-psi-dark/20 bg-white/60 p-8 text-center space-y-3">
                                <Gift className="h-10 w-10 text-psi-primary mx-auto" />
                                <p className="text-lg font-medium text-psi-dark">Nenhum cupom disponível</p>
                                <p className="text-sm text-psi-dark/60">Crie sua primeira campanha para aumentar a conversão dos seus eventos.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </section>

            <DialogConfirm
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteCoupon}
                title="Excluir cupom"
                description={`Tem certeza que deseja excluir o cupom "${coupons.find(c => c.id === couponToDelete)?.code}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={isDeleting}
                variant="destructive"
            />
        </Background>
    )
}

type TStatCardProps = {
    icon: typeof Percent
    title: string
    value: string
    subtitle: string
}

const StatCard = ({ icon: Icon, title, value, subtitle }: TStatCardProps) => {
    return (
        <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-5 flex flex-col gap-3 shadow-md shadow-black/5">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-psi-primary/10 text-psi-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-psi-dark/40">{subtitle}</p>
                    <p className="text-sm font-medium text-psi-dark/70">{title}</p>
                </div>
            </div>
            <p className="text-3xl font-medium text-psi-dark">{value}</p>
        </div>
    )
}

export {
    CuponsPannel
}