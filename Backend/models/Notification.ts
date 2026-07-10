import mongoose, { Document, Schema } from "mongoose"

export interface INotificationDocument extends Document {
  recipient: mongoose.Types.ObjectId
  type: "application_received" | "status_changed" | "job_approved" | "job_rejected"
  message: string
  read: boolean
  link: string
  createdAt: Date
}

const notificationSchema = new Schema<INotificationDocument>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["application_received", "status_changed", "job_approved", "job_rejected"],
    required: true
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<INotificationDocument>("Notification", notificationSchema)