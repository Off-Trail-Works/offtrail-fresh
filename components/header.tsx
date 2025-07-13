'use client'

import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback - still redirect to login
      router.push('/auth/login')
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">OT</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Off Trail Financial
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-slate-600 hover:text-slate-800 underline hover:no-underline transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}