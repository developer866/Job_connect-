"use client"

import { useState, useEffect } from "react"
import { Users, Trash2, Search } from "lucide-react"
import Badge from "@/app/components/ui/Badge"
import { Skeleton } from "@/app/components/ui/Skeleton"
import { getAllUsers } from "@/lib/api"
import { User } from "@/types"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const roleVariant = {
    jobseeker: "green" as const,
    employer: "lavender" as const,
    admin: "lime" as const,
  }

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
          Admin
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
          All Users
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Manage all platform users
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#496F5D]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-xl border border-[#496F5D]/30 bg-white py-3 pl-11 pr-4 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
        />
      </div>

      {/* Stats row */}
      <div className="mb-6 flex flex-wrap gap-4">
        {[
          { label: "Total Users", value: users.filter((u) => u.role === "jobseeker").length, color: "text-[#496F5D]" },
          { label: "Employers", value: users.filter((u) => u.role === "employer").length, color: "text-[#2d2a6e]" },
          { label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "text-[#2d4a20]" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white border border-[#e8f0eb] px-5 py-3 flex items-center gap-3"
          >
            <span className={`font-heading text-2xl font-extrabold ${stat.color}`}>
              {stat.value}
            </span>
            <span className="font-body text-sm font-light text-[#9CA3AF]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Users table */}
      {loading ? (
        <div className="space-y-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="h-12 w-12 text-[#d4e8c2] mx-auto mb-3" />
          <h3 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
            No users found
          </h3>
          <p className="font-body text-sm font-light text-[#9CA3AF]">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-[#e8f0eb] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-[#e8f0eb] bg-[#F1FEC6]/50">
            <p className="font-body text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
              User
            </p>
            <p className="font-body text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
              Email
            </p>
            <p className="font-body text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
              Role
            </p>
            <p className="font-body text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
              Actions
            </p>
          </div>

          {/* Table rows */}
          {filtered.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-[#e8f0eb] last:border-0 items-center hover:bg-[#F1FEC6]/30 transition-colors"
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#496F5D] font-heading font-bold text-sm text-[#F1FEC6]">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <p className="font-body text-sm font-medium text-[#1a2e25] truncate">
                  {user.name}
                  {user.companyName && (
                    <span className="block text-xs font-light text-[#9CA3AF]">
                      {user.companyName}
                    </span>
                  )}
                </p>
              </div>

              {/* Email */}
              <p className="font-body text-sm font-light text-[#556b5d] truncate">
                {user.email}
              </p>

              {/* Role */}
              <Badge variant={roleVariant[user.role]}>
                {user.role}
              </Badge>

              {/* Actions */}
              <button className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-light text-red-400 hover:bg-red-50 transition-colors w-fit">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}