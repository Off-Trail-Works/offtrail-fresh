'use client'

import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, User, LogOut, Menu } from 'lucide-react'

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
    <header className="bg-white/95 backdrop-blur-sm border-b border-financial-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2 rounded-lg hover:bg-financial-gray-100 transition-colors">
              <Menu className="h-5 w-5 text-financial-gray-600" />
            </button>
            <Link href="/contacts" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-financial-blue-600 to-financial-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">OT</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-financial-gray-900">
                  OffTrail
                </h1>
                <p className="text-xs text-financial-gray-500 -mt-1">
                  Wealth Management
                </p>
              </div>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-financial-gray-300 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-financial-gray-300 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-financial-gray-100 transition-colors relative">
                  <Bell className="h-5 w-5 text-financial-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-financial-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-lg hover:bg-financial-gray-100 transition-colors">
                  <Settings className="h-5 w-5 text-financial-gray-600" />
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-financial-gray-200">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-financial-gray-900">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-financial-gray-500">
                      Financial Advisor
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-financial-blue-500 to-financial-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-lg hover:bg-financial-red-50 hover:text-financial-red-600 transition-colors group"
                      title="Sign out"
                    >
                      <LogOut className="h-4 w-4 text-financial-gray-600 group-hover:text-financial-red-600" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-financial-gray-700 hover:text-financial-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-financial-blue-600 hover:bg-financial-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}