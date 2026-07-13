"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  Briefcase,
  Users,
  CheckCircle,
  Zap,
  Shield,
  Star,
  Monitor,
  Server,
  Blocks,
  Smartphone,
  Cloud,
  ChartColumn,
} from "lucide-react";

import Button from "./components/ui/Buttons";
import JobCard from "./components/jobs/JobCard";
import { JobCardSkeleton } from "./components/ui/Skeleton";
import { getAllJobs } from "@/lib/api";
import { Job } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllJobs()
      .then((data) => setFeaturedJobs(data.jobs?.slice(0, 6) || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?search=${search}`);
  };

  const stats = [
    {
      value: "500+",
      label: "Jobs Posted",
      icon: <Briefcase className="h-5 w-5" />,
    },
    { value: "2K+", label: "Developers", icon: <Users className="h-5 w-5" /> },
    { value: "200+", label: "Companies", icon: <Star className="h-5 w-5" /> },
    {
      value: "95%",
      label: "Hire Rate",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Apply in Seconds",
      desc: "One-click apply with your saved profile. No need to fill forms every time.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Verified Companies",
      desc: "Every employer is reviewed by our team. No fake listings, no spam.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Real-time Updates",
      desc: "Get instant notifications when employers view or update your application.",
    },
  ];

  const categories = [
    { name: "Frontend", count: 45, icon: Monitor },
    { name: "Backend", count: 38, icon: Server },
    { name: "Fullstack", count: 29, icon: Blocks },
    { name: "Mobile", count: 18, icon: Smartphone },
    { name: "DevOps", count: 12, icon: Cloud },
    { name: "Data", count: 15, icon: ChartColumn },
  ];

  return (
    <div className="bg-[#F1FEC6]">
      {/* ── HERO ── */}
      <section className="px-6 pt-20 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1a2e25] leading-[1.05] mb-6">
                Find Your
                <br />
                First
                <br />
                <span className="text-[#496F5D]">Tech Job.</span>
              </h1>

              <p className="font-body text-lg font-light text-[#556b5d] leading-relaxed mb-8 max-w-md">
                Connecting fresh graduates and junior developers with the best
                startups and SMEs across Nigeria. No experience required — just
                passion and drive.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="flex gap-3 mb-8 flex-wrap"
              >
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#496F5D]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search jobs, skills..."
                    className="w-full rounded-xl border border-[#496F5D]/30 bg-white py-3.5 pl-11 pr-4 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF]"
                  />
                </div>
                <Button type="submit" size="lg">
                  Search Jobs
                </Button>
              </form>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-light text-[#9CA3AF]">
                  Popular:
                </span>
                {["React", "Node.js", "Python", "Remote"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/jobs?search=${tag}`)}
                    className="rounded-full border border-[#496F5D]/30 bg-white px-3 py-1 text-xs font-light text-[#496F5D] hover:bg-[#496F5D] hover:text-[#F1FEC6] transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="hidden lg:block relative h-[500px]">
              {/* Main card */}
              <div className="absolute top-8 left-8 right-8 rounded-2xl bg-white border border-[#e8f0eb] p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-[#496F5D] flex items-center justify-center text-[#F1FEC6] font-heading font-bold text-lg">
                    W
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-[#1a2e25]">
                      Wiz Technologies
                    </p>
                    <p className="font-body text-xs font-light text-[#9CA3AF]">
                      Lagos, Nigeria
                    </p>
                  </div>
                  <span className="ml-auto rounded-lg bg-[#F1FEC6] px-2.5 py-1 text-xs font-medium text-[#2d4a20]">
                    ✨ New
                  </span>
                </div>
                <p className="font-heading text-lg font-bold text-[#1a2e25] mb-1">
                  Frontend Developer
                </p>
                <p className="font-body text-xs font-light text-[#9CA3AF] mb-3">
                  Full-time · ₦150k – ₦250k/month
                </p>
                <div className="flex gap-2 mb-4">
                  {["React", "TypeScript", "Tailwind"].map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-[#e8f5ee] px-2.5 py-1 text-xs text-[#1a4a2e]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <button className="w-full rounded-xl bg-[#496F5D] py-2.5 text-sm font-medium text-[#F1FEC6] hover:bg-[#1a2e25] transition-colors">
                  Apply Now →
                </button>
              </div>

              {/* Floating notification */}
              <div className="absolute bottom-24 right-0 rounded-2xl bg-white border border-[#e8f0eb] p-4 shadow-lg w-56">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#BCB6FF] flex items-center justify-center text-sm">
                    🎉
                  </div>
                  <div>
                    <p className="font-heading text-xs font-bold text-[#1a2e25]">
                      Application Accepted!
                    </p>
                    <p className="font-body text-[10px] font-light text-[#9CA3AF]">
                      Tech Nigeria
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats pill */}
              <div className="absolute bottom-8 left-8 rounded-2xl bg-[#496F5D] p-4 shadow-lg">
                <p className="font-heading text-2xl font-extrabold text-[#F1FEC6]">
                  500+
                </p>
                <p className="font-body text-xs font-light text-[#F1FEC6]/70">
                  Active Jobs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#496F5D] py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 flex justify-center text-[#F1FEC6]/60">
                  {stat.icon}
                </div>
                <p className="font-heading text-4xl font-extrabold text-[#F1FEC6]">
                  {stat.value}
                </p>
                <p className="font-body text-sm font-light text-[#F1FEC6]/70 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="font-body text-sm font-light text-[#496F5D] uppercase tracking-widest mb-3">
              Explore by role
            </p>
            <h2 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
              Browse Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <button
                  key={cat.name}
                  onClick={() => router.push(`/jobs?search=${cat.name}`)}
                  className="group rounded-2xl border border-[#e8f0eb] bg-white p-5 text-center transition-all duration-200 hover:border-[#496F5D] hover:shadow-md"
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-[#496F5D] transition-transform duration-200 group-hover:scale-110" />

                  <p className="font-heading text-sm font-bold text-[#1a2e25] transition-colors group-hover:text-[#496F5D]">
                    {cat.name}
                  </p>

                  <p className="mt-1 font-body text-xs font-light text-[#9CA3AF]">
                    {cat.count} jobs
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="font-body text-sm font-light text-[#496F5D] uppercase tracking-widest mb-3">
                Hand picked
              </p>
              <h2 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
                Featured Jobs
              </h2>
            </div>
            <Link href="/jobs">
              <Button variant="outline">
                View All Jobs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => <JobCardSkeleton key={i} />)
            ) : featuredJobs.length === 0 ? (
              <div className="col-span-2 text-center py-16">
                <Briefcase className="h-12 w-12 text-[#d4e8c2] mx-auto mb-3" />
                <p className="font-body text-sm font-light text-[#9CA3AF]">
                  No jobs available yet
                </p>
              </div>
            ) : (
              featuredJobs.map((job) => <JobCard key={job._id} job={job} />)
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-body text-sm font-light text-[#496F5D] uppercase tracking-widest mb-3">
              Simple process
            </p>
            <h2 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Profile",
                desc: "Sign up and build your developer profile in minutes. Upload your CV and showcase your skills.",
              },
              {
                step: "02",
                title: "Browse & Apply",
                desc: "Search through hundreds of junior tech roles. Filter by location, type, and experience level.",
              },
              {
                step: "03",
                title: "Get Hired",
                desc: "Track your applications in real time and get notified the moment an employer responds.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#496F5D]">
                  <span className="font-heading text-xl font-extrabold text-[#F1FEC6]">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-[#1a2e25] mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-sm font-light text-[#556b5d] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 bg-[#496F5D]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-4xl font-extrabold text-[#F1FEC6]">
              Why JobConnect?
            </h2>
            <p className="font-body text-sm font-light text-[#F1FEC6]/70 mt-3">
              Built specifically for Nigerian junior tech talent
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white/10 border border-white/10 p-6"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1FEC6]/20 text-[#F1FEC6]">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-[#F1FEC6] mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm font-light text-[#F1FEC6]/70 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR EMPLOYERS ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-[#BCB6FF]/20 border border-[#BCB6FF]/30 p-10 sm:p-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#BCB6FF]/30 px-4 py-1.5 text-xs font-medium text-[#2d2a6e] mb-6">
              🏢 For Employers
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#1a2e25] mb-4">
              Hire Junior
              <br />
              Tech Talent Fast
            </h2>
            <p className="font-body text-base font-light text-[#556b5d] mb-8 max-w-lg mx-auto leading-relaxed">
              Post jobs for free and reach thousands of motivated junior
              developers across Nigeria. Find your next hire in days, not
              months.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Post a Job Free →</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#1a2e25]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#F1FEC6] mb-4">
            Ready to Start?
          </h2>
          <p className="font-body text-base font-light text-[#F1FEC6]/70 mb-8 max-w-lg mx-auto">
            Join thousands of junior developers who found their first tech job
            through JobConnect.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create Free Account →
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                size="lg"
                className="border border-[#F1FEC6]/30 text-[#F1FEC6] hover:bg-white/10 bg-transparent"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
