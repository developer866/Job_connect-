import { Router } from "express"
import notificationController from "../controllers/notificationController"
import { protect } from "../middleware/auth"

const router = Router()

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *
 * /api/notifications/{id}:
 *   patch:
 *     summary: Mark single notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *
 *   delete:
 *     summary: Delete a notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 */

router.get("/notifications", protect, notificationController.getUserNotifications)
router.patch("/notifications/read-all", protect, notificationController.readAllNotifications)
router.patch("/notifications/:id", protect, notificationController.readNotification)
router.delete("/notifications/:id", protect, notificationController.deleteNotification)

export default router