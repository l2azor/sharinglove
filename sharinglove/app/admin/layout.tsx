'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Newspaper, FileText, FolderOpen, Image as ImageIcon, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: '공지사항',
    href: '/admin/notices',
    icon: Newspaper,
  },
  {
    title: '예산/결산',
    href: '/admin/budget-settlement',
    icon: FileText,
  },
  {
    title: '자료실',
    href: '/admin/resources',
    icon: FolderOpen,
  },
  {
    title: '갤러리',
    href: '/admin/gallery',
    icon: ImageIcon,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // 로그인 페이지는 사이드바 없이 표시
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* 사이드바 */}
      <aside className="w-64 border-r border-border/40 bg-card">
        <div className="flex h-full flex-col">
          {/* 로고 */}
          <div className="border-b border-border/40 p-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">관리자</h1>
                <p className="text-xs text-muted-foreground">사랑나눔복지센터</p>
              </div>
            </Link>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* 로그아웃 */}
          <div className="border-t border-border/40 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
