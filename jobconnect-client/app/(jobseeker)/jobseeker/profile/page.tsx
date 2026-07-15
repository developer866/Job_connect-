"use client"

import { useState } from "react"
import { User, Upload, Plus, X } from "lucide-react"
import Button from "@/app/components/ui/Buttons"
import Input from "@/app/components/ui/Input"
import { useAuth } from "@/context/AuthContext"

export default function JobseekerProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const [form, setForm] = useState({
    name: user?.name || "",
    location: user?.location || "",
    bio: user?.bio || "",
    experience: user?.experience || "entry",
    skills: user?.skills || [],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO — connect to update profile API
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const selectClass = "w-full rounded-xl border border-[#496F5D]/30 bg-white px-4 py-3 text-sm font-light text-[#1a2e25] focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
  const labelClass = "block text-sm font-medium text-[#1a2e25] mb-1.5"

  return (
    <div className="p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm font-light text-[#9CA3AF] uppercase tracking-widest mb-1">
          Account
        </p>
        <h1 className="font-heading text-4xl font-extrabold text-[#1a2e25]">
          My Profile
        </h1>
        <p className="font-body text-sm font-light text-[#556b5d] mt-1">
          Keep your profile updated to stand out to employers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Avatar section */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#496F5D] font-heading text-4xl font-bold text-[#F1FEC6]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <h3 className="font-heading text-lg font-bold text-[#1a2e25] mb-1">
              {user?.name}
            </h3>
            <p className="font-body text-sm font-light text-[#9CA3AF] mb-4">
              {user?.email}
            </p>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#496F5D]/30 py-2.5 text-sm font-light text-[#496F5D] hover:bg-[#496F5D]/10 transition-colors">
              <Upload className="h-4 w-4" />
              Upload Photo
            </button>
          </div>

          {/* CV Upload */}
          <div className="mt-4 rounded-2xl bg-white border border-[#e8f0eb] p-6">
            <h3 className="font-heading text-base font-bold text-[#1a2e25] mb-3">
              Your CV
            </h3>
            {user?.cv ? (
              <div className="rounded-xl bg-[#F1FEC6] border border-[#d4e8c2] p-3 flex items-center justify-between">
                <span className="font-body text-xs font-light text-[#496F5D]">
                  CV uploaded ✅
                </span>
                <a
                  href={user.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-green hover:underline"
                >
                  View
                </a>
              </div>
            ) : (
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#496F5D]/30 py-6 text-sm font-light text-[#9CA3AF] hover:border-[#496F5D] hover:text-[#496F5D] transition-colors">
                <Upload className="h-5 w-5" />
                Upload CV (PDF)
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-[#e8f0eb] p-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
              />

              <Input
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Lagos, Nigeria"
              />

              <div>
                <label className={labelClass}>Experience Level</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell employers about yourself..."
                  rows={4}
                  className={`${selectClass} resize-none`}
                />
              </div>

              {/* Skills */}
              <div>
                <label className={labelClass}>Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 rounded-lg bg-[#e8f5ee] px-3 py-1.5 text-xs font-medium text-[#1a4a2e]"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g. React)"
                    className="flex-1 rounded-xl border border-[#496F5D]/30 bg-white px-4 py-2.5 text-sm font-light focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] transition"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSkill}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Save */}
              {saved && (
                <div className="rounded-lg bg-[#e8f5ee] border border-[#d4e8c2] px-4 py-3 text-sm text-[#1a4a2e]">
                  ✅ Profile saved successfully
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="lg"
              >
                Save Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}