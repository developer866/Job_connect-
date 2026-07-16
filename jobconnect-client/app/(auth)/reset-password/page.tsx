"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import Button from "@/app/components/ui/Buttons"
import Input from "@/app/components/ui/Input"
import { resetPassword } from "@/lib/api"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [form, setForm] = useState({ password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push("/forgot-password")
    }
  }, [token, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const res = await resetPassword(token as string, form.password)
      if (res.message === "Password reset successful — please login") {
        setSuccess(true)
        setTimeout(() => router.push("/login"), 3000)
      } else {
        setError(res.message || "Reset failed — link may have expired")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
            Set a new password
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#d4e8c2]">

          {success ? (
            // Success state
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#496F5D]">
                <CheckCircle className="h-8 w-8 text-[#F1FEC6]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
                Password Reset!
              </h2>
              <p className="font-body text-sm font-light text-[#556b5d] mb-2">
                Your password has been reset successfully.
              </p>
              <p className="font-body text-xs font-light text-[#9CA3AF] mb-6">
                Redirecting you to login in 3 seconds...
              </p>
              <Link href="/login">
                <Button fullWidth>
                  Go to Login →
                </Button>
              </Link>
            </div>
          ) : (
            // Form state
            <>
              <div className="mb-6">
                <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-1">
                  Create new password
                </h2>
                <p className="font-body text-sm font-light text-[#556b5d]">
                  Must be at least 8 characters with one uppercase and one number.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-[#1a2e25] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      className="w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 pr-12 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#1a2e25] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 pr-12 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#496F5D]"
                    >
                      {showConfirm
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>

                {/* Password strength indicator */}
                {form.password && (
                  <div className="space-y-1.5">
                    {[
                      { label: "At least 8 characters", met: form.password.length >= 8 },
                      { label: "One uppercase letter", met: /[A-Z]/.test(form.password) },
                      { label: "One number", met: /[0-9]/.test(form.password) },
                    ].map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${rule.met ? "bg-[#496F5D]" : "bg-[#d4e8c2]"}`} />
                        <span className={`font-body text-xs font-light ${rule.met ? "text-[#496F5D]" : "text-[#9CA3AF]"}`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="lg"
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}