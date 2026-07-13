"use client"

import { useRouter } from "next/navigation"
import { Calendar, Building2 } from "lucide-react"
import Badge from "../ui/Badge"
import Button from "../ui/Buttons"
import { Application } from "@/types"

interface ApplicationCardProps {
  application: Application
  role?: "jobseeker" | "employer"
  onStatusUpdate?: (id: string, status: string) => void
}

export default function ApplicationCard({
  application,
  role = "jobseeker",
  onStatusUpdate,
}: ApplicationCardProps) {
  const router = useRouter()

  const statusVariant = {
    pending: "gray" as const,
    reviewing: "lavender" as const,
    accepted: "green" as const,
    rejected: "red" as const,
  }

  const statusLabel = {
    pending: "⏳ Pending",
    reviewing: "👀 Reviewing",
    accepted: "✅ Accepted",
    rejected: "❌ Rejected",
  }

  return (
    <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">

          {/* Job title */}
          <h3
            className="font-heading text-lg font-bold text-[#1a2e25] cursor-pointer hover:text-[#496F5D] transition-colors"
            onClick={() => router.push(`/jobs/${application.job?._id}`)}
          >
            {application.job?.title || "Job Title"}
          </h3>

          {/* Company */}
          <div className="flex items-center gap-1.5 mt-1 mb-3">
            <Building2 className="h-3.5 w-3.5 text-[#496F5D]" />
            <p className="font-body text-sm font-medium text-[#496F5D]">
              {application.job?.employer
                ? typeof application.job.employer === "object"
                  ? application.job.employer.companyName
                  : "Company"
                : "Company"
              }
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs font-light text-[#9CA3AF]">
            <Calendar className="h-3.5 w-3.5" />
            Applied {new Date(application.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={statusVariant[application.status]}>
          {statusLabel[application.status]}
        </Badge>
      </div>

      {/* Employer actions */}
      {role === "employer" && application.status === "pending" && (
        <div className="mt-4 flex gap-3 border-t border-[#e8f0eb] pt-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onStatusUpdate?.(application._id, "reviewing")}
          >
            Mark Reviewing
          </Button>
          <Button
            size="sm"
            onClick={() => onStatusUpdate?.(application._id, "accepted")}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onStatusUpdate?.(application._id, "rejected")}
          >
            Reject
          </Button>
        </div>
      )}

      {role === "employer" && application.status === "reviewing" && (
        <div className="mt-4 flex gap-3 border-t border-[#e8f0eb] pt-4">
          <Button
            size="sm"
            onClick={() => onStatusUpdate?.(application._id, "accepted")}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onStatusUpdate?.(application._id, "rejected")}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}