'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'
import { ReactNode, CSSProperties } from 'react'

type AnimationType =
  | 'fadeInUp'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'slideUpBounce'
  | 'fadeInScaleUp'
  | 'textMaskReveal'
  | 'textBlurReveal'

interface AnimateOnScrollProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  threshold?: number
}

const animationClasses: Record<AnimationType, string> = {
  fadeInUp: 'animate-fadeInUp',
  fadeInLeft: 'animate-slideInLeft',
  fadeInRight: 'animate-slideInRight',
  scaleIn: 'animate-scaleIn',
  slideUpBounce: 'animate-slideUpBounce',
  fadeInScaleUp: 'animate-fadeInScaleUp',
  textMaskReveal: 'animate-textMaskReveal',
  textBlurReveal: 'animate-textBlurReveal',
}

export function AnimateOnScroll({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration,
  className,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold })

  const style: CSSProperties = {
    animationDelay: delay ? `${delay}ms` : undefined,
    animationDuration: duration ? `${duration}ms` : undefined,
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'opacity-0',
        isVisible && animationClasses[animation],
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}

// Stagger 애니메이션 컨테이너
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  animation?: AnimationType
  threshold?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  animation = 'fadeInUp',
  threshold = 0.1,
}: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold })

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={cn('opacity-0', isVisible && animationClasses[animation])}
              style={{ animationDelay: `${index * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
