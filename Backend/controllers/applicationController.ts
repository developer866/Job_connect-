import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import Application from "../models/Application"
import Job from "../models/Job"
import Notification from "../models/Notification"

// ── JOBSEEKER APPLIES FOR JOB ──
const appliedJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { coverLetter, cv } = req.body
    const jobId = req.params.id as string

    // Check if job exists and is approved
    const job = await Job.findById(jobId)
    if (!job) {
      res.status(404).json({ message: "Job not found" })
      return
    }

    if (job.status !== "approved") {
      res.status(400).json({ message: "This job is not accepting applications" })
      return
    }

    // Check if jobseeker already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      jobseeker: req.user?.userId
    })

    if (existingApplication) {
      res.status(400).json({ message: "You have already applied for this job" })
      return
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      jobseeker: req.user?.userId,
      employer: job.employer,
      coverLetter,
      cv: cv || null,
      status: "pending"
    })

    // Add application to job
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id }
    })

    // Create notification for employer
    const notification = await Notification.create({
      recipient: job.employer,
      type: "application_received",
      message: `Someone applied for your ${job.title} position`,
      link: `/employer/applications/${application._id}`,
      read: false
    })

    // Emit real-time notification to employer
    const io = req.app.get("io")
    io.to(job.employer.toString()).emit("new-notification", notification)

    res.status(201).json({
      message: "Application submitted successfully",
      application
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── EMPLOYER GETS ALL APPLICATIONS FOR THEIR JOBS ──
const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ employer: req.user?.userId })
      .populate("jobseeker", "name email avatar cv skills experience location bio")
      .populate("job", "title location type")
      .sort({ createdAt: -1 })

    res.json({ count: applications.length, applications })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── JOBSEEKER GETS THEIR OWN APPLICATIONS ──
const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ jobseeker: req.user?.userId })
      .populate("job", "title location type salary status deadline")
      .populate("employer", "companyName companyLogo")
      .sort({ createdAt: -1 })

    res.json({ count: applications.length, applications })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── EMPLOYER UPDATES APPLICATION STATUS ──
const applicationUpdates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body
    const applicationId = req.params.id

    const application = await Application.findById(applicationId)

    if (!application) {
      res.status(404).json({ message: "Application not found" })
      return
    }

    // Make sure only the employer who owns the job can update
    if (application.employer.toString() !== req.user?.userId) {
      res.status(403).json({ message: "Not authorized to update this application" })
      return
    }

    // Update status
    application.status = status
    application.updatedAt = new Date()
    await application.save()

    // Create notification for jobseeker
    const notification = await Notification.create({
      recipient: application.jobseeker,
      type: "status_changed",
      message: `Your application status has been updated to ${status}`,
      link: `/jobseeker/applications`,
      read: false
    })

    // Emit real-time notification to jobseeker
    const io = req.app.get("io")
    io.to(application.jobseeker.toString()).emit("new-notification", notification)

    res.json({
      message: "Application status updated successfully",
      application
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── GET SINGLE APPLICATION ──
const getSingleApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobseeker", "name email avatar cv skills experience location bio")
      .populate("job", "title location type salary")
      .populate("employer", "companyName companyLogo")

    if (!application) {
      res.status(404).json({ message: "Application not found" })
      return
    }

    res.json(application)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default {
  appliedJob,
  getApplications,
  getMyApplications,
  applicationUpdates,
  getSingleApplication
}


