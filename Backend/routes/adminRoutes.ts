import { Router } from "express"
import adminController from "../controllers/adminController"
import { protect, authorize } from "../middleware/auth"


const router = Router()

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform stats
 *
 * /api/admin/jobs:
 *   get:
 *     summary: Get all jobs (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all jobs
 *
 * /api/admin/jobs/pending:
 *   get:
 *     summary: Get all pending jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending jobs
 *
 * /api/admin/jobs/{id}:
 *   patch:
 *     summary: Approve or reject a job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Job status updated
 *
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
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
 *         description: User deleted
 */

// All admin routes are protected and restricted to admin role
router.use(protect, authorize("admin"))


// ✅ Correct order — specific routes FIRST
router.get("/admin/stats", adminController.getStats)
router.get("/admin/jobs/pending", adminController.getPendingJobs)
router.get("/admin/jobs", adminController.getAllJobs)
router.get("/admin/users", adminController.getAllUsers)

// Dynamic routes LAST
router.patch("/admin/jobs/:id", adminController.updateJobStatus)
router.delete("/admin/users/:id", adminController.deleteUser)

export default router