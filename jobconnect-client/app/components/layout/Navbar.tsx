"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, Menu, X, Bell, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

function Navbar() {
  const { user, logout, isJobseeker, isEmployer, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Companies", href: "/companies" },
    { name: "About", href: "/about" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Dashboard link changes based on role
  const getDashboardLink = () => {
    if (isJobseeker) return "/jobseeker/dashboard"
    if (isEmployer) return "/employer/dashboard"
    if (isAdmin) return "/admin/dashboard"
    return "/"
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#d4e8c2] bg-[#F1FEC6]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/">
          <h1 className="font-heading text-2xl font-extrabold text-[#496F5D]">
            Job<span className="text-[#1a2e25]">Connect</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="font-body text-sm font-light text-[#556b5d] transition-colors hover:text-[#496F5D]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#496F5D]" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-56 rounded-full border border-[#496F5D] bg-white py-2 pl-9 pr-4 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF]"
            />
          </div>

          {user ? (
            <>
              {/* Notification bell */}
              <button className="relative rounded-full p-2 hover:bg-[#496F5D]/10">
                <Bell className="h-5 w-5 text-[#496F5D]" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#BCB6FF]" />
              </button>

              {/* Dashboard */}
              <Link href={getDashboardLink()}>
                <button className="flex items-center gap-2 rounded-lg border border-[#496F5D] px-4 py-2 text-sm font-light text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user.name.split(" ")[0]}</span>
                </button>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-[#496F5D] px-4 py-2 text-sm font-light text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="rounded-lg border border-[#496F5D] px-4 py-2 text-sm font-light text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="rounded-lg bg-[#496F5D] px-4 py-2 text-sm font-light text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen
            ? <X className="h-6 w-6 text-[#496F5D]" />
            : <Menu className="h-6 w-6 text-[#496F5D]" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-[#d4e8c2] bg-[#F1FEC6] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 mb-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-light text-[#556b5d] hover:text-[#496F5D]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#496F5D]" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full rounded-full border border-[#496F5D] bg-white py-2 pl-9 pr-4 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF]"
            />
          </div>

          {user ? (
            <div className="flex gap-3">
              <Link href={getDashboardLink()} className="flex-1">
                <button className="w-full rounded-lg border border-[#496F5D] py-2 text-sm font-light text-[#496F5D]">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-[#496F5D] py-2 text-sm font-light text-[#F1FEC6]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full rounded-lg border border-[#496F5D] py-2 text-sm font-light text-[#496F5D]">
                  Login
                </button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full rounded-lg bg-[#496F5D] py-2 text-sm font-light text-[#F1FEC6]">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar