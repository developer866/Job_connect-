import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import Job from "../models/Job"
import User from "../models/User"
import Application from "../models/Application"
import Notification from "../models/Notification"



// ── GET PLATFORM STATS ──
const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: "jobseeker" })
    const totalEmployers = await User.countDocuments({ role: "employer" })
    const totalJobs = await Job.countDocuments({ status: "approved" })
    const pendingJobs = await Job.countDocuments({ status: "pending" })
    const totalApplications = await Application.countDocuments()

    res.json({
      totalUsers,
      totalEmployers,
      totalJobs,
      pendingJobs,
      totalApplications
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── GET ALL PENDING JOBS ──
const getPendingJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ status: "pending" })
      .populate("employer", "companyName companyLogo industry companyAddress")
      .sort({ createdAt: -1 })

    res.json({ count: jobs.length, jobs })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── APPROVE OR REJECT JOB ──
const updateJobStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body
    const jobId = req.params.id

    if (!["approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Status must be approved or rejected" })
      return
    }

    const job = await Job.findById(jobId)

    if (!job) {
      res.status(404).json({ message: "Job not found" })
      return
    }

    job.status = status
    await job.save()

    // Notify employer
    const notification = await Notification.create({
      recipient: job.employer,
      type: status === "approved" ? "job_approved" : "job_rejected",
      message: status === "approved"
        ? `Your job "${job.title}" has been approved and is now live`
        : `Your job "${job.title}" was rejected by admin`,
      link: `/employer/jobs/${job._id}`,
      read: false
    })

    // Emit real-time notification to employer
    const io = req.app.get("io")
    io.to(job.employer.toString()).emit("new-notification", notification)

    res.json({
      message: `Job ${status} successfully`,
      job
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── GET ALL USERS ──
const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.query
    const filter: any = {}
    if (role) filter.role = role

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })

    res.json({ count: users.length, users })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── DELETE USER ──
const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── GET ALL JOBS (admin sees all statuses) ──
const getAllJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query
    const filter: any = {}
    if (status) filter.status = status

    const jobs = await Job.find(filter)
      .populate("employer", "companyName industry")
      .sort({ createdAt: -1 })

    res.json({ count: jobs.length, jobs })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default {
  getStats,
  getPendingJobs,
  updateJobStatus,
  getAllUsers,
  deleteUser,
  getAllJobs
}