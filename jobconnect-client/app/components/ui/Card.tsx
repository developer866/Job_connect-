import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl bg-white border border-[#e8f0eb] p-6
        ${hover ? "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  )
}