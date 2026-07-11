import { body, validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

// ── Reusable validation checker ──
// Add this to any route after validation rules
export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : "unknown",
        message: err.msg,
      })),
    })
    return
  }
  next()
}

// ── Auth validation rules ──
export const validateRegister = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters")
    .isLength({ max: 50 }).withMessage("Name must not exceed 50 characters")
    .trim(),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["jobseeker", "employer"]).withMessage("Role must be jobseeker or employer"),

  // Employer specific validation
  body("companyName")
    .if(body("role").equals("employer"))
    .notEmpty().withMessage("Company name is required for employers"),

  body("industry")
    .if(body("role").equals("employer"))
    .notEmpty().withMessage("Industry is required for employers"),

  body("companyAddress")
    .if(body("role").equals("employer"))
    .notEmpty().withMessage("Company address is required for employers"),

  checkValidation
]

export const validateLogin = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  checkValidation
]

// ── Job validation rules ──
export const validateJob = [
  body("title")
    .notEmpty().withMessage("Job title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters")
    .isLength({ max: 100 }).withMessage("Title must not exceed 100 characters"),

  body("description")
    .notEmpty().withMessage("Job description is required")
    .isLength({ min: 50 }).withMessage("Description must be at least 50 characters"),

  body("location")
    .notEmpty().withMessage("Location is required")
    .isIn(["Lagos", "Abuja", "Remote", "Hybrid", "Other"])
    .withMessage("Invalid location"),

  body("type")
    .notEmpty().withMessage("Job type is required")
    .isIn(["full-time", "part-time", "contract", "internship"])
    .withMessage("Invalid job type"),

  body("experience")
    .notEmpty().withMessage("Experience level is required")
    .isIn(["entry", "junior", "mid"])
    .withMessage("Experience must be entry, junior or mid"),

  body("deadline")
    .notEmpty().withMessage("Application deadline is required")
    .isISO8601().withMessage("Invalid date format"),

  body("salary.min")
    .optional()
    .isNumeric().withMessage("Minimum salary must be a number"),

  body("salary.max")
    .optional()
    .isNumeric().withMessage("Maximum salary must be a number"),

  checkValidation
]

// ── Application validation rules ──
export const validateApplication = [
  body("coverLetter")
    .notEmpty().withMessage("Cover letter is required")
    .isLength({ min: 100 }).withMessage("Cover letter must be at least 100 characters")
    .isLength({ max: 1000 }).withMessage("Cover letter must not exceed 1000 characters"),

  checkValidation
]