import mongoose, { Document, Schema } from "mongoose"

export interface IJobDocument extends Document {
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
  skills: string[]
  experience: "entry" | "junior" | "mid"
  status: "pending" | "approved" | "rejected" | "closed"
  employer: mongoose.Types.ObjectId
  applications: mongoose.Types.ObjectId[]
  deadline: Date
  createdAt: Date
}

const jobSchema = new Schema<IJobDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: {
    type: String,
    enum: ["Lagos", "Abuja", "Remote", "Hybrid", "Other"],
    required: true
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
    required: true
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, enum: ["NGN", "USD"], default: "NGN" }
  },
  skills: [{ type: String }],
  experience: {
    type: String,
    enum: ["entry", "junior", "mid"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "closed"],
    default: "pending"
  },
  employer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  applications: [{
    type: Schema.Types.ObjectId,
    ref: "Application"
  }],
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IJobDocument>("Job", jobSchema)