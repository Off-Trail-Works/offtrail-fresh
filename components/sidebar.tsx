'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-white/95 backdrop-blur-sm shadow-sm border-r border-slate-200/50">
      <div className="p-4">
        <nav className="space-y-2">
          <Link
            href="/"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/') 
                ? 'text-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 border-l-4 border-slate-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>
            <span className={`${isActive('/') ? 'font-semibold' : 'font-medium'}`}>Dashboard</span>
          </Link>
          <Link
            href="/contacts"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/contacts') 
                ? 'text-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 border-l-4 border-slate-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 414 0zM7 10a2 2 0 11-4 0 2 2 0 414 0z"
              />
            </svg>
            <span className={`${isActive('/contacts') ? 'font-semibold' : 'font-medium'}`}>Contacts</span>
          </Link>
          <Link
            href="/create-advisor"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/create-advisor') 
                ? 'text-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 border-l-4 border-slate-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className={`${isActive('/create-advisor') ? 'font-semibold' : 'font-medium'}`}>Create Advisor</span>
          </Link>
          <Link
            href="/auth/login"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/auth/login') 
                ? 'text-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 border-l-4 border-slate-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span className={`${isActive('/auth/login') ? 'font-semibold' : 'font-medium'}`}>Login</span>
          </Link>
          <Link
            href="/protected"
            className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive('/protected') 
                ? 'text-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 border-l-4 border-slate-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 818 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className={`${isActive('/protected') ? 'font-semibold' : 'font-medium'}`}>Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}