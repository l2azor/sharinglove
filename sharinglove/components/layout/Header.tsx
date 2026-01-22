'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'
import Navigation from './Navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Heart className="h-6 w-6 fill-white text-white" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none text-foreground">
                사랑나눔복지센터
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                함께 걸어가는 동반자
              </p>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden rounded-xl p-2.5 text-foreground hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 토글"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* 모바일 네비게이션 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 pb-6 pt-4 animate-in slide-in-from-top-2 duration-300">
            <Navigation mobile onNavigate={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
}
