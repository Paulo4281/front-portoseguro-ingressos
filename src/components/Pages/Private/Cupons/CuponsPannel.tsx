"use client"

import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { Controller, useForm } from "react-hook-form"
import { useCouponFind } from "@/hooks/Coupon/useCouponFind"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { CouponService } from "@/services/Coupon/CouponService"
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
    ShieldCheck,
    Calendar,
    Loader2,
    RefreshCcw,
    TicketPercent,
    ShoppingBag,
    TimerReset
} from "lucide-react"

type TNewCouponForm = {
    code: string
    eventId: string
    discountType: "PERCENTAGE" | "FIXED"
    discountValue: string
    minPurchaseValue: string
    usageLimit: string
    expirationDate: string
}

const defaultNewCouponValues: TNewCouponForm = {
    code: "",
    eventId: "",
    discountType: "PERCENTAGE",
    discountValue: "10",
    minPurchaseValue: "",
    usageLimit: "",
    expirationDate: ""
}

const CuponsPannel = () => {
    const { data, isLoading } = useCouponFind()
    const { data: eventCacheData, isLoading: isEventCacheLoading } = useEventCache()
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
    const [isCreating, setIsCreating] = useState(false)

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
        setCoupons(couponsFromApi)
    }, [couponsFromApi])

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

        const response = await CouponService.update(couponId, coupon)

        if (response.success && response.data) {
            setCoupons((prev) =>
                prev.map((item) => (item.id === couponId ? response.data as TCoupon : item))
            )
            setDirtyCoupons((prev) => ({
                ...prev,
                [couponId]: false
            }))
            Toast.success("Cupom atualizado com sucesso")
        } else {
            Toast.error(response.message || "Não foi possível atualizar o cupom")
        }

        setSavingCoupons((prev) => ({
            ...prev,
            [couponId]: false
        }))
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

        setIsCreating(true)

        const response = await CouponService.create({
            code: formData.code,
            eventName: selectedEvent.name,
            eventId: selectedEvent.id,
            discountType: formData.discountType,
            discountValue: normalizedDiscountValue,
            expirationDate: formData.expirationDate ? new Date(`${formData.expirationDate}T00:00:00`).toISOString() : null,
            usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
            minPurchaseValue: formData.minPurchaseValue ? Math.round(Number(formData.minPurchaseValue.replace(",", ".")) * 100) : null
        })

        if (response.success && response.data) {
            setCoupons((prev) => [response.data as TCoupon, ...prev])
            Toast.success("Cupom criado com sucesso")
            reset(defaultNewCouponValues)
        } else {
            Toast.error(response.message || "Não foi possível criar o cupom")
        }

        setIsCreating(false)
    }

    const renderDiscountValue = (coupon: TCoupon) => {
        if (coupon.discountType === "PERCENTAGE") {
            return `${coupon.discountValue}%`
        }
        return ValueUtils.centsToCurrency(coupon.discountValue)
    }

    const renderMinPurchase = (coupon: TCoupon) => {
        if (!coupon.minPurchaseValue) return "Sem mínimo"
        return ValueUtils.centsToCurrency(coupon.minPurchaseValue)
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px]">
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

            <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 space-y-6 shadow-lg shadow-black/5">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-psi-dark flex items-center gap-2">
                        <Percent className="h-5 w-5 text-psi-primary" />
                        Criar novo cupom
                    </h2>
                    <p className="text-sm text-psi-dark/60">
                        Combine tipos de desconto, defina públicos e datas para potencializar suas vendas.
                    </p>
                </div>
                <form
                    className="grid gap-4
                    lg:flex lg:flex-nowrap lg:items-end"
                    onSubmit={handleSubmit(onCreateCoupon)}
                >
                    <div className="grid gap-2
                    ">
                        <span className="text-sm font-medium text-psi-dark">Código (máximo de 12 caracteres)</span>
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
                    </div>
                    <div className="grid gap-2
                    lg:flex-2">
                        <span className="text-sm font-medium text-psi-dark">Evento</span>
                        <Controller
                            control={control}
                            name="eventId"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isEventCacheLoading || availableEvents.length === 0}
                                >
                                    <SelectTrigger aria-label="Evento do cupom">
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
                    <div className="grid gap-2
                    lg:flex-1 lg:max-w-[180px]">
                        <span className="text-sm font-medium text-psi-dark">Tipo de desconto</span>
                        <Controller
                            control={control}
                            name="discountType"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger aria-label="Tipo de desconto">
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
                    <div className="grid gap-2
                    lg:flex-1 lg:max-w-[180px]">
                        <span className="text-sm font-medium text-psi-dark">
                            {newCouponDiscountType === "PERCENTAGE" ? "Percentual" : "Valor em reais"}
                        </span>
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
                                    placeholder={newCouponDiscountType === "PERCENTAGE" ? "10" : "50"}
                                />
                            )}
                        />
                    </div>
                    <div className="grid gap-2
                    lg:flex-1 lg:max-w-[200px]">
                        <span className="text-sm font-medium text-psi-dark">Data de expiração</span>
                        <Controller
                            control={control}
                            name="expirationDate"
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value || null}
                                    onChange={(date) => field.onChange(date ?? "")}
                                    minDate={new Date().toISOString().split("T")[0]}
                                />
                            )}
                        />
                    </div>
                    <div className="grid gap-2
                    lg:flex-1 lg:max-w-[150px]">
                        <span className="text-sm font-medium text-psi-dark">Uso máximo</span>
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
                    </div>
                    <div className="grid gap-2
                    lg:flex-1 lg:max-w-[200px]">
                        <span className="text-sm font-medium text-psi-dark">Valor mínimo (opcional)</span>
                        <Controller
                            control={control}
                            name="minPurchaseValue"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Ex: 150.00"
                                />
                            )}
                        />
                    </div>
                    <div className="flex justify-end flex-wrap gap-3 lg:flex-none lg:self-end lg:pl-4">
                        <Button type="submit" variant="primary" disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Criar cupom
                        </Button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-semibold text-psi-dark">Cupons configurados</h2>
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
                                    className="rounded-3xl border border-[#E4E6F0] bg-white/90 p-6 space-y-6 shadow-lg shadow-black/5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-psi-dark/50">Código</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-semibold text-psi-dark">{coupon.code}</span>
                                                <Badge variant={coupon.isActive ? "default" : "secondary"} className={coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-psi-dark/10 text-psi-dark"}>
                                                    {coupon.isActive ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-psi-dark/60">
                                                {coupon.eventName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={coupon.isActive}
                                                onCheckedChange={(checked) => handleCouponFieldChange(coupon.id, "isActive", checked)}
                                                aria-label={`Ativar cupom ${coupon.code}`}
                                            />
                                            <span className="text-sm font-medium text-psi-dark/70">
                                                {coupon.isActive ? "Disponível" : "Pausado"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid gap-4
                                    md:grid-cols-2
                                    lg:flex lg:flex-nowrap lg:items-end">
                                        <div className="space-y-2">
                                            <span className="text-xs font-semibold text-psi-dark/60">Tipo</span>
                                            <Select
                                                value={coupon.discountType}
                                                onValueChange={(value) => handleDiscountTypeChange(coupon.id, value as "PERCENTAGE" | "FIXED")}
                                            >
                                                <SelectTrigger aria-label={`Tipo do cupom ${coupon.code}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PERCENTAGE">Percentual</SelectItem>
                                                    <SelectItem value="FIXED">Valor fixo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2 lg:flex-1 min-w-[180px]">
                                            <span className="text-xs font-semibold text-psi-dark/60">Valor do desconto ({coupon.discountType === "PERCENTAGE" ? "%" : "R$"})</span>
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
                                        <div className="space-y-2 lg:flex-1 min-w-[180px]">
                                            <span className="text-xs font-semibold text-psi-dark/60">Valor mínimo (opcional) (R$)</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={coupon.minPurchaseValue ? (coupon.minPurchaseValue / 100).toString() : ""}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                    const value = event.target.value
                                                        ? event.target.value.replace(",", ".")
                                                        : ""
                                                    handleCouponFieldChange(
                                                        coupon.id,
                                                        "minPurchaseValue",
                                                        value ? Math.round(Number(value) * 100) : null
                                                    )
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2 lg:flex-1 min-w-[150px]">
                                            <span className="text-xs font-semibold text-psi-dark/60">Limite de uso</span>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={coupon.usageLimit ?? ""}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                    const value = event.target.value
                                                    handleCouponFieldChange(coupon.id, "usageLimit", value ? Number(value) : null)
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2 lg:flex-1 min-w-[200px]">
                                            <span className="text-xs font-semibold text-psi-dark/60">Expiração</span>
                                            <DatePicker
                                                value={coupon.expirationDate ? coupon.expirationDate.split("T")[0] : null}
                                                onChange={(value) => handleCouponFieldChange(
                                                    coupon.id,
                                                    "expirationDate",
                                                    value ? new Date(`${value}T00:00:00`).toISOString() : null
                                                )}
                                                minDate={new Date().toISOString().split("T")[0]}
                                            />
                                        </div>
                                        <div className="space-y-2 lg:flex-1 min-w-[160px]">
                                            <span className="text-xs font-semibold text-psi-dark/60">Utilizações</span>
                                            <div className="rounded-2xl border border-[#E4E6F0] bg-psi-dark/3 px-4 py-3">
                                                <p className="text-psi-dark font-semibold">{coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}</p>
                                                <p className="text-xs text-psi-dark/60">Clientes impactados</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end flex-wrap gap-3 lg:flex-none lg:self-end">
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
                                            >
                                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Salvar alterações
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="text-sm text-psi-dark/60 flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-psi-primary" />
                                            {renderDiscountValue(coupon)} • {renderMinPurchase(coupon)}
                                            {coupon.expirationDate && (
                                                <>
                                                    <span className="text-psi-dark/30">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        expira em {new Date(coupon.expirationDate).toLocaleDateString("pt-BR")}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {coupons.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-psi-dark/20 bg-white/60 p-8 text-center space-y-3">
                                <Gift className="h-10 w-10 text-psi-primary mx-auto" />
                                <p className="text-lg font-semibold text-psi-dark">Nenhum cupom disponível</p>
                                <p className="text-sm text-psi-dark/60">Crie sua primeira campanha para aumentar a conversão dos seus eventos.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </section>
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
            <p className="text-3xl font-semibold text-psi-dark">{value}</p>
        </div>
    )
}

export {
    CuponsPannel
}