// POST /api/auth/register
// POST /api/auth/login

import {Router} from "express";
import authController from "../controllers/authController"
import { protect } from "../middleware/auth";
import bcrypt from "bcrypt"
import User from "../models/User"

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [jobseeker, employer]
 *               companyName:
 *                 type: string
 *               industry:
 *                 type: string
 *               companyAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Email already registered
 *
 * /api/auth/login:
 *   post:
 *     summary: Login user or employer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Incorrect password
 *
 * /api/auth/profile:
 *   get:
 *     summary: Get logged in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authorized
 */

const router = Router()
router.post('/auth/login',authController.login)
router.post('/auth/register',authController.register)
router.get("/auth/profile",protect,authController.getProfile)

export default router;
