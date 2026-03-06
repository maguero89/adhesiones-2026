'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Eye, Printer, User, FileText, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Affiliate {
    dni: string
    nombre_apellido: string
    nombre_padre: string
    nombre_madre: string
    domicilio: string
    localidad: string
    dni_frente_url: string
    dni_dorso_url: string
    created_at: string
}

interface AffiliatesTableProps {
    onSelect: (affiliate: Affiliate) => void
}

export default function AffiliatesTable({ onSelect }: AffiliatesTableProps) {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAffiliates()
    }, [])

    const fetchAffiliates = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('afiliados')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching affiliates:', error)
        } else {
            setAffiliates(data || [])
        }
        setLoading(false)
    }

    const filteredAffiliates = affiliates.filter(a =>
        a.dni.includes(searchTerm) ||
        a.nombre_apellido.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText size={24} className="text-blue-500" />
                    Registros de Afiliados
                </h2>

                <div className="relative md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por DNI o Nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">Afiliado</th>
                            <th className="px-6 py-4 font-bold">DNI</th>
                            <th className="px-6 py-4 font-bold">Localidad</th>
                            <th className="px-6 py-4 font-bold">Fecha</th>
                            <th className="px-6 py-4 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Loader2 className="animate-spin" size={32} />
                                        <p>Cargando registros...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredAffiliates.length > 0 ? (
                            filteredAffiliates.map((affiliate) => (
                                <tr key={affiliate.dni} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {affiliate.nombre_apellido.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-700">{affiliate.nombre_apellido}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm font-mono">{affiliate.dni}</td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{affiliate.localidad}</td>
                                    <td className="px-6 py-4 text-slate-400 text-xs text-nowrap">
                                        {new Date(affiliate.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onSelect(affiliate)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-2 text-sm font-medium"
                                        >
                                            Ver Detalle
                                            <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    No se encontraron resultados para "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
