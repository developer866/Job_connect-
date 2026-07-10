import mongoose, { Document, Schema } from "mongoose"

export interface IUserDocument extends Document {
  name: string
  email: string
  password: string
  role: "jobseeker" | "employer" | "admin"
  avatar?: string
  createdAt: Date

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
  cacNumber?: string
}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["jobseeker", "employer", "admin"],
    default: "jobseeker"
  },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },

  // Jobseeker fields
  cv: { type: String },
  skills: [{ type: String }],
  location: { type: String },
  bio: { type: String },
  experience: {
    type: String,
    enum: ["entry", "junior", "mid"],
  },

  // Employer fields
  companyName: { type: String },
  companyLogo: { type: String },
  companyWebsite: { type: String },
  companyDescription: { type: String },
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "500+"]
  },
  industry: { type: String },
  companyAddress: { type: String },
  cacNumber: { type: String },
})

export default mongoose.model<IUserDocument>("User", userSchema)