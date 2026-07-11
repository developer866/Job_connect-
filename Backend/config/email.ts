import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
})

// ── Email templates ──
export const sendWelcomeEmail = async (
  name: string,
  email: string,
  role: string
): Promise<void> => {
  const isEmployer = role === "employer"

  await transporter.sendMail({
    from: `"JobConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to JobConnect 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563EB; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">JobConnect</h1>
          <p style="color: #BFDBFE; margin: 8px 0 0;">Nigeria's Junior Tech Job Board</p>
        </div>

        <div style="padding: 32px; background: #fff;">
          <h2 style="color: #111827;">Welcome, ${name}! 👋</h2>
          <p style="color: #6B7280; line-height: 1.6;">
            Your account has been created successfully as a 
            <strong>${isEmployer ? "Company/Employer" : "Jobseeker"}</strong>.
          </p>

          ${isEmployer ? `
          <p style="color: #6B7280; line-height: 1.6;">
            You can now post jobs and start finding the best junior tech talent in Nigeria.
            All job postings go through a quick admin review before going live.
          </p>
          <a href="${process.env.FRONTEND_URL}/employer/post-job"
            style="display: inline-block; background: #2563EB; color: white;
            padding: 12px 28px; border-radius: 8px; text-decoration: none;
            font-weight: bold; margin-top: 16px;">
            Post Your First Job →
          </a>
          ` : `
          <p style="color: #6B7280; line-height: 1.6;">
            You can now browse hundreds of junior tech opportunities and apply with one click.
            Complete your profile to stand out to employers.
          </p>
          <a href="${process.env.FRONTEND_URL}/jobs"
            style="display: inline-block; background: #2563EB; color: white;
            padding: 12px 28px; border-radius: 8px; text-decoration: none;
            font-weight: bold; margin-top: 16px;">
            Browse Jobs →
          </a>
          `}
        </div>

        <div style="background: #F9FAFB; padding: 24px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
            © 2025 JobConnect. Built with ❤️ in Nigeria.
          </p>
        </div>
      </div>
    `,
  })
}

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`

  await transporter.sendMail({
    from: `"JobConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password — JobConnect",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563EB; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">JobConnect</h1>
          <p style="color: #BFDBFE; margin: 8px 0 0;">Password Reset Request</p>
        </div>

        <div style="padding: 32px; background: #fff;">
          <h2 style="color: #111827;">Hi ${name},</h2>
          <p style="color: #6B7280; line-height: 1.6;">
            We received a request to reset your password. 
            Click the button below to set a new password.
          </p>
          <p style="color: #6B7280; line-height: 1.6;">
            This link expires in <strong>15 minutes</strong>.
          </p>

          <a href="${resetUrl}"
            style="display: inline-block; background: #2563EB; color: white;
            padding: 12px 28px; border-radius: 8px; text-decoration: none;
            font-weight: bold; margin-top: 16px;">
            Reset Password →
          </a>

          <p style="color: #9CA3AF; font-size: 13px; margin-top: 24px;">
            If you didn't request this, ignore this email. Your password won't change.
          </p>

          <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin-top: 16px;">
            <p style="color: #6B7280; font-size: 13px; margin: 0;">
              Or copy this link: <br/>
              <span style="color: #2563EB; word-break: break-all;">${resetUrl}</span>
            </p>
          </div>
        </div>

        <div style="background: #F9FAFB; padding: 24px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
            © 2025 JobConnect. Built with ❤️ in Nigeria.
          </p>
        </div>
      </div>
    `,
  })
}

export default transporter