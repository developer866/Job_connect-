"use client"

import { useRouter } from "next/navigation"
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react"
import Badge from "../ui/Badge"
import Button from "../ui/Buttons"
import { Job } from "@/types"

interface JobCardProps {
  job: Job
  showApply?: boolean
}

export default function JobCard({ job, showApply = true }: JobCardProps) {
  const router = useRouter()

  const formatSalary = (min: number, max: number, currency: string) => {
    const format = (n: number) =>
      currency === "NGN"
        ? `₦${(n / 1000).toFixed(0)}k`
        : `$${n.toLocaleString()}`
    return `${format(min)} – ${format(max)}`
  }

  const experienceColor = {
    entry: "green" as const,
    junior: "lavender" as const,
    mid: "lime" as const,
  }

  const typeColor = {
    "full-time": "green" as const,
    "part-time": "lavender" as const,
    "contract": "lime" as const,
    "internship": "gray" as const,
  }

  const isNew = () => {
    const created = new Date(job.createdAt)
    const now = new Date()
    const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 3
  }

  return (
    <div className="group rounded-2xl bg-white border border-[#e8f0eb] p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">

          {/* Title + New badge */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3
              className="font-heading text-lg font-bold text-[#1a2e25] cursor-pointer hover:text-[#496F5D] transition-colors truncate"
              onClick={() => router.push(`/jobs/${job._id}`)}
            >
              {job.title}
            </h3>
            {isNew() && (
              <Badge variant="lime">✨ New</Badge>
            )}
          </div>

          {/* Company */}
          <p className="font-body text-sm font-medium text-[#496F5D] mb-3">
            {typeof job.employer === "object"
              ? job.employer.companyName
              : "Company"}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-xs font-light text-[#9CA3AF] mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> {job.type}
            </span>
            {job.salary?.min && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={experienceColor[job.experience]}>
              {job.experience}
            </Badge>
            <Badge variant={typeColor[job.type]}>
              {job.type}
            </Badge>
            {job.skills?.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="gray">{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Apply button */}
        {showApply && (
          <div className="shrink-0">
            <Button
              size="sm"
              onClick={() => router.push(`/jobs/${job._id}`)}
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}