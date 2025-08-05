"use client"

import { useState, useRef, useEffect } from "react"

interface TooltipProps {
  children: React.ReactNode
  content: string
  placement?: "top" | "bottom" | "left" | "right"
}

export default function Tooltip({ children, content, placement = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let x = 0
      let y = 0
      
      switch (placement) {
        case "top":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.top - tooltipRect.height - 8
          break
        case "bottom":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.bottom + 8
          break
        case "left":
          x = triggerRect.left - tooltipRect.width - 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
        case "right":
          x = triggerRect.right + 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
      }
      
      setPosition({ x, y })
    }
  }, [isVisible, placement])

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {content}
          <div 
            className="absolute w-0 h-0 border-4 border-transparent"
            style={{
              [placement === 'top' ? 'top' : placement === 'bottom' ? 'bottom' : placement === 'left' ? 'left' : 'right']: '100%',
              [placement === 'top' || placement === 'bottom' ? 'left' : 'top']: '50%',
              transform: placement === 'top' || placement === 'bottom' 
                ? 'translateX(-50%)' 
                : 'translateY(-50%)',
              [`border-${placement === 'top' ? 't' : placement === 'bottom' ? 'b' : placement === 'left' ? 'l' : 'r'}-gray-900`]: true
            }}
          />
        </div>
      )}
    </>
  )
} 