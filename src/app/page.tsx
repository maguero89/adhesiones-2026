'use client'

import React, { useState } from 'react'
import AuthWrapper from '@/components/AuthWrapper'
import AffiliationForm from '@/components/AffiliationForm'
import AffiliatesTable from '@/components/AffiliatesTable'
import PrintView from '@/components/PrintView'
import { UserPlus, List, LogOut, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'register' | 'list'>('register')
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-black text-slate-900 tracking-tight leading-none text-lg">Adhesiones 2026</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Gestor de Afiliaciones Políticas</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
                activeTab === 'register' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <UserPlus size={18} />
              Cargar Nueva
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
                activeTab === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <List size={18} />
              Ver Padron
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Cerrar Sesión"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full print:hidden">
          <div className="animate-in fade-in duration-500">
            {activeTab === 'register' ? (
              <AffiliationForm />
            ) : (
              <AffiliatesTable onSelect={setSelectedAffiliate} />
            )}
          </div>
        </main>

        {/* Print Modal */}
        {selectedAffiliate && (
          <PrintView
            affiliate={selectedAffiliate}
            onClose={() => setSelectedAffiliate(null)}
          />
        )}

        {/* Footer */}
        <footer className="p-8 text-center text-slate-400 text-xs font-medium bg-white/50 border-t border-slate-200 mt-auto print:hidden">
          <p>© 2026 Sistema de Gestión de Adhesiones Políticas. Todos los derechos reservados.</p>
        </footer>
      </div>
    </AuthWrapper>
  )
}
