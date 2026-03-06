'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Eye, Printer, User, FileText, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
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
    onBulkSelect: (affiliates: Affiliate[]) => void
}

export default function AffiliatesTable({ onSelect, onBulkSelect }: AffiliatesTableProps) {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 25

    useEffect(() => {
        fetchAffiliates()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

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

    const totalPages = Math.ceil(filteredAffiliates.length / ITEMS_PER_PAGE)
    const paginatedAffiliates = filteredAffiliates.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Check if current page is selected
    const isCurrentPageSelected = paginatedAffiliates.length > 0 && paginatedAffiliates.every(a => selectedIds.has(a.dni))

    const toggleSelectAll = () => {
        const newSelected = new Set(selectedIds)
        if (isCurrentPageSelected) {
            paginatedAffiliates.forEach(a => newSelected.delete(a.dni))
        } else {
            paginatedAffiliates.forEach(a => newSelected.add(a.dni))
        }
        setSelectedIds(newSelected)
    }

    const toggleSelect = (dni: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(dni)) {
            newSelected.delete(dni)
        } else {
            newSelected.add(dni)
        }
        setSelectedIds(newSelected)
    }

    const handleBulkPrint = () => {
        const selectedAffiliates = affiliates.filter(a => selectedIds.has(a.dni))
        onBulkSelect(selectedAffiliates)
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={24} className="text-blue-500" />
                        Registros de Afiliados
                    </h2>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleBulkPrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-500/20 animate-in zoom-in duration-200"
                        >
                            <Printer size={16} />
                            Imprimir Seleccionados ({selectedIds.size})
                        </button>
                    )}
                </div>

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
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={isCurrentPageSelected}
                                    onChange={toggleSelectAll}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                            </th>
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
                        ) : paginatedAffiliates.length > 0 ? (
                            paginatedAffiliates.map((affiliate) => (
                                <tr
                                    key={affiliate.dni}
                                    className={cn(
                                        "hover:bg-blue-50/30 transition-colors group",
                                        selectedIds.has(affiliate.dni) && "bg-blue-50/50"
                                    )}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(affiliate.dni)}
                                            onChange={() => toggleSelect(affiliate.dni)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                        />
                                    </td>
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

            {/* Pagination Controls */}
            {!loading && filteredAffiliates.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                        Mostrando <span className="font-bold text-slate-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-bold text-slate-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAffiliates.length)}</span> de <span className="font-bold text-slate-700">{filteredAffiliates.length}</span> registros
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                            title="Anterior"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-1 px-2">
                            <span className="text-sm font-bold text-slate-700">{currentPage}</span>
                            <span className="text-sm text-slate-400">/</span>
                            <span className="text-sm text-slate-500">{totalPages}</span>
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                            title="Siguiente"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
