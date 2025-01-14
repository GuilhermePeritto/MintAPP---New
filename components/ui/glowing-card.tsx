import React from 'react'
import { Card, CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlowingCardProps extends CardProps {
  glowColor?: string
}

export const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className, 
  glowColor = "rgba(0, 128, 255, 0.5)", 
  ...props 
}) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:z-0 before:opacity-0 before:transition-opacity hover:before:opacity-100",
        "before:bg-[radial-gradient(circle_at_center,_var(--glow-color)_0,_transparent_70%)]",
        className
      )}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  )
}

