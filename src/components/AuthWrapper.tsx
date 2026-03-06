'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LogIn, Mail, Lock, Loader2, UserCheck, Eye, EyeOff } from 'lucide-react'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [authError, setAuthError] = useState('')

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setAuthError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setAuthError('Email o contraseña incorrectos.')
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                    <div className="p-10">
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <UserCheck size={32} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-center text-slate-900 mb-2 leading-tight">Acceso Restringido</h1>
                        <p className="text-center text-slate-600 mb-10 font-medium italic">Gestión de Afiliaciones 2026</p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-600">Email Corporativo</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="usuario@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-600">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {authError && (
                                <p className="text-sm text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
                                    {authError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Ingresar al Sistema
                                <LogIn size={20} />
                            </button>
                        </form>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-bold">PROPIEDAD DEL EQUIPO DE CAMPAÑA 2026</p>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
