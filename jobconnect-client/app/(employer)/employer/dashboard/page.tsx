"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Briefcase, Users, Clock,
  CheckCircle, ArrowRight, Plus, Eye
} from "lucide-react"
import StatsCard from "@/app/components/dashboard/StatsCard"
import ApplicationCard from "@/app/components/applications/ApplicationCard"
import { StatsCardSkeleton, JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getMyJobs, getApplications, updateApplicationStatus } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Application, Job } from "@/types"
import Badge from "@/app/components/ui/Badge"

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getMyJobs(),
      getApplications()
    ]).then(([jobData, appData]) => {
      setJobs(jobData.jobs || [])
      setApplications(appData.applications || [])
    }).finally(() => setLoading(false))
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

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "approved").length,
    totalApplications: applications.length,
    pendingReview: applications.filter((a) => a.status === "pending").length,
  }

  const recentApplications = applications.slice(0, 5)
  const recentJobs = jobs.slice(0, 3)

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
            {user?.companyName || user?.name} 👋
          </h1>
          <p className="font-body text-sm font-light text-[#556b5d] mt-1">
            Heres an overview of your hiring activity
          </p>
        </div>
        <Link href="/employer/post-job">
          <button className="flex items-center gap-2 rounded-xl bg-[#496F5D] px-5 py-2.5 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors">
            <Plus className="h-4 w-4" />
            Post a Job
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Jobs"
              value={stats.totalJobs}
              icon={<Briefcase className="h-5 w-5" />}
              color="green"
            />
            <StatsCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={<CheckCircle className="h-5 w-5" />}
              color="lime"
            />
            <StatsCard
              title="Applications"
              value={stats.totalApplications}
              icon={<Users className="h-5 w-5" />}
              color="lavender"
            />
            <StatsCard
              title="Pending Review"
              value={stats.pendingReview}
              icon={<Clock className="h-5 w-5" />}
              color="green"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent Applications */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[#1a2e25]">
              Recent Applications
            </h2>
            <Link
              href="/employer/applications"
              className="flex items-center gap-1 font-body text-sm font-light text-[#496F5D] hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
            ) : recentApplications.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#e8f0eb] p-8 text-center">
                <Users className="h-10 w-10 text-[#d4e8c2] mx-auto mb-3" />
                <p className="font-heading text-sm font-bold text-[#1a2e25] mb-1">
                  No applications yet
                </p>
                <p className="font-body text-xs font-light text-[#9CA3AF] mb-4">
                  Applications will appear here once candidates apply
                </p>
                <Link href="/employer/post-job">
                  <button className="rounded-xl bg-[#496F5D] px-5 py-2 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors">
                    Post a Job
                  </button>
                </Link>
              </div>
            ) : (
              recentApplications.map((app) => (
                <ApplicationCard
                  key={app._id}
                  application={app}
                  role="employer"
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            )}
          </div>
        </div>

        {/* My Jobs */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[#1a2e25]">
              My Jobs
            </h2>
            <Link
              href="/employer/jobs"
              className="flex items-center gap-1 font-body text-sm font-light text-[#496F5D] hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
            ) : recentJobs.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#e8f0eb] p-8 text-center">
                <Briefcase className="h-10 w-10 text-[#d4e8c2] mx-auto mb-3" />
                <p className="font-heading text-sm font-bold text-[#1a2e25] mb-1">
                  No jobs posted yet
                </p>
                <p className="font-body text-xs font-light text-[#9CA3AF] mb-4">
                  Post your first job to start receiving applications
                </p>
                <Link href="/employer/post-job">
                  <button className="rounded-xl bg-[#496F5D] px-5 py-2 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors">
                    Post a Job
                  </button>
                </Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl bg-white border border-[#e8f0eb] p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#1a2e25] mb-1">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs font-light text-[#9CA3AF]">
                        <span>📍 {job.location}</span>
                        <span>💼 {job.type}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        job.status === "approved"
                          ? "green"
                          : job.status === "pending"
                          ? "gray"
                          : job.status === "rejected"
                          ? "red"
                          : "lavender"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    {/* <span className="font-body text-xs font-light text-[#9CA3AF]">
                      {job.applications?.length || 0} application(s)
                    </span> */}
                    <Link href={`/employer/jobs/${job._id}`}>
                      <button className="flex items-center gap-1.5 rounded-lg border border-[#496F5D]/30 px-3 py-1.5 text-xs font-light text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pending approval notice */}
      {jobs.some((j) => j.status === "pending") && (
        <div className="mt-8 rounded-2xl bg-[#F1FEC6] border border-[#d4e8c2] p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-heading text-base font-bold text-[#1a2e25] mb-1">
              Jobs Pending Approval
            </h3>
            <p className="font-body text-sm font-light text-[#556b5d]">
              You have {jobs.filter((j) => j.status === "pending").length} job(s) waiting for admin review. This usually takes less than 24 hours.
            </p>
          </div>
          <Link href="/employer/jobs">
            <button className="rounded-xl bg-[#496F5D] px-5 py-2.5 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors whitespace-nowrap">
              View Jobs →
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}