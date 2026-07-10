import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { AuthRequest } from "../middleware/auth"

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  )
}

// ── REGISTER ──
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" })
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Build user object based on role
    let userData: any = {
      name,
      email,
      password: hashedPassword,
      role: role || "jobseeker",
    }

    // If employer — collect extra company details
    if (role === "employer") {
      const {
        companyName,
        companyWebsite,
        companyDescription,
        companySize,
        industry,
        companyAddress,
        cacNumber,
      } = req.body

      // Validate required employer fields
      if (!companyName || !industry || !companyAddress) {
        res.status(400).json({
          message: "Company name, industry and address are required for employers"
        })
        return
      }

      userData = {
        ...userData,
        companyName,
        companyWebsite,
        companyDescription,
        companySize,
        industry,
        companyAddress,
        cacNumber,
      }
    }

    // Create user
    const user = await User.create(userData)

    // Generate token
    const token = generateToken(user._id.toString(), user.role)

    // Return user without password
    res.status(201).json({
      message: "Registration successful",
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

// ── LOGIN ──
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
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


export default { register, login, getProfile }