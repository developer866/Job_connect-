"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Briefcase, Plus, Eye, Trash2 } from "lucide-react"
import Badge from "@/app/components/ui/Badge"
import Button from "@/app/components/ui/Buttons"
import { JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getMyJobs, deleteJob } from "@/lib/api"
import { Job } from "@/types"

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    getMyJobs()
      .then((data) => setJobs(data.jobs || []))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    setDeleting(id)
    await deleteJob(id)
    setJobs((prev) => prev.filter((j) => j._id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
            Employer
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
            My Jobs
          </h1>
          <p className="font-body text-sm font-light text-[#556b5d] mt-1">
            Manage all your job postings
          </p>
        </div>
        <Link href="/employer/post-job">
          <Button>
            <Plus className="h-4 w-4" /> Post a Job
          </Button>
        </Link>
      </div>

      {/* Jobs list */}
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
            No jobs posted yet
          </h3>
          <p className="font-body text-sm font-light text-[#9CA3AF] mb-6">
            Post your first job to start receiving applications
          </p>
          <Link href="/employer/post-job">
            <Button>Post a Job →</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
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
                    <Badge
                      variant={
                        job.status === "approved" ? "green"
                        : job.status === "pending" ? "gray"
                        : job.status === "rejected" ? "red"
                        : "lavender"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs font-light text-[#9CA3AF] mb-3">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                    <span>🎯 {job.experience}</span>
                    <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  {/* <p className="font-body text-sm font-light text-[#556b5d]">
                    {job.applications?.length || 0} application(s) received
                  </p> */}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/jobs/${job._id}`}>
                    <button className="flex items-center gap-1.5 rounded-xl border border-[#496F5D]/30 px-3 py-2 text-xs font-light text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deleting === job._id}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-xs font-light text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleting === job._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}