// These are the shapes of our data
// TypeScript uses these to catch errors before they happen

export interface User {
  _id: string
  name: string
  email: string
  role: "jobseeker" | "employer" | "admin"
  avatar?: string
  // Jobseeker fields
  cv?: string
  skills?: string[]
  location?: string
  bio?: string
  experience?: "entry" | "junior" | "mid"
  // Employer fields
  companyName?: string
  companyLogo?: string
  companyWebsite?: string
  companyDescription?: string
  companySize?: string
  industry?: string
  companyAddress?: string
}

export interface Job {
  _id: string
  title: string
  description: string
  requirements: string[]
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  salary: {
    min: number
    max: number
    currency: "NGN" | "USD"
  }
  companyName:string
  skills: string[]
  experience: "entry" | "junior" | "mid"
  status: "pending" | "approved" | "rejected" | "closed"
  employer: User
  createdAt: string
  deadline: string
}

export interface Application {
  _id: string
  job: Job
  jobseeker: User
  employer: User
  status: "pending" | "reviewing" | "accepted" | "rejected"
  coverLetter: string
  cv?: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id: string
  recipient: string
  type: "application_received" | "status_changed" | "job_approved" | "job_rejected"
  message: string
  read: boolean
  link: string
  createdAt: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface ApiError {
  message: string
  errors?: { field: string; message: string }[]
}