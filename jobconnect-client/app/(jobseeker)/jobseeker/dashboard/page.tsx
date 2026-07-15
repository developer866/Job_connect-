"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Briefcase, FileText, CheckCircle,
  Clock, ArrowRight, Bell
} from "lucide-react"
import StatsCard from "@/app/components/dashboard/StatsCard"
import ApplicationCard from "@/app/components/applications/ApplicationCard"
import { StatsCardSkeleton, JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getMyApplications, getAllJobs } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Application, Job } from "@/types"

export default function JobseekerDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getMyApplications(),
      getAllJobs()
    ]).then(([appData, jobData]) => {
      setApplications(appData.applications || [])
      setRecentJobs(jobData.jobs?.slice(0, 3) || [])
    }).finally(() => setLoading(false))
  }, [])

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  }

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
          Welcome back
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
          {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Applied"
              value={stats.total}
              icon={<FileText className="h-5 w-5" />}
              color="green"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={<Clock className="h-5 w-5" />}
              color="lime"
            />
            <StatsCard
              title="Reviewing"
              value={stats.reviewing}
              icon={<Bell className="h-5 w-5" />}
              color="lavender"
            />
            <StatsCard
              title="Accepted"
              value={stats.accepted}
              icon={<CheckCircle className="h-5 w-5" />}
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
              href="/jobseeker/applications"
              className="flex items-center gap-1 font-body text-sm font-light text-[#496F5D] hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
            ) : applications.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#e8f0eb] p-8 text-center">
                <FileText className="h-10 w-10 text-[#d4e8c2] mx-auto mb-3" />
                <p className="font-heading text-sm font-bold text-[#1a2e25] mb-1">
                  No applications yet
                </p>
                <p className="font-body text-xs font-light text-[#9CA3AF] mb-4">
                  Start applying to jobs to track them here
                </p>
                <Link href="/jobs">
                  <button className="rounded-xl bg-[#496F5D] px-5 py-2 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors">
                    Browse Jobs
                  </button>
                </Link>
              </div>
            ) : (
              applications.slice(0, 3).map((app) => (
                <ApplicationCard
                  key={app._id}
                  application={app}
                  role="jobseeker"
                />
              ))
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-[#1a2e25]">
              New Opportunities
            </h2>
            <Link
              href="/jobs"
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
                <p className="font-body text-sm font-light text-[#9CA3AF]">
                  No jobs available yet
                </p>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl bg-white border border-[#e8f0eb] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  onClick={() => window.location.href = `/jobs/${job._id}`}
                >
                  <h3 className="font-heading text-base font-bold text-[#1a2e25] mb-1">
                    {job.title}
                  </h3>
                  {/* <p className="font-body text-sm font-medium text-[#496F5D] mb-2">
                    {typeof job.employer === "object" ? job.employer.companyName : "Company"}
                  </p> */}
                  <div className="flex flex-wrap gap-2 text-xs font-light text-[#9CA3AF]">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile completion prompt */}
      {!user?.cv && (
        <div className="mt-8 rounded-2xl bg-[#BCB6FF]/20 border border-[#BCB6FF]/30 p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#1a2e25] mb-1">
              Complete your profile
            </h3>
            <p className="font-body text-sm font-light text-[#556b5d]">
              Upload your CV and add your skills to stand out to employers
            </p>
          </div>
          <Link href="/jobseeker/profile">
            <button className="rounded-xl bg-[#496F5D] px-5 py-2.5 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors whitespace-nowrap">
              Complete Profile →
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}