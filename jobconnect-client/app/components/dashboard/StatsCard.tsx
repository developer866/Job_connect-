import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: "green" | "lavender" | "lime"
  subtitle?: string
}

export default function StatsCard({
  title,
  value,
  icon,
  color = "green",
  subtitle,
}: StatsCardProps) {

  const colors = {
    green: "bg-[#496F5D] text-[#F1FEC6]",
    lavender: "bg-[#BCB6FF] text-[#2d2a6e]",
    lime: "bg-[#F1FEC6] text-[#2d4a20] border border-[#d4e8c2]",
  }

  const iconColors = {
    green: "bg-white/20 text-[#F1FEC6]",
    lavender: "bg-white/30 text-[#2d2a6e]",
    lime: "bg-[#496F5D]/10 text-[#496F5D]",
  }

  return (
    <div className={`rounded-2xl p-6 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <p className="font-body text-sm font-light opacity-80">{title}</p>
        <div className={`rounded-xl p-2 ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="font-heading text-4xl font-extrabold">{value}</p>
      {subtitle && (
        <p className="mt-1 font-body text-xs font-light opacity-70">{subtitle}</p>
      )}
    </div>
  )
}