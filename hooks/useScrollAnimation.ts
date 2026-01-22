'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', triggerOnce = true } = options
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}

// 스크롤 진행률 훅
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      setProgress(scrollHeight > 0 ? scrolled / scrollHeight : 0)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progress
}

// 다중 요소 스크롤 애니메이션 훅
export function useStaggerAnimation(
  itemCount: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options
  const { ref, isVisible } = useScrollAnimation(scrollOptions)

  const getDelayStyle = useCallback(
    (index: number) => ({
      animationDelay: `${index * staggerDelay}ms`,
    }),
    [staggerDelay]
  )

  return { ref, isVisible, getDelayStyle }
}
