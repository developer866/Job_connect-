"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import Button from "@/app/components/ui/Buttons"
import Input from "@/app/components/ui/Input"
import { createJob } from "@/lib/api"

export default function PostJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "full-time" as "full-time" | "part-time" | "contract" | "internship",
    experience: "entry" as "entry" | "junior" | "mid",
    salary: { min: 0, max: 0, currency: "NGN" as "NGN" | "USD" },
    skills: [] as string[],
    requirements: [] as string[],
    deadline: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      salary: { ...form.salary, [e.target.name]: e.target.value }
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setForm({ ...form, requirements: [...form.requirements, newRequirement.trim()] })
      setNewRequirement("")
    }
  }

  const removeRequirement = (req: string) => {
    setForm({ ...form, requirements: form.requirements.filter((r) => r !== req) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await createJob({
        ...form,
        salary: {
          ...form.salary,
          min: Number(form.salary.min),
          max: Number(form.salary.max),
        }
      })

      if (res.job) {
        router.push("/employer/dashboard")
      } else {
        setError(res.message || "Failed to post job")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectClass = "w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 text-sm font-light text-[#1a2e25] focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
  const labelClass = "block text-sm font-medium text-[#1a2e25] mb-1.5"

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
          Employer
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
          Post a Job
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Fill in the details below — your job will go live after admin review
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6 space-y-5">
            <h2 className="font-heading text-lg font-bold text-[#1a2e25]">
              Basic Information
            </h2>

            <Input
              label="Job Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />

            <div>
              <label className={labelClass}>Job Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and what a typical day looks like..."
                rows={6}
                className={`${selectClass} resize-none`}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Location *</label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="">Select location</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Job Type *</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Experience Level *</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Application Deadline *</label>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  className={selectClass}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6 space-y-5">
            <h2 className="font-heading text-lg font-bold text-[#1a2e25]">
              Salary Range
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Currency</label>
                <select
                  name="currency"
                  value={form.salary.currency}
                  onChange={handleSalaryChange}
                  className={selectClass}
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Minimum</label>
                <input
                  name="min"
                  type="number"
                  value={form.salary.min}
                  onChange={handleSalaryChange}
                  placeholder="e.g. 150000"
                  className={selectClass}
                />
              </div>
              <div>
                <label className={labelClass}>Maximum</label>
                <input
                  name="max"
                  type="number"
                  value={form.salary.max}
                  onChange={handleSalaryChange}
                  placeholder="e.g. 300000"
                  className={selectClass}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1a2e25]">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2 min-h-8">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 rounded-lg bg-[#e8f5ee] px-3 py-1.5 text-xs font-medium text-[#1a4a2e]"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="h-3 w-3 hover:text-red-500" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g. React, Node.js)"
                className="flex-1 rounded-xl border border-[#496F5D]/30 bg-white px-4 py-2.5 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
              />
              <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6 space-y-4">
            <h2 className="font-heading text-lg font-bold text-[#1a2e25]">
              Requirements
            </h2>
            <div className="space-y-2">
              {form.requirements.map((req, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#F1FEC6] px-4 py-2.5"
                >
                  <span className="font-body text-sm font-light text-[#1a2e25]">
                    {req}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(req)}
                    className="text-[#9CA3AF] hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                placeholder="Add a requirement..."
                className="flex-1 rounded-xl border border-[#496F5D]/30 bg-white px-4 py-2.5 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
              />
              <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Notice */}
          <div className="rounded-xl bg-[#BCB6FF]/20 border border-[#BCB6FF]/30 px-5 py-4">
            <p className="font-body text-sm font-light text-[#2d2a6e]">
              ℹ️ Your job will be reviewed by our admin team before going live. This usually takes less than 24 hours.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Post Job →
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}