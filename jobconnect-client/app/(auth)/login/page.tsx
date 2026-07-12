"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { loginUser } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await loginUser(form)

      if (res.token) {
        login(res.token, res.user)

        // Redirect based on role
        if (res.user.role === "employer") {
          router.push("/employer/dashboard")
        } else if (res.user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/jobs")
        }
      } else {
        setError(res.message || "Login failed")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 text-sm font-light text-[#1a2e25] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] focus:border-transparent transition"
  const labelClass = "block text-sm font-medium text-[#1a2e25] mb-1.5"

  return (
    <div className="min-h-screen bg-[#F1FEC6] px-4 py-12 flex items-center">
      <div className="mx-auto w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="font-heading text-3xl font-extrabold text-[#496F5D]">
              Job<span className="text-[#1a2e25]">Connect</span>
            </h1>
          </Link>
          <p className="mt-2 font-body text-sm font-light text-[#556b5d]">
            Welcome back — login to your account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#d4e8c2]">
          <form onSubmit={handleSubmit} className="space-y-5">

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
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass.replace("mb-1.5", "")}>Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-light text-[#496F5D] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
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

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#496F5D] py-3 font-body text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d4e8c2]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#9CA3AF]">or</span>
              </div>
            </div>

            {/* Register link */}
            <p className="text-center font-body text-sm font-light text-[#556b5d]">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-[#496F5D] hover:underline">
                Create one here
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center font-body text-xs font-light text-[#9CA3AF]">
          By continuing you agree to our{" "}
          <span className="text-[#496F5D] cursor-pointer hover:underline">Terms</span>{" "}
          and{" "}
          <span className="text-[#496F5D] cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}