"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Type, List, CheckSquare, Radio, FileText, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type TFormFieldType = "text" | "email" | "number" | "tel" | "textarea" | "select" | "checkbox" | "radio"

export type TFormFieldOption = {
    id: string
    label: string
}

export type TFormField = {
    id: string
    type: TFormFieldType
    label: string
    placeholder?: string
    required: boolean
    options?: TFormFieldOption[]
}

type TFormBuilderProps = {
    fields?: TFormField[]
    onChange?: (fields: TFormField[]) => void
}

const FormBuilder = ({ fields: initialFields = [], onChange }: TFormBuilderProps) => {
    const [fields, setFields] = useState<TFormField[]>(initialFields)

    const generateId = () => {
        return `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    const handleFieldsChange = (newFields: TFormField[]) => {
        setFields(newFields)
        onChange?.(newFields)
    }

    const addField = (type: TFormFieldType) => {
        const newField: TFormField = {
            id: generateId(),
            type,
            label: "",
            placeholder: "",
            required: false,
            ...(type === "select" || type === "radio" || type === "checkbox" ? { options: [{ id: generateId(), label: "" }] } : {})
        }
        handleFieldsChange([...fields, newField])
    }

    const removeField = (fieldId: string) => {
        handleFieldsChange(fields.filter(f => f.id !== fieldId))
    }

    const updateField = (fieldId: string, updates: Partial<TFormField>) => {
        handleFieldsChange(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f))
    }

    const moveField = (fieldId: string, direction: "up" | "down") => {
        const index = fields.findIndex(f => f.id === fieldId)
        if (index === -1) return

        const newIndex = direction === "up" ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= fields.length) return

        const newFields = [...fields]
        const [movedField] = newFields.splice(index, 1)
        newFields.splice(newIndex, 0, movedField)
        handleFieldsChange(newFields)
    }

    const addOption = (fieldId: string) => {
        const newOption: TFormFieldOption = {
            id: generateId(),
            label: ""
        }
        updateField(fieldId, {
            options: [...(fields.find(f => f.id === fieldId)?.options || []), newOption]
        })
    }

    const removeOption = (fieldId: string, optionId: string) => {
        const field = fields.find(f => f.id === fieldId)
        if (!field?.options) return

        const newOptions = field.options.filter(opt => opt.id !== optionId)
        updateField(fieldId, { options: newOptions.length > 0 ? newOptions : undefined })
    }

    const updateOption = (fieldId: string, optionId: string, label: string) => {
        const field = fields.find(f => f.id === fieldId)
        if (!field?.options) return

        const newOptions = field.options.map(opt =>
            opt.id === optionId ? { ...opt, label } : opt
        )
        updateField(fieldId, { options: newOptions })
    }

    const fieldTypeIcons = {
        text: Type,
        email: Type,
        number: Type,
        tel: Type,
        textarea: FileText,
        select: List,
        checkbox: CheckSquare,
        radio: Radio
    }

    const fieldTypeLabels = {
        text: "Texto",
        email: "Email",
        number: "Número",
        tel: "Telefone",
        textarea: "Texto Longo",
        select: "Seleção",
        checkbox: "Múltipla Escolha",
        radio: "Escolha Única"
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-psi-dark">Campos do Formulário</h3>
                    <p className="text-sm text-psi-dark/60 mt-1">
                        Crie perguntas personalizadas para os compradores
                    </p>
                </div>
                <Select
                    onValueChange={(value) => {
                        addField(value as TFormFieldType)
                    }}
                    value=""
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Adicionar campo..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="text">
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-psi-dark/60" />
                                <span>Texto</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="email">
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-psi-dark/60" />
                                <span>Email</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="number">
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-psi-dark/60" />
                                <span>Número</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="tel">
                            <div className="flex items-center gap-2">
                                <Type className="h-4 w-4 text-psi-dark/60" />
                                <span>Telefone</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="textarea">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-psi-dark/60" />
                                <span>Texto Longo</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="select">
                            <div className="flex items-center gap-2">
                                <List className="h-4 w-4 text-psi-dark/60" />
                                <span>Seleção</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="checkbox">
                            <div className="flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-psi-dark/60" />
                                <span>Múltipla Escolha</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="radio">
                            <div className="flex items-center gap-2">
                                <Radio className="h-4 w-4 text-psi-dark/60" />
                                <span>Escolha Única</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {fields.length === 0 ? (
                <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-8 text-center">
                    <p className="text-sm text-psi-dark/60">
                        Nenhum campo adicionado ainda. Clique em "Adicionar campo" para começar.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {fields.map((field, index) => {
                        const Icon = fieldTypeIcons[field.type]
                        const isFirst = index === 0
                        const isLast = index === fields.length - 1

                        return (
                            <div
                                key={field.id}
                                className="rounded-xl border border-psi-primary/20 bg-white p-4 space-y-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 pt-2">
                                        <GripVertical className="h-5 w-5 text-psi-dark/30" />
                                        <Icon className="h-5 w-5 text-psi-primary" />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-psi-primary/10 text-psi-primary">
                                                {fieldTypeLabels[field.type]}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1
                                        sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-psi-dark/70 mb-1">
                                                    Label da Pergunta *
                                                </label>
                                                <Input
                                                    value={field.label}
                                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                    placeholder="Ex: Qual o tamanho da camisa?"
                                                    className="w-full"
                                                />
                                            </div>

                                            {(field.type === "text" || field.type === "email" || field.type === "number" || field.type === "tel" || field.type === "textarea") && (
                                                <div>
                                                    <label className="block text-xs font-medium text-psi-dark/70 mb-1">
                                                        Placeholder (Opcional)
                                                    </label>
                                                    <Input
                                                        value={field.placeholder || ""}
                                                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                                        placeholder="Ex: Digite seu tamanho..."
                                                        className="w-full"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="block text-xs font-medium text-psi-dark/70">
                                                        Opções *
                                                    </label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addOption(field.id)}
                                                        className="h-7 text-xs"
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        Adicionar Opção
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {field.options?.map((option, optIndex) => (
                                                        <div key={option.id} className="flex items-center gap-2">
                                                            <Input
                                                                value={option.label}
                                                                onChange={(e) => updateOption(field.id, option.id, e.target.value)}
                                                                placeholder={`Opção ${optIndex + 1}`}
                                                                className="flex-1"
                                                            />
                                                            {field.options && field.options.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeOption(field.id, option.id)}
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-3">
                                            <Checkbox
                                                id={`required-${field.id}`}
                                                checked={field.required}
                                                onCheckedChange={(checked) => updateField(field.id, { required: checked === true })}
                                            />
                                            <label htmlFor={`required-${field.id}`} className="text-sm font-medium text-psi-dark cursor-pointer">
                                                Campo obrigatório
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => moveField(field.id, "up")}
                                            disabled={isFirst}
                                            className="h-7 w-7 p-0"
                                        >
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => moveField(field.id, "down")}
                                            disabled={isLast}
                                            className="h-7 w-7 p-0"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeField(field.id)}
                                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export {
    FormBuilder
}
