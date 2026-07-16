"use client"

import { useState, useEffect, useCallback,Suspense } from "react"
import { Briefcase, SlidersHorizontal } from "lucide-react"
import JobCard from "@/app/components/jobs/JobCard"
import JobFilter from "@/app/components/jobs/JobFilter"
import { JobCardSkeleton } from "@/app/components/ui/Skeleton"
import { getAllJobs } from "@/lib/api"
import { Job } from "@/types"
import { useSearchParams } from "next/navigation"

interface Filters {
  search: string
  location: string
  type: string
  experience: string
}

function JobsContent(){
  const searchParams = useSearchParams()
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Pre-fill search from URL params (from homepage search)
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    location: "",
    type: "",
    experience: "",
  })
  
  const fetchJobs = useCallback(async (activeFilters: Filters) => {
    setLoading(true)
    try {
      // Build query string from filters
      const params = new URLSearchParams()
      if (activeFilters.search) params.append("search", activeFilters.search)
      if (activeFilters.location) params.append("location", activeFilters.location)
      if (activeFilters.type) params.append("type", activeFilters.type)
      if (activeFilters.experience) params.append("experience", activeFilters.experience)

      const data = await getAllJobs(params.toString())
      setJobs(data.jobs || [])
      setTotalCount(data.count || 0)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and when filters change
  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs(filters)
    }

    void loadJobs()
  }, [filters, fetchJobs])

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters)
  }
  return (
    <div>
       <div className="min-h-screen bg-[#F1FEC6]">

      {/* ── Page Header ── */}
      <section className="bg-[#496F5D] py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-body text-sm font-light text-[#F1FEC6]/70 uppercase tracking-widest mb-3">
            Opportunities
          </p>
          <h1 className="font-heading text-5xl font-extrabold text-[#F1FEC6] mb-4">
            Browse Jobs
          </h1>
          <p className="font-body text-base font-light text-[#F1FEC6]/70 max-w-lg">
            Find junior tech roles across Nigeria — from startups to growing SMEs. Your first tech job starts here.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-10 px-6">
        <div className="mx-auto max-w-7xl">

          {/* Filter component */}
          <JobFilter onFilter={handleFilter} initialSearch={filters.search} />

          {/* Results count */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="font-body text-sm font-light text-[#556b5d]">
              {loading
                ? "Loading jobs..."
                : `${totalCount} job${totalCount !== 1 ? "s" : ""} found`
              }
            </p>

            {/* Sort — future feature */}
            <div className="flex items-center gap-2 text-sm font-light text-[#9CA3AF]">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sorted by latest</span>
            </div>
          </div>

          {/* Jobs grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {Array(6).fill(0).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#496F5D]/10">
                <Briefcase className="h-8 w-8 text-[#496F5D]" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1a2e25] mb-2">
                No jobs found
              </h3>
              <p className="font-body text-sm font-light text-[#9CA3AF] max-w-sm">
                Try adjusting your filters or search terms to find more opportunities.
              </p>
              <button
                onClick={() => setFilters({ search: "", location: "", type: "", experience: "" })}
                className="mt-6 rounded-xl bg-[#496F5D] px-6 py-2.5 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </div>
  )
}
export default function JobsPage() {
  

  return (
   <div>
    <Suspense fallback={<div>Loading.....</div>} >
      <JobsContent />
    </Suspense>
   </div>
  )
}