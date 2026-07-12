import { AuthResponse, Job, Application, Notification, User } from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
})

const publicHeaders = () => ({
  "Content-Type": "application/json",
})

// ── Register data types ──
interface JobseekerRegisterData {
  name: string
  email: string
  password: string
  role: "jobseeker"
}

interface EmployerRegisterData {
  name: string
  email: string
  password: string
  role: "employer"
  companyName: string
  companyWebsite?: string
  companyDescription?: string
  companySize?: string
  industry: string
  companyAddress: string
  cacNumber?: string
}

type RegisterData = JobseekerRegisterData | EmployerRegisterData

interface LoginData {
  email: string
  password: string
}

interface JobData {
  title: string
  description: string
  requirements: string[]
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  salary: { min: number; max: number; currency: "NGN" | "USD" }
  skills: string[]
  experience: "entry" | "junior" | "mid"
  deadline: string
}

interface ApplicationData {
  coverLetter: string
  cv?: string
}

// ──────────────────────────────────────
// AUTH
// ──────────────────────────────────────
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getProfile = async (): Promise<User> => {
  const res = await fetch(`${BASE_URL}/auth/profile`, {
    headers: authHeaders(),
  })
  return res.json()
}

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: publicHeaders(),
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export const resetPassword = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
    method: "PATCH",
    headers: publicHeaders(),
    body: JSON.stringify({ password }),
  })
  return res.json()
}

// ──────────────────────────────────────
// JOBS
// ──────────────────────────────────────
export const getAllJobs = async (params?: string): Promise<{ count: number; jobs: Job[] }> => {
  const res = await fetch(
    `${BASE_URL}/jobs${params ? `?${params}` : ""}`,
    { headers: publicHeaders() }
  )
  return res.json()
}

export const getSingleJob = async (id: string): Promise<Job> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    headers: publicHeaders(),
  })
  return res.json()
}

export const createJob = async (data: JobData): Promise<{ message: string; job: Job }> => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const updateJob = async (
  id: string,
  data: Partial<JobData>
): Promise<{ message: string; job: Job }> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteJob = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  return res.json()
}

export const getMyJobs = async (): Promise<{ count: number; jobs: Job[] }> => {
  const res = await fetch(`${BASE_URL}/jobs/my-jobs`, {
    headers: authHeaders(),
  })
  return res.json()
}

// ──────────────────────────────────────
// APPLICATIONS
// ──────────────────────────────────────
export const applyForJob = async (
  jobId: string,
  data: ApplicationData
): Promise<{ message: string; application: Application }> => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/apply`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getMyApplications = async (): Promise<{ count: number; applications: Application[] }> => {
  const res = await fetch(`${BASE_URL}/applications/my-applications`, {
    headers: authHeaders(),
  })
  return res.json()
}

export const getApplications = async (): Promise<{ count: number; applications: Application[] }> => {
  const res = await fetch(`${BASE_URL}/applications`, {
    headers: authHeaders(),
  })
  return res.json()
}

export const updateApplicationStatus = async (
  id: string,
  status: "pending" | "reviewing" | "accepted" | "rejected"
): Promise<{ message: string; application: Application }> => {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  return res.json()
}

// ──────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────
export const getNotifications = async (): Promise<{ unreadCount: number; notifications: Notification[] }> => {
  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: authHeaders(),
  })
  return res.json()
}

export const markNotificationRead = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/notifications/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
  })
  return res.json()
}

export const markAllNotificationsRead = async (): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: authHeaders(),
  })
  return res.json()
}

// ──────────────────────────────────────
// ADMIN
// ──────────────────────────────────────
export const getAdminStats = async (): Promise<{
  totalUsers: number
  totalEmployers: number
  totalJobs: number
  pendingJobs: number
  totalApplications: number
}> => {
  const res = await fetch(`${BASE_URL}/admin/stats`, {
    headers: authHeaders(),
  })
  return res.json()
}

export const getPendingJobs = async (): Promise<{ count: number; jobs: Job[] }> => {
  const res = await fetch(`${BASE_URL}/admin/jobs/pending`, {
    headers: authHeaders(),
  })
  return res.json()
}

export const updateJobStatus = async (
  id: string,
  status: "approved" | "rejected"
): Promise<{ message: string; job: Job }> => {
  const res = await fetch(`${BASE_URL}/admin/jobs/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  return res.json()
}

export const getAllUsers = async (): Promise<{ count: number; users: User[] }> => {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: authHeaders(),
  })
  return res.json()
}