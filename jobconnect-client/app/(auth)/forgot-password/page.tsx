"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import Button from "@/app/components/ui/Buttons"
import Input from "@/app/components/ui/Input"
import { forgotPassword } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await forgotPassword(email)
      setSent(true)
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
            Reset your password
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#d4e8c2]">

          {sent ? (
            // Success state
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#496F5D]">
                <Mail className="h-8 w-8 text-[#F1FEC6]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
                Check your inbox
              </h2>
              <p className="font-body text-sm font-light text-[#556b5d] mb-6 leading-relaxed">
                If an account exists for <strong className="font-medium text-[#496F5D]">{email}</strong>, you will receive a password reset link shortly.
              </p>
              <p className="font-body text-xs font-light text-[#9CA3AF] mb-6">
                The link expires in 15 minutes. Check your spam folder if you dont see it.
              </p>
              <Link href="/login">
                <Button fullWidth variant="outline">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            // Form state
            <>
              <div className="mb-6">
                <h2 className="font-heading text-xl font-bold text-[#1a2e25] mb-1">
                  Forgot your password?
                </h2>
                <p className="font-body text-sm font-light text-[#556b5d]">
                  Enter your email and well send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  placeholder="you@example.com"
                  required
                />

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
                  Send Reset Link
                </Button>

                <Link href="/login">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 font-body text-sm font-light text-[#556b5d] hover:text-[#496F5D] transition-colors mt-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}