"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  MapPin, Briefcase, Clock, DollarSign,
  ArrowLeft, Building2, Calendar, CheckCircle
} from "lucide-react"
import Button from "@/app/components/ui/Buttons"
import Badge from "@/app/components/ui/Badge"
import Modal from "@/app/components/ui/Modal"
import { Skeleton } from "@/app/components/ui/Skeleton"
import { getSingleJob, applyForJob } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Job } from "@/types"

export default function JobDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { user, isJobseeker } = useAuth()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState("")
  const [coverLetter, setCoverLetter] = useState("")

  useEffect(() => {
    getSingleJob(id)
      .then((data) => setJob(data))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!isJobseeker) {
      setError("Only jobseekers can apply for jobs")
      return
    }
    setShowApplyModal(true)
  }

  const submitApplication = async () => {
    if (!coverLetter.trim()) {
      setError("Cover letter is required")
      return
    }
    if (coverLetter.length < 100) {
      setError("Cover letter must be at least 100 characters")
      return
    }

    setApplying(true)
    setError("")

    try {
      const res = await applyForJob(id, { coverLetter })
      if (res.application) {
        setApplied(true)
        setShowApplyModal(false)
      } else {
        setError(res.message || "Application failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    const fmt = (n: number) =>
      currency === "NGN" ? `₦${(n / 1000).toFixed(0)}k` : `$${n.toLocaleString()}`
    return `${fmt(min)} – ${fmt(max)} / month`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1FEC6] px-6 py-10">
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F1FEC6] flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-12 w-12 text-[#d4e8c2] mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
            Job not found
          </h2>
          <Button onClick={() => router.push("/jobs")}>
            Browse Jobs
          </Button>
        </div>
      </div>
    )
  }

  const employer = typeof job.employer === "object" ? job.employer : null
  const isClosed = job.status === "closed"
  const isDeadlinePassed = new Date(job.deadline) < new Date()

  return (
    <>
      <div className="min-h-screen bg-[#F1FEC6]">

        {/* ── Header ── */}
        <div className="bg-[#496F5D] px-6 py-10">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-sm font-light text-[#F1FEC6]/70 hover:text-[#F1FEC6] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to jobs
            </button>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-heading text-4xl font-extrabold text-[#F1FEC6] mb-3">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-[#F1FEC6]/70" />
                  <span className="font-body text-base font-medium text-[#F1FEC6]/90">
                    {employer?.companyName || "Company"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm font-light text-[#F1FEC6]/70">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" /> {job.type}
                  </span>
                  {job.salary?.min && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Apply button */}
              <div className="shrink-0">
                {applied ? (
                  <div className="flex items-center gap-2 rounded-xl bg-[#F1FEC6] px-5 py-3">
                    <CheckCircle className="h-5 w-5 text-[#496F5D]" />
                    <span className="font-body text-sm font-medium text-[#496F5D]">
                      Applied!
                    </span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleApply}
                    disabled={isClosed || isDeadlinePassed}
                  >
                    {isClosed
                      ? "Job Closed"
                      : isDeadlinePassed
                      ? "Deadline Passed"
                      : "Apply Now →"
                    }
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-6 py-10">
          <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Description */}
              <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
                <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-4">
                  Job Description
                </h2>
                <p className="font-body text-sm font-light text-[#556b5d] leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
                  <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-[#496F5D] mt-0.5 shrink-0" />
                        <span className="font-body text-sm font-light text-[#556b5d]">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
                  <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-4">
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="green">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Job overview */}
              <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
                <h3 className="font-heading text-lg font-bold text-[#1a2e25] mb-4">
                  Job Overview
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: <Briefcase className="h-4 w-4" />, label: "Type", value: job.type },
                    { icon: <MapPin className="h-4 w-4" />, label: "Location", value: job.location },
                    { icon: <Clock className="h-4 w-4" />, label: "Experience", value: job.experience },
                    { icon: <Calendar className="h-4 w-4" />, label: "Deadline", value: new Date(job.deadline).toLocaleDateString() },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1FEC6] text-[#496F5D]">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-body text-xs font-light text-[#9CA3AF]">
                          {item.label}
                        </p>
                        <p className="font-body text-sm font-medium text-[#1a2e25] capitalize">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company info */}
              {employer && (
                <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
                  <h3 className="font-heading text-lg font-bold text-[#1a2e25] mb-4">
                    About the Company
                  </h3>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#496F5D] font-heading font-bold text-[#F1FEC6] text-lg">
                      {employer.companyName?.[0] || "C"}
                    </div>
                    <div>
                      <p className="font-heading text-sm font-bold text-[#1a2e25]">
                        {employer.companyName}
                      </p>
                      <p className="font-body text-xs font-light text-[#9CA3AF]">
                        {employer.industry}
                      </p>
                    </div>
                  </div>
                  {employer.companyDescription && (
                    <p className="font-body text-xs font-light text-[#556b5d] leading-relaxed mb-3">
                      {employer.companyDescription}
                    </p>
                  )}
                  {employer.companyWebsite && (
                    <a
                      href={employer.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#496F5D] hover:underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              )}

              {/* Apply CTA */}
              {!applied && !isClosed && !isDeadlinePassed && (
                <Button fullWidth size="lg" onClick={handleApply}>
                  Apply for this Job →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Apply Modal ── */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for this Job"
        size="lg"
      >
        <div className="space-y-4">
          <p className="font-body text-sm font-light text-[#556b5d]">
            Applying for <strong className="font-medium text-[#1a2e25]">{job?.title}</strong> at{" "}
            <strong className="font-medium text-[#496F5D]">{employer?.companyName}</strong>
          </p>

          <div>
            <label className="block text-sm font-medium text-[#1a2e25] mb-1.5">
              Cover Letter *
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => {
                setCoverLetter(e.target.value)
                setError("")
              }}
              placeholder="Tell the employer why you're a great fit for this role. Mention relevant skills, projects, and your motivation..."
              rows={6}
              className="w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 text-sm font-light text-[#1a2e25] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] resize-none transition"
            />
            <p className="mt-1 text-xs font-light text-[#9CA3AF]">
              {coverLetter.length}/1000 characters (min 100)
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowApplyModal(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              loading={applying}
              onClick={submitApplication}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}