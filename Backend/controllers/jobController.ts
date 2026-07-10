import type { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Job from "../models/Job";

// Get all job public
const getAllJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { location, type, experience, search } = req.query;
    // Build Filter object dynamically
    const filter: any = { status: "approved" };
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (experience) filter.experience = experience;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter)
      .populate("employer", "companyName companyLogo industry location")
      .sort({ createdAt: -1 });

    res.json({ count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// get single Job public
const getSingleJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "companyName companyLogo companyWebsite industry location companyDescription",
    );

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ messsage: "Job not found" });
  }
}

// employer create job "Private":"Open to any employer"
const employerCreateJob = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const {
      title, description, requirements,
      location, type, salary, skills,
      experience, deadline
    } = req.body

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      type,
      salary,
      skills,
      experience,
      deadline,
      employer: req.user?.userId,
      status: "pending", // goes to admin for approval
    })

    // Notify admin via socket
    const io = req.app.get("io")
    io.emit("new-job-pending", {
      message: `New job posted: ${title} — awaiting approval`,
      jobId: job._id
    })

    res.status(201).json({
      message: "Job posted successfully — awaiting admin approval",
      job
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
};

const employerUpdateJob = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      res.status(404).json({ message: "Job not found" })
      return
    }

    // Make sure only the employer who created it can update
    if (job.employer.toString() !== req.user?.userId) {
      res.status(403).json({ message: "Not authorized to update this job" })
      return
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    )

    res.json({ message: "Job updated successfully", job: updatedJob })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
};

// Employer Delete job ("Private")
const employerDeleteJob = async (req: AuthRequest, res: Response):Promise<void> => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      res.status(404).json({ message: "Job not found" })
      return
    }

    // Make sure only the employer who created it can delete
    if (job.employer.toString() !== req.user?.userId) {
      res.status(403).json({ message: "Not authorized to delete this job" })
      return
    }

    await Job.findByIdAndDelete(req.params.id)

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
};

// EMPLOYER GET THEIR OWN JOBS
const employerGetJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ employer: req.user?.userId })
      .sort({ createdAt: -1 })

    res.json({ count: jobs.length, jobs })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}


export default {
  getAllJobs,
  getSingleJob,
  employerCreateJob,
  employerDeleteJob,
  employerUpdateJob,
  employerGetJobs
};
