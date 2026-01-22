'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
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
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/images/logo.png"
              alt="사랑나눔복지센터"
              width={220}
              height={110}
              className="object-contain"
              priority
            />
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
