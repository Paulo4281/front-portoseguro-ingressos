"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TImageUploadProps = {
    value?: string | File | null
    onChange: (file: File | null) => void
    className?: string
    error?: string
}

const ImageUpload = (
    {
        value,
        onChange,
        className,
        error
    }: TImageUploadProps
) => {
    const [preview, setPreview] = useState<string | null>(
        value instanceof File 
            ? URL.createObjectURL(value) 
            : value || null
    )
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type.startsWith("image/")) {
                onChange(file)
                const previewUrl = URL.createObjectURL(file)
                setPreview(previewUrl)
            }
        }
    }

    const handleRemove = () => {
        onChange(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl transition-all duration-200",
                    error
                        ? "border-destructive bg-destructive/5"
                        : preview
                        ? "border-psi-primary/30 bg-psi-primary/5"
                        : "border-[#E4E6F0] bg-[#F3F4FB] hover:border-psi-primary/50 hover:bg-psi-primary/5",
                    "cursor-pointer"
                )}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {preview ? (
                    <div className="relative p-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemove()
                            }}
                            className="absolute top-6 right-6 bg-white/90 hover:bg-white shadow-lg"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-psi-primary/10 p-4 mb-4">
                            <Upload className="h-8 w-8 text-psi-primary" />
                        </div>
                        <p className="text-sm font-medium text-psi-dark mb-1">
                            Clique para fazer upload
                        </p>
                        <p className="text-xs text-psi-dark/60">
                            ou arraste e solte a imagem aqui
                        </p>
                        <p className="text-xs text-psi-dark/40 mt-2">
                            PNG, JPG, GIF até 10MB
                        </p>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}

export {
    ImageUpload
}

