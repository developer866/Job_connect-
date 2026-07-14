"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import Button from "@/app/components/ui/Buttons"

interface Filters {
  search: string
  location: string
  type: string
  experience: string
}

interface JobFilterProps {
  onFilter: (filters: Filters) => void
  initialSearch?:string
}

export default function JobFilter({ onFilter ,initialSearch = ""}: JobFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    search: initialSearch,
    location: "",
    type: "",
    experience: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updated = { ...filters, [e.target.name]: e.target.value }
    setFilters(updated)
    onFilter(updated)
  }

  const clearFilters = () => {
    const cleared = { search: "", location: "", type: "", experience: "" }
    setFilters(cleared)
    onFilter(cleared)
  }

  const hasFilters = Object.values(filters).some((v) => v !== "")

  const selectClass = "w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-2.5 text-sm font-light text-[#1a2e25] focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"

  return (
    <div className="mb-8">
      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#496F5D]" />
          <input
            name="search"
            type="text"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search jobs, skills, companies..."
            className="w-full rounded-xl border border-[#496F5D]/30 bg-white py-3 pl-11 pr-4 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="h-2 w-2 rounded-full bg-[#BCB6FF]" />
          )}
        </Button>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 p-4 rounded-xl bg-white border border-[#e8f0eb]">
          <div>
            <label className="block text-xs font-medium text-[#1a2e25] mb-1.5 uppercase tracking-wide">
              Location
            </label>
            <select name="location" value={filters.location} onChange={handleChange} className={selectClass}>
              <option value="">All locations</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1a2e25] mb-1.5 uppercase tracking-wide">
              Job Type
            </label>
            <select name="type" value={filters.type} onChange={handleChange} className={selectClass}>
              <option value="">All types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1a2e25] mb-1.5 uppercase tracking-wide">
              Experience
            </label>
            <select name="experience" value={filters.experience} onChange={handleChange} className={selectClass}>
              <option value="">All levels</option>
              <option value="entry">Entry</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}