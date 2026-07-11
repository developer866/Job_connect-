import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { AuthRequest } from "../middleware/auth"
import crypto from "crypto"
import { sendWelcomeEmail, sendPasswordResetEmail } from "../config/email"

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  )
}


// ── Update register to send welcome email ──
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let userData: any = {
      name, email,
      password: hashedPassword,
      role: role || "jobseeker",
    }

    if (role === "employer") {
      const {
        companyName, companyWebsite, companyDescription,
        companySize, industry, companyAddress, cacNumber,
      } = req.body

      if (!companyName || !industry || !companyAddress) {
        res.status(400).json({
          message: "Company name, industry and address are required for employers"
        })
        return
      }

      userData = {
        ...userData,
        companyName, companyWebsite, companyDescription,
        companySize, industry, companyAddress, cacNumber,
      }
    }

    const user = await User.create(userData)
    const token = generateToken(user._id.toString(), user.role)

    // Send welcome email
    await sendWelcomeEmail(user.name, user.email, user.role)

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── FORGOT PASSWORD ──
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      // Don't reveal if email exists or not — security
      res.status(200).json({
        message: "If this email exists you will receive a reset link shortly"
      })
      return
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // Hash token before saving to DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    // Save to user — expires in 15 minutes
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()

    // Send email with raw token (not hashed)
    await sendPasswordResetEmail(user.name, user.email, resetToken)

    res.status(200).json({
      message: "If this email exists you will receive a reset link shortly"
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

// ── RESET PASSWORD ──
const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const  token  = req.params.token as string
    const { password } = req.body

    // Hash the token from URL to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    // Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset token" })
      return
    }

    // Update password
    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: "Password reset successful — please login" })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}



// ── LOGIN ──
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      res.status(404).json({ message: "No account found with this email" })
      return
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: "Incorrect password" })
      return
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role)

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === "employer" && {
          companyName: user.companyName,
          industry: user.industry,
        })
      }
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}



const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password")
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}


export default { register, login, getProfile, forgotPassword, resetPassword }