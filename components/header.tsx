'use client'

import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
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
          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-800 underline hover:no-underline transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-slate-600 hover:text-slate-800 underline hover:no-underline transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}