import { Router } from "express";
import jobController from "../controllers/jobController";
import { protect,authorize } from "../middleware/auth";

// GET  /api/jobs              → all approved jobs
// POST /api/jobs              → employer creates job
// GET  /api/jobs/:id          → single job
// PATCH /api/jobs/:id         → employer updates job
// DELETE /api/jobs/:id        → employer deletes job

const router = Router();
/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all approved jobs
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of approved jobs
 *
 *   post:
 *     summary: Employer creates a new job
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Job created successfully
 *       403:
 *         description: Not authorized
 *
 * /api/jobs/my-jobs:
 *   get:
 *     summary: Employer gets their own jobs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employer jobs
 *
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a single job
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job found
 *       404:
 *         description: Job not found
 *
 *   patch:
 *     summary: Employer updates a job
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
 *         description: Job updated
 *       403:
 *         description: Not authorized
 *
 *   delete:
 *     summary: Employer deletes a job
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
 *         description: Job deleted
 *       403:
 *         description: Not authorized
 */

import { validateJob } from "../middleware/validate";
import { employerLimiter } from "../middleware/rateLimiter";
// ── Public routes ──
router.get("/jobs",employerLimiter, jobController.getAllJobs)
router.get("/jobs/:id", jobController.getSingleJob)

// ── Protected routes — employer only ──
router.post(
  "/jobs",
  protect,
  authorize("employer"),
  jobController.employerCreateJob
)

router.get(
  "/jobs/my-jobs",
  protect,
  authorize("employer"),
  jobController.employerGetJobs
)

router.patch(
  "/jobs/:id",
  protect,
  authorize("employer"),
  jobController.employerUpdateJob
)

router.delete(
  "/jobs/:id",
  protect,
  authorize("employer"),
  jobController.employerDeleteJob
)

export default router