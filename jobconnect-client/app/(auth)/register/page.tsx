"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Building2, User } from "lucide-react"
import { registerUser } from "@/lib/api"
// import { useAuth } from "../context/AuthContext"
import { useAuth } from "../../../context/AuthContext"
// import WelcomeModal from "../components/ui/WelcomeModal"
import WelcomeModal from "@/app/components/ui/WelcomeModal"
import { User as UserType } from "@/types"

type Role = "jobseeker" | "employer"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  // ── State ──
  const [role, setRole] = useState<Role>("jobseeker")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [newUser, setNewUser] = useState<UserType | null>(null)

  // ── Form state ──
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    // Employer fields
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    companySize: "",
    industry: "",
    companyAddress: "",
    cacNumber: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("") // clear error on input
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const data = role === "jobseeker"
        ? { name: form.name, email: form.email, password: form.password, role }
        : { ...form, role }

      const res = await registerUser(data)

      if (res.token) {
        // Success — login and show welcome modal
        login(res.token, res.user)
        setNewUser(res.user)
        setShowWelcome(true)
      } else {
        // Show validation errors or message
        setError(res.message || "Registration failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    // Redirect based on role
    if (newUser?.role === "employer") {
      router.push("/employer/dashboard")
    } else {
      router.push("/jobs")
    }
  }

  const inputClass = "w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 text-sm font-light text-[#1a2e25] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] focus:border-transparent transition"
  const labelClass = "block text-sm font-medium text-[#1a2e25] mb-1.5"

  return (
    <>
      <div className="min-h-screen bg-[#F1FEC6] px-4 py-12">
        <div className="mx-auto max-w-lg">

          {/* Header */}
          <div className="mb-8 text-center">
            <Link href="/">
              <h1 className="font-heading text-3xl font-extrabold text-[#496F5D]">
                Job<span className="text-[#1a2e25]">Connect</span>
              </h1>
            </Link>
            <p className="mt-2 font-body text-sm font-light text-[#556b5d]">
              Create your account and start your journey
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#d4e8c2]">

            {/* Role Toggle */}
            <div className="mb-6 flex rounded-xl border border-[#496F5D]/20 bg-[#F1FEC6] p-1">
              <button
                type="button"
                onClick={() => setRole("jobseeker")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  role === "jobseeker"
                    ? "bg-[#496F5D] text-[#F1FEC6] shadow-sm"
                    : "text-[#556b5d] hover:text-[#496F5D]"
                }`}
              >
                <User className="h-4 w-4" />
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  role === "employer"
                    ? "bg-[#496F5D] text-[#F1FEC6] shadow-sm"
                    : "text-[#556b5d] hover:text-[#496F5D]"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Employer
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ayeni Opeyemi"
                  className={inputClass}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#496F5D]"
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Employer extra fields */}
              {role === "employer" && (
                <>
                  <div className="my-2 border-t border-[#d4e8c2] pt-4">
                    <p className="text-xs font-medium text-[#496F5D] uppercase tracking-wider mb-4">
                      Company Details
                    </p>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className={labelClass}>Company Name *</label>
                    <input
                      name="companyName"
                      type="text"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Wiz Technologies"
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className={labelClass}>Industry *</label>
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Fintech">Fintech</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Media">Media</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Company Address */}
                  <div>
                    <label className={labelClass}>Company Address *</label>
                    <input
                      name="companyAddress"
                      type="text"
                      value={form.companyAddress}
                      onChange={handleChange}
                      placeholder="Lagos, Nigeria"
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className={labelClass}>Company Size</label>
                    <select
                      name="companySize"
                      value={form.companySize}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1 - 10 employees</option>
                      <option value="11-50">11 - 50 employees</option>
                      <option value="51-200">51 - 200 employees</option>
                      <option value="201-500">201 - 500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  {/* Website */}
                  <div>
                    <label className={labelClass}>Website (optional)</label>
                    <input
                      name="companyWebsite"
                      type="url"
                      value={form.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://yourcompany.com"
                      className={inputClass}
                    />
                  </div>

                  {/* CAC Number */}
                  <div>
                    <label className={labelClass}>CAC Number (optional)</label>
                    <input
                      name="cacNumber"
                      type="text"
                      value={form.cacNumber}
                      onChange={handleChange}
                      placeholder="RC-0000000"
                      className={inputClass}
                    />
                  </div>

                  {/* Company Description */}
                  <div>
                    <label className={labelClass}>Company Description (optional)</label>
                    <textarea
                      name="companyDescription"
                      value={form.companyDescription}
                      onChange={handleChange}
                      placeholder="Tell job seekers about your company..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </>
              )}

              {/* Error message */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#496F5D] py-3 font-body text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading
                  ? "Creating account..."
                  : role === "employer"
                  ? "Create Company Account"
                  : "Create Account"
                }
              </button>

              {/* Login link */}
              <p className="text-center font-body text-sm font-light text-[#556b5d]">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-[#496F5D] hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcome && newUser && (
        <WelcomeModal user={newUser} onClose={handleWelcomeClose} />
      )}
    </>
  )
}