"use client"

import { ReactNode, useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${sizes[size]} rounded-2xl bg-[#F1FEC6] p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[#1a2e25]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {children}
      </div>
    </div>
  )
}