import { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?: "green" | "lavender" | "lime" | "red" | "gray"
  className?: string
}

export default function Badge({
  children,
  variant = "green",
  className = "",
}: BadgeProps) {

  const variants = {
    green: "bg-[#e8f5ee] text-[#1a4a2e]",
    lavender: "bg-[#eeecff] text-[#2d2a6e]",
    lime: "bg-[#F1FEC6] text-[#2d4a20]",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  }

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-lg px-2.5 py-1
      text-xs font-medium font-body
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}