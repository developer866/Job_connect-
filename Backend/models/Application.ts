import mongoose, { Document, Schema } from "mongoose"

export interface IApplicationDocument extends Document {
  job: mongoose.Types.ObjectId
  jobseeker: mongoose.Types.ObjectId
  employer: mongoose.Types.ObjectId
  status: "pending" | "reviewing" | "accepted" | "rejected"
  coverLetter: string
  cv: string
  createdAt: Date
  updatedAt: Date
}

const applicationSchema = new Schema<IApplicationDocument>({
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  jobseeker: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  employer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "reviewing", "accepted", "rejected"],
    default: "pending"
  },
  coverLetter: { type: String, required: true },
  cv: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model<IApplicationDocument>("Application", applicationSchema)