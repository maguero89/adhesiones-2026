'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import ImageUpload from './ImageUpload'
import { UserPlus, MapPin, CreditCard, Users, Save, Loader2, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AffiliateFormData {
    dni: string
    nombre_apellido: string
    nombre_padre: string
    nombre_madre: string
    domicilio: string
    localidad: string
}

export default function AffiliationForm() {
    const [formData, setFormData] = useState<AffiliateFormData>({
        dni: '',
        nombre_apellido: '',
        nombre_padre: '',
        nombre_madre: '',
        domicilio: '',
        localidad: '',
    })
    const [dniFrente, setDniFrente] = useState<File | null>(null)
    const [dniDorso, setDniDorso] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const uploadImage = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${path}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
            .from('documentos_dni')
            .upload(filePath, file)

        if (error) throw error

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documentos_dni')
            .getPublicUrl(filePath)

        return publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            if (!dniFrente || !dniDorso) {
                throw new Error('Debes subir ambas fotos del DNI (Frente y Dorso)')
            }

            // 1. Upload images
            const frenteUrl = await uploadImage(dniFrente, `frente_${formData.dni}`)
            const dorsoUrl = await uploadImage(dniDorso, `dorso_${formData.dni}`)

            // 2. Save record
            const { error } = await supabase.from('afiliados').insert([{
                ...formData,
                dni_frente_url: frenteUrl,
                dni_dorso_url: dorsoUrl,
            }])

            if (error) {
                if (error.code === '23505') throw new Error('Ya existe una persona registrada con ese DNI.')
                throw error
            }

            setStatus({ type: 'success', message: 'Afiliación registrada exitosamente.' })
            setFormData({ dni: '', nombre_apellido: '', nombre_padre: '', nombre_madre: '', domicilio: '', localidad: '' })
            setDniFrente(null)
            setDniDorso(null)
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Error al guardar los datos.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <UserPlus size={28} />
                    Nueva Afiliación
                </h2>
                <p className="text-blue-100 mt-2 opacity-90">Completa los datos del ciudadano para registrar la afiliación.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {status && (
                    <div className={cn(
                        "p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                        status.type === 'success' ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-red-50 text-red-800 border border-red-100"
                    )}>
                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
                        <span className="text-sm font-medium">{status.message}</span>
                    </div>
                )}

                {/* Datos Personales */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                        <Users size={20} className="text-blue-500" />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Datos Personales</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">DNI (Identificador Único)</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="dni"
                                    required
                                    value={formData.dni}
                                    onChange={handleChange}
                                    placeholder="Sin puntos ni espacios"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nombre y Apellido</label>
                            <input
                                type="text"
                                name="nombre_apellido"
                                required
                                value={formData.nombre_apellido}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Nombre del Padre <span className="text-xs font-normal italic text-slate-400">(Opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="nombre_padre"
                                value={formData.nombre_padre}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Nombre de la Madre <span className="text-xs font-normal italic text-slate-400">(Opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="nombre_madre"
                                value={formData.nombre_madre}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                            />
                        </div>
                    </div>
                </section>

                {/* Ubicación */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                        <MapPin size={20} className="text-blue-500" />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Ubicación</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Domicilio</label>
                            <input
                                type="text"
                                name="domicilio"
                                required
                                value={formData.domicilio}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Localidad</label>
                            <input
                                type="text"
                                name="localidad"
                                required
                                value={formData.localidad}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium"
                            />
                        </div>
                    </div>
                </section>

                {/* Documentación */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-800 border-b pb-2">
                        <CreditCard size={20} className="text-blue-500" />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Documentación (DNI)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload
                            label="DNI Frente"
                            onImageSelected={setDniFrente}
                        />
                        <ImageUpload
                            label="DNI Dorso"
                            onImageSelected={setDniDorso}
                        />
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                        "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3",
                        loading
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] hover:shadow-blue-500/30"
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Guardando Afiliación...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Registrar Afiliación
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
