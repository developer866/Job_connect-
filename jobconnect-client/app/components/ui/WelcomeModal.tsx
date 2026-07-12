"use client"

import { useEffect } from "react"
import { X, Briefcase, Search, Bell } from "lucide-react"
import { User } from "@/types"

interface WelcomeModalProps {
  user: User
  onClose: () => void
}

export default function WelcomeModal({ user, onClose }: WelcomeModalProps) {
  const isEmployer = user.role === "employer"

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  const jobseekerSteps = [
    { icon: <Search className="h-5 w-5" />, title: "Browse Jobs", desc: "Search hundreds of junior tech roles across Nigeria" },
    { icon: <Briefcase className="h-5 w-5" />, title: "Apply Instantly", desc: "Apply with your profile and cover letter in one click" },
    { icon: <Bell className="h-5 w-5" />, title: "Track Status", desc: "Get real-time notifications on your applications" },
  ]

  const employerSteps = [
    { icon: <Briefcase className="h-5 w-5" />, title: "Post a Job", desc: "Create a job listing and reach thousands of junior developers" },
    { icon: <Search className="h-5 w-5" />, title: "Review Applications", desc: "Browse candidate profiles and CVs in your dashboard" },
    { icon: <Bell className="h-5 w-5" />, title: "Hire Fast", desc: "Accept or reject candidates with instant notifications" },
  ]

  const steps = isEmployer ? employerSteps : jobseekerSteps

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#F1FEC6] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#496F5D]">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-[#1a2e25]">
            Welcome to JobConnect!
          </h2>
          <p className="mt-2 font-body text-sm font-light text-[#556b5d]">
            Hi <strong className="font-semibold text-[#496F5D]">{user.name}</strong>
            {isEmployer
              ? ` — your company account is ready. Here's how to get started:`
              : ` — your account is ready. Here's how to find your first tech job:`
            }
          </p>
        </div>

        {/* Steps */}
        <div className="mb-6 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#496F5D] text-[#F1FEC6]">
                {step.icon}
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-[#1a2e25]">
                  {step.title}
                </p>
                <p className="font-body text-xs font-light text-[#556b5d] mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#496F5D] py-3 font-body text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors"
        >
          {isEmployer ? "Post My First Job →" : "Browse Jobs →"}
        </button>

        {/* Lavender accent */}
        <div className="mt-3 rounded-lg bg-[#BCB6FF]/30 px-4 py-2 text-center">
          <p className="font-body text-xs font-light text-[#2d2a6e]">
            {isEmployer
              ? "All job posts are reviewed by our team before going live"
              : "Complete your profile to stand out to employers"
            }
          </p>
        </div>
      </div>
    </div>
  )
}