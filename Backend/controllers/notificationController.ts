import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import Notification from "../models/Notification"

// ── GET USER NOTIFICATIONS ──
const getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ recipient: req.user?.userId })
      .sort({ createdAt: -1 })
      .limit(20)

    const unreadCount = await Notification.countDocuments({
      recipient: req.user?.userId,
      read: false
    })

    res.json({ unreadCount, notifications })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── MARK NOTIFICATION AS READ ──
const readNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      res.status(404).json({ message: "Notification not found" })
      return
    }

    // Make sure only the recipient can mark it as read
    if (notification.recipient.toString() !== req.user?.userId) {
      res.status(403).json({ message: "Not authorized" })
      return
    }

    notification.read = true
    await notification.save()

    res.json({ message: "Notification marked as read", notification })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── MARK ALL NOTIFICATIONS AS READ ──
const readAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { recipient: req.user?.userId, read: false },
      { read: true }
    )

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── DELETE NOTIFICATION ──
const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      res.status(404).json({ message: "Notification not found" })
      return
    }

    if (notification.recipient.toString() !== req.user?.userId) {
      res.status(403).json({ message: "Not authorized" })
      return
    }

    await Notification.findByIdAndDelete(req.params.id)

    res.json({ message: "Notification deleted" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default {
  getUserNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification
}