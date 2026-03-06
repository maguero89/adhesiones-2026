'use client'

import React from 'react'
import { Printer, X, Download, User, MapPin, CreditCard } from 'lucide-react'
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
}

interface PrintViewProps {
    affiliates: Affiliate[]
    onClose: () => void
}

export default function PrintView({ affiliates, onClose }: PrintViewProps) {
    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:relative print:inset-auto print-container">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl print:shadow-none print:max-h-none print:max-w-none print:rounded-none">
                {/* Toolbar - hidden on print */}
                <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex items-center justify-between print:hidden z-10">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">Vista Previa de Impresión</h3>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">A4 Optimizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-lg shadow-blue-500/20"
                        >
                            <Printer size={18} />
                            Imprimir Ficha
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Printable Area */}
                <div id="printable-area" className="flex flex-col gap-0 print:block">
                    {affiliates.map((affiliate, index) => (
                        <div
                            key={affiliate.dni}
                            className={cn(
                                "p-12 md:p-16 print:p-8 print:w-[210mm] print:mx-auto bg-white",
                                index > 0 && "print:break-before-page border-t md:border-t-0 border-slate-100"
                            )}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-2 mb-4">
                                <div>
                                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">FICHA DE ADHESION</h1>
                                </div>
                                <div className="text-right border-l-4 border-blue-500 pl-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">DNI IDENTIFICADOR</p>
                                    <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">{affiliate.dni}</p>
                                </div>
                            </div>

                            {/* Personal Data Grid */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-6">
                                <div>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                                        <User size={8} strokeWidth={3} />
                                        Nombre y Apellido
                                    </p>
                                    <p className="text-base font-bold text-slate-800 border-b border-slate-100 pb-0.5">{affiliate.nombre_apellido}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                                        <CreditCard size={8} strokeWidth={3} />
                                        Documento (DNI)
                                    </p>
                                    <p className="text-base font-bold text-slate-800 border-b border-slate-100 pb-0.5">{affiliate.dni}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Nombre del Padre</p>
                                    <p className="text-base font-bold text-slate-800 border-b border-slate-100 pb-0.5">{affiliate.nombre_padre}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Nombre de la Madre</p>
                                    <p className="text-base font-bold text-slate-800 border-b border-slate-100 pb-0.5">{affiliate.nombre_madre}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                                        <MapPin size={8} strokeWidth={3} />
                                        Domicilio y Localidad
                                    </p>
                                    <p className="text-base font-bold text-slate-800 border-b border-slate-100 pb-0.5">
                                        {affiliate.domicilio}, {affiliate.localidad}
                                    </p>
                                </div>
                            </div>

                            {/* DNI Photos */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-2">
                                    <img
                                        src={affiliate.dni_frente_url}
                                        alt="DNI Frente"
                                        className="max-h-[260px] w-auto object-contain rounded shadow-sm"
                                    />
                                </div>
                                <div className="bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-2">
                                    <img
                                        src={affiliate.dni_dorso_url}
                                        alt="DNI Dorso"
                                        className="max-h-[260px] w-auto object-contain rounded shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <style jsx global>{`
          @media print {
            /* 1. Reset everything to be hidden */
            body {
              visibility: hidden !important;
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            /* 2. Show only the printable container and its children */
            .print-container, 
            .print-container *,
            #printable-area,
            #printable-area * {
              visibility: visible !important;
              display: block !important;
              color: black !important; /* Forza texto negro total */
            }

            /* 3. Position the printable area at the top left */
            .print-container {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
              box-shadow: none !important;
            }

            #printable-area {
              width: 210mm !important;
              margin: 0 auto !important;
              padding: 5mm 15mm !important; /* Margen superior mínimo */
              border: none !important;
              min-height: auto !important;
            }

            /* 4. Hide all UI elements (buttons, toolbars, navigation) */
            header, main, footer, .print\\:hidden, button, .sticky, .fixed:not(.print-container) {
              display: none !important;
              visibility: hidden !important;
            }

            /* 5. Force Image Display */
            img {
              display: block !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              max-height: 280px !important; /* Control fino para que entren ambas */
              width: auto !important;
              margin: 0 auto !important;
            }

            @page {
              size: A4 portrait;
              margin: 0;
            }

            /* 6. Typography overrides for maximum contrast */
            h1, h2, h3, p, span, div {
              color: black !important;
              text-shadow: none !important;
            }
            
            .text-blue-600 { color: black !important; }
            .border-slate-800 { border-color: black !important; }
            .border-slate-100 { border-color: #eee !important; }
          }
        `}</style>
            </div>
        </div>
    )
}
