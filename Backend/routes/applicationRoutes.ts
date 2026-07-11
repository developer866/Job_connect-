import { Router } from "express"
import applicationController from "../controllers/applicationController"
import { protect, authorize } from "../middleware/auth"

const router = Router()

/**
 * @swagger
 * /api/jobs/{id}/apply:
 *   post:
 *     summary: Jobseeker applies for a job
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
 *               coverLetter:
 *                 type: string
 *               cv:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Already applied
 *
 * /api/applications:
 *   get:
 *     summary: Employer gets all applications for their jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *
 * /api/applications/my-applications:
 *   get:
 *     summary: Jobseeker gets their own applications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobseeker applications
 *
 * /api/applications/{id}:
 *   get:
 *     summary: Get a single application
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
 *         description: Application found
 *
 *   patch:
 *     summary: Employer updates application status
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
 *                 enum: [pending, reviewing, accepted, rejected]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Not authorized
 */

// ── Jobseeker routes ──
import { validateApplication } from "../middleware/validate"
router.post(
  "/jobs/:id/apply",
  validateApplication,
  protect,
  authorize("jobseeker"),
  applicationController.appliedJob
)

router.get(
  "/applications/my-applications",
  protect,
  authorize("jobseeker"),
  applicationController.getMyApplications
)

// ── Employer routes ──
router.get(
  "/applications",
  protect,
  authorize("employer"),
  applicationController.getApplications
)

router.patch(
  "/applications/:id",
  protect,
  authorize("employer"),
  applicationController.applicationUpdates
)

// ── Shared routes ──
router.get(
  "/applications/:id",
  protect,
  applicationController.getSingleApplication
)

export default router