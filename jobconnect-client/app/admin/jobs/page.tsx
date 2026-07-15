"use client"

import { useState, useEffect } from "react"
import { Briefcase, CheckCircle, XCircle } from "lucide-react"
import Badge from "@/app/components/ui/Badge"
import Button from "@/app/components/ui/Buttons"
import { JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getPendingJobs, updateJobStatus } from "@/lib/api"
import { Job } from "@/types"

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    getPendingJobs()
      .then((data) => setJobs(data.jobs || []))
      .finally(() => setLoading(false))
  }, [])

  const handleStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    setUpdating(id)
    const res = await updateJobStatus(id, status)
    if (res.job) {
      setJobs((prev) => prev.filter((j) => j._id !== id))
    }
    setUpdating(null)
  }

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
          Admin
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
          Pending Jobs
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Review and approve or reject job postings
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#496F5D]/10">
            <Briefcase className="h-8 w-8 text-[#496F5D]" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
            No pending jobs
          </h3>
          <p className="font-body text-sm font-light text-[#9CA3AF]">
            All job postings have been reviewed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const employer = typeof job.employer === "object"
              ? job.employer
              : null

            return (
              <div
                key={job._id}
                className="rounded-2xl bg-white border border-[#e8f0eb] p-6"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-heading text-lg font-bold text-[#1a2e25]">
                        {job.title}
                      </h3>
                      <Badge variant="gray">⏳ Pending</Badge>
                    </div>
                    <p className="font-body text-sm font-medium text-[#496F5D] mb-2">
                      {employer?.companyName || "Company"}
                      {employer?.industry && (
                        <span className="text-[#9CA3AF] font-light">
                          {" "}· {employer.industry}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs font-light text-[#9CA3AF] mb-3">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type}</span>
                      <span>🎯 {job.experience}</span>
                    </div>
                    <p className="font-body text-sm font-light text-[#556b5d] line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="green">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleStatus(job._id, "approved")}
                      loading={updating === job._id}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatus(job._id, "rejected")}
                      disabled={updating === job._id}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}