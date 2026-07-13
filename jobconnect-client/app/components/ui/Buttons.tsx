import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  className?: string
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {

  const base = "inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-[#496F5D] text-[#F1FEC6] hover:bg-[#1a2e25]",
    secondary: "bg-[#BCB6FF] text-[#2d2a6e] hover:bg-[#a8a0ff]",
    outline: "border border-[#496F5D] text-[#496F5D] hover:bg-[#496F5D]/10",
    ghost: "text-[#496F5D] hover:bg-[#496F5D]/10",
    danger: "bg-red-500 text-white hover:bg-red-600",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}