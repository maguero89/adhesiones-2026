'use client'

import React, { useState, useRef, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import { Upload, X, Copy, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    label: string
    onImageSelected: (file: File | null) => void
    error?: string
}

export default function ImageUpload({ label, onImageSelected, error }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [isCompressing, setIsCompressing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await processImage(file)
        }
    }

    const processImage = async (file: File) => {
        if (!file.type.startsWith('image/')) return

        setIsCompressing(true)
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(file, options)

            const objectUrl = URL.createObjectURL(compressedFile)
            setPreview(objectUrl)
            onImageSelected(compressedFile)
        } catch (err) {
            console.error('Error compressing image:', err)
        } finally {
            setIsCompressing(false)
        }
    }

    const handlePaste = async (event: React.ClipboardEvent) => {
        const items = event.clipboardData.items
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile()
                if (file) {
                    await processImage(file)
                }
            }
        }
    }

    // To support pasting anywhere in the container
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const pasteHandler = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items
            if (!items) return
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile()
                    if (file) {
                        processImage(file)
                    }
                }
            }
        }

        container.addEventListener('paste', pasteHandler as any)
        return () => container.removeEventListener('paste', pasteHandler as any)
    }, [])

    const removeImage = () => {
        setPreview(null)
        onImageSelected(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div
                ref={containerRef}
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] bg-slate-50 hover:bg-slate-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    preview ? "border-emerald-500 bg-emerald-50" : "border-slate-300",
                    error && "border-red-500 bg-red-50"
                )}
            >
                {preview ? (
                    <div className="relative w-full h-full min-h-[200px]">
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                removeImage()
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X size={16} />
                        </button>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                            <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        {isCompressing ? (
                            <div className="flex flex-col items-center space-y-2">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-slate-500 font-medium">Procesando imagen...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3 p-3 bg-white rounded-full shadow-sm animate-bounce group-hover:animate-none">
                                    <Camera className="text-blue-500" size={24} />
                                </div>
                                <p className="text-sm text-slate-600 font-semibold mb-1">
                                    Subir, pegar (Ctrl+V) o tomar foto
                                </p>
                                <p className="text-xs text-slate-400">
                                    PNG, JPG o JPEG (Máx. 1MB comprimido)
                                </p>
                            </>
                        )}
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    )
}
