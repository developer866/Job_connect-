"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import ApplicationCard from "@/app/components/applications/ApplicationCard"
import { JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getApplications, updateApplicationStatus } from "@/lib/api"
import { Application } from "@/types"

type StatusFilter = "all" | "pending" | "reviewing" | "accepted" | "rejected"

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all")

  useEffect(() => {
    getApplications()
      .then((data) => setApplications(data.applications || []))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateApplicationStatus(
      id,
      status as "pending" | "reviewing" | "accepted" | "rejected"
    )
    setApplications((prev) =>
      prev.map((a) =>
        a._id === id
          ? { ...a, status: status as Application["status"] }
          : a
      )
    )
  }

  const filtered = activeFilter === "all"
    ? applications
    : applications.filter((a) => a.status === activeFilter)

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Reviewing", value: "reviewing" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ]

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
          Employer
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
          Applications
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Review and manage all candidate applications
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`
              flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-light transition-all
              ${activeFilter === filter.value
                ? "bg-[#496F5D] text-[#F1FEC6]"
                : "bg-white border border-[#e8f0eb] text-[#556b5d] hover:border-[#496F5D]"
              }
            `}
          >
            {filter.label}
            <span className={`
              rounded-full px-1.5 py-0.5 text-xs font-medium
              ${activeFilter === filter.value
                ? "bg-white/20 text-[#F1FEC6]"
                : "bg-[#F1FEC6] text-[#2d4a20]"
              }
            `}>
              {counts[filter.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Applications */}
      {loading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#496F5D]/10">
            <Users className="h-8 w-8 text-[#496F5D]" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
            No applications found
          </h3>
          <p className="font-body text-sm font-light text-[#9CA3AF]">
            {activeFilter === "all"
              ? "No one has applied to your jobs yet"
              : `No ${activeFilter} applications`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              role="employer"
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}