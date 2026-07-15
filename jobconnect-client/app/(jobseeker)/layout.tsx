"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Sidebar from "@/app/components/layout/Sidebar"

export default function JobseekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isJobseeker } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isJobseeker)) {
      router.push("/login")
    }
  }, [user, loading, isJobseeker, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F1FEC6]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#496F5D] border-t-transparent" />
      </div>
    )
  }

  if (!user || !isJobseeker) return null

  return (
    <div className="flex min-h-screen bg-[#F1FEC6]">
      <Sidebar role="jobseeker" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}