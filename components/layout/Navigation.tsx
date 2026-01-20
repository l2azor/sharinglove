'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    title: '사랑나눔복지센터',
    items: [
      { title: '소개', href: '/center/intro' },
      { title: '오시는길', href: '/center/location' },
    ],
  },
  {
    title: '사업소개',
    items: [
      { title: '장애인활동지원', href: '/business/activity-support' },
      { title: '인사말', href: '/business/greeting' },
      { title: '연혁', href: '/business/history' },
      { title: '조직도', href: '/business/org-chart' },
    ],
  },
  {
    title: '공지·소식',
    items: [
      { title: '공지사항', href: '/news/notices' },
      { title: '예산 및 결산서', href: '/news/budget-settlement' },
      { title: '자료실', href: '/news/resources' },
      { title: '갤러리', href: '/news/gallery' },
    ],
  },
]

interface NavigationProps {
  mobile?: boolean
  onNavigate?: () => void
}

export default function Navigation({ mobile, onNavigate }: NavigationProps) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  if (mobile) {
    return (
      <nav className="space-y-3">
        {menuItems.map((menu) => (
          <div key={menu.title} className="rounded-xl bg-secondary/50 p-4">
            <h3 className="font-bold text-sm text-foreground/70 mb-3 px-2">
              {menu.title}
            </h3>
            <ul className="space-y-1">
              {menu.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground/80 hover:bg-white hover:text-foreground hover:shadow-sm'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-2">
      {menuItems.map((menu) => (
        <div key={menu.title} className="relative group">
          <button
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
              'hover:bg-secondary hover:text-primary',
              menu.items.some(item => pathname === item.href) && 'text-primary'
            )}
            onMouseEnter={() => setOpenMenu(menu.title)}
          >
            {menu.title}
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </button>

          {/* 드롭다운 메뉴 */}
          <div
            className={cn(
              'absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2'
            )}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className="min-w-[220px] rounded-2xl border border-border/50 bg-card p-2 shadow-xl backdrop-blur-sm">
              {menu.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </nav>
  )
}
