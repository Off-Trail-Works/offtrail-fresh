'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Briefcase, 
  Settings, 
  FileText,
  PieChart,
  Building2,
  Target,
  Calendar,
  UserPlus,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/contacts', icon: Users },
  { name: 'Portfolio', href: '/portfolio', icon: TrendingUp },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
]

const secondaryNavigation = [
  { name: 'Add Client', href: '/create-advisor', icon: UserPlus },
  { name: 'Firm Settings', href: '/settings', icon: Building2 },
  { name: 'Account', href: '/protected', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-financial-gray-200 px-6 pb-4 pt-6">
        {/* Navigation Title */}
        <div className="flex h-10 shrink-0 items-center">
          <h2 className="text-sm font-semibold text-financial-gray-900">Navigation</h2>
        </div>
        
        {/* Primary Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-all duration-200 ${
                          active
                            ? 'bg-financial-blue-50 text-financial-blue-700 border-l-4 border-financial-blue-600'
                            : 'text-financial-gray-700 hover:text-financial-blue-700 hover:bg-financial-gray-50'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 ${
                            active 
                              ? 'text-financial-blue-600' 
                              : 'text-financial-gray-400 group-hover:text-financial-blue-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                        {active && (
                          <div className="ml-auto">
                            <div className="h-1.5 w-1.5 rounded-full bg-financial-blue-600"></div>
                          </div>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            
            {/* Secondary Navigation */}
            <li>
              <div className="text-xs font-medium text-financial-gray-500 uppercase tracking-wide">
                Quick Actions
              </div>
              <ul role="list" className="-mx-2 mt-3 space-y-1">
                {secondaryNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 transition-all duration-200 ${
                          active
                            ? 'bg-financial-gray-100 text-financial-gray-900'
                            : 'text-financial-gray-600 hover:text-financial-gray-900 hover:bg-financial-gray-50'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            active 
                              ? 'text-financial-gray-700' 
                              : 'text-financial-gray-400 group-hover:text-financial-gray-700'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* Performance Summary Card */}
            <li className="mt-auto">
              <div className="rounded-lg bg-gradient-to-br from-financial-blue-500 to-financial-blue-600 p-4 text-white">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5" />
                  <span className="ml-2 text-sm font-medium">Portfolio Performance</span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">+12.4%</p>
                  <p className="text-xs text-financial-blue-100">This month</p>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}