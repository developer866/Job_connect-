import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

export const protect = (req: AuthRequest,res: Response,next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    // check if user is logged in
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Not authorized — no token" })
      return
    }

    // Verify token
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string; role: string }

    // Attach user to request
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Not authorized — invalid token" })
  }
}

// Role-based access control
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Role ${req.user?.role} is not authorized to access this route`
      })
      return
    }
    next()
  }
}