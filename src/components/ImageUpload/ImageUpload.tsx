"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Cropper, { Area } from "react-easy-crop"
import { cn } from "@/lib/utils"

type TImageUploadProps = {
    value?: string | File | null
    onChange: (file: File | null) => void
    className?: string
    error?: string
    variant?: "default" | "document"
}

const ImageUpload = (
    {
        value,
        onChange,
        className,
        error,
        variant = "default"
    }: TImageUploadProps
) => {
    const [preview, setPreview] = useState<string | null>(
        value instanceof File 
            ? URL.createObjectURL(value) 
            : value || null
    )
    const [isCropModalOpen, setIsCropModalOpen] = useState(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', error => reject(error))
            image.src = url
        })

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0
    ): Promise<Blob> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        const rad = (rotation * Math.PI) / 180
        const sin = Math.abs(Math.sin(rad))
        const cos = Math.abs(Math.cos(rad))

        const imageWidth = image.width
        const imageHeight = image.height

        const rotatedWidth = imageWidth * cos + imageHeight * sin
        const rotatedHeight = imageWidth * sin + imageHeight * cos

        canvas.width = rotatedWidth
        canvas.height = rotatedHeight

        ctx.translate(rotatedWidth / 2, rotatedHeight / 2)
        ctx.rotate(rad)
        ctx.translate(-imageWidth / 2, -imageHeight / 2)

        ctx.drawImage(image, 0, 0)

        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        )

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.putImageData(data, 0, 0)

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob)
                }
            }, 'image/jpeg', 0.95)
        })
    }

    const onCropComplete = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels)
        },
        []
    )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.addEventListener('load', () => {
                    setImageSrc(reader.result as string)
                    setIsCropModalOpen(true)
                })
                reader.readAsDataURL(file)
            }
        }
    }

    const handleCropConfirm = async () => {
        if (imageSrc && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels,
                    rotation
                )
                
                const file = new File(
                    [croppedImage],
                    `cropped-image-${Date.now()}.jpg`,
                    { type: 'image/jpeg' }
                )
                
                onChange(file)
                const previewUrl = URL.createObjectURL(file)
                setPreview(previewUrl)
                setIsCropModalOpen(false)
                setImageSrc(null)
                setCrop({ x: 0, y: 0 })
                setZoom(1)
                setRotation(0)
                setCroppedAreaPixels(null)
            } catch (error) {
                console.error('Erro ao processar imagem:', error)
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

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (preview) {
            setImageSrc(preview)
            setIsCropModalOpen(true)
        }
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
                    <div className={`relative ${variant === "document" ? "p-2" : "p-4"}`}>
                        <img
                            src={preview}
                            alt="Preview"
                            className={cn(
                                "w-full rounded-lg",
                                variant === "document"
                                    ? "h-[400px] object-contain bg-psi-dark/5"
                                    : "h-[280px] object-cover lg:h-[600px]"
                            )}
                        />
                        <div className="absolute top-6 right-6 flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleEdit}
                                className="bg-white/90 hover:bg-white shadow-lg"
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemove()
                                }}
                                className="bg-white/90 hover:bg-white shadow-lg"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
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

            <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Imagem</DialogTitle>
                    </DialogHeader>
                    {imageSrc && (
                        <div className="space-y-4">
                            <div className="relative w-full h-[400px] bg-psi-dark/5 rounded-lg overflow-hidden">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={variant === "document" ? undefined : 16 / 9}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">
                                        Zoom: {Math.round(zoom * 100)}%
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                                        >
                                            <ZoomOut className="h-4 w-4" />
                                        </Button>
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                                        >
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">
                                        Rotação: {rotation}°
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRotation((rotation - 90) % 360)}
                                        >
                                            <RotateCw className="h-4 w-4" />
                                        </Button>
                                        <input
                                            type="range"
                                            min={0}
                                            max={360}
                                            step={1}
                                            value={rotation}
                                            onChange={(e) => setRotation(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setRotation((rotation + 90) % 360)}
                                        >
                                            <RotateCw className="h-4 w-4 rotate-180" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsCropModalOpen(false)
                                        setImageSrc(null)
                                        setCrop({ x: 0, y: 0 })
                                        setZoom(1)
                                        setRotation(0)
                                        setCroppedAreaPixels(null)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleCropConfirm}
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Confirmar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export {
    ImageUpload
}

