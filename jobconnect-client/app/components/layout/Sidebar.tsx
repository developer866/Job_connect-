"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Briefcase, FileText,
  User, Bell, LogOut, ChevronRight
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface SidebarProps {
  role: "jobseeker" | "employer" | "admin"
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const jobseekerLinks = [
    { name: "Dashboard", href: "/jobseeker/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Browse Jobs", href: "/jobs", icon: <Briefcase className="h-5 w-5" /> },
    { name: "My Applications", href: "/jobseeker/applications", icon: <FileText className="h-5 w-5" /> },
    { name: "Profile", href: "/jobseeker/profile", icon: <User className="h-5 w-5" /> },
    { name: "Notifications", href: "/jobseeker/notifications", icon: <Bell className="h-5 w-5" /> },
  ]

  const employerLinks = [
    { name: "Dashboard", href: "/employer/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Post a Job", href: "/employer/post-job", icon: <Briefcase className="h-5 w-5" /> },
    { name: "My Jobs", href: "/employer/jobs", icon: <FileText className="h-5 w-5" /> },
    { name: "Applications", href: "/employer/applications", icon: <User className="h-5 w-5" /> },
    { name: "Notifications", href: "/employer/notifications", icon: <Bell className="h-5 w-5" /> },
  ]

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Pending Jobs", href: "/admin/jobs", icon: <Briefcase className="h-5 w-5" /> },
    { name: "All Users", href: "/admin/users", icon: <User className="h-5 w-5" /> },
  ]

  const links =
    role === "jobseeker"
      ? jobseekerLinks
      : role === "employer"
      ? employerLinks
      : adminLinks

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-[#d4e8c2] bg-[#496F5D] sticky top-0">

      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-5">
        <Link href="/">
          <h1 className="font-heading text-xl font-extrabold text-[#F1FEC6]">
            Job<span className="text-white/60">Connect</span>
          </h1>
        </Link>
      </div>

      {/* User info */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1FEC6] font-heading font-bold text-[#496F5D]">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold text-[#F1FEC6] truncate">
              {user?.name}
            </p>
            <p className="font-body text-xs font-light text-[#F1FEC6]/60 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
                flex items-center justify-between gap-3 rounded-xl px-3 py-2.5
                font-body text-sm font-light transition-all duration-200
                ${isActive
                  ? "bg-[#F1FEC6] text-[#496F5D] font-medium"
                  : "text-[#F1FEC6]/70 hover:bg-white/10 hover:text-[#F1FEC6]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                {link.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-light text-[#F1FEC6]/70 hover:bg-white/10 hover:text-[#F1FEC6] transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}