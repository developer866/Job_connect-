"use client"

import { useState, useEffect } from "react"
import {
  Briefcase, Users, FileText,
  Clock, CheckCircle, XCircle
} from "lucide-react"
import StatsCard from "@/app/components/dashboard/StatsCard"
import Badge from "@/app/components/ui/Badge"
import Button from "@/app/components/ui/Buttons"
import { StatsCardSkeleton, JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getAdminStats, getPendingJobs, updateJobStatus } from "@/lib/api"
import { Job } from "@/types"

interface Stats {
  totalUsers: number
  totalEmployers: number
  totalJobs: number
  pendingJobs: number
  totalApplications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getPendingJobs()
    ]).then(([statsData, jobsData]) => {
      setStats(statsData)
      setPendingJobs(jobsData.jobs || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleJobStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    setUpdating(id)
    const res = await updateJobStatus(id, status)
    if (res.job) {
      setPendingJobs((prev) => prev.filter((j) => j._id !== id))
      if (stats) {
        setStats({
          ...stats,
          pendingJobs: stats.pendingJobs - 1,
          totalJobs: status === "approved"
            ? stats.totalJobs + 1
            : stats.totalJobs,
        })
      }
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
          Dashboard
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Platform overview and pending approvals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<Users className="h-5 w-5" />}
              color="green"
              subtitle="Jobseekers"
            />
            <StatsCard
              title="Employers"
              value={stats?.totalEmployers || 0}
              icon={<Briefcase className="h-5 w-5" />}
              color="lavender"
            />
            <StatsCard
              title="Live Jobs"
              value={stats?.totalJobs || 0}
              icon={<CheckCircle className="h-5 w-5" />}
              color="lime"
            />
            <StatsCard
              title="Applications"
              value={stats?.totalApplications || 0}
              icon={<FileText className="h-5 w-5" />}
              color="green"
            />
          </>
        )}
      </div>

      {/* Pending Jobs */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-[#1a2e25]">
            Pending Approvals
          </h2>
          {!loading && pendingJobs.length > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#BCB6FF] text-xs font-bold text-[#2d2a6e]">
              {pendingJobs.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        ) : pendingJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white border border-[#e8f0eb]">
            <CheckCircle className="h-12 w-12 text-[#d4e8c2] mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#1a2e25] mb-1">
              All caught up!
            </h3>
            <p className="font-body text-sm font-light text-[#9CA3AF]">
              No pending job approvals
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingJobs.map((job) => {
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

                      {/* Job title + badge */}
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-heading text-lg font-bold text-[#1a2e25]">
                          {job.title}
                        </h3>
                        <Badge variant="gray">⏳ Pending</Badge>
                      </div>

                      {/* Company */}
                      <p className="font-body text-sm font-medium text-[#496F5D] mb-2">
                        {employer?.companyName || "Company"}
                        {employer?.industry && (
                          <span className="text-[#9CA3AF] font-light">
                            {" "}· {employer.industry}
                          </span>
                        )}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 text-xs font-light text-[#9CA3AF] mb-3">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                        <span>🎯 {job.experience}</span>
                        <span>
                          📅 Deadline:{" "}
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Description preview */}
                      <p className="font-body text-sm font-light text-[#556b5d] line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleJobStatus(job._id, "approved")}
                        loading={updating === job._id}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleJobStatus(job._id, "rejected")}
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
    </div>
  )
}