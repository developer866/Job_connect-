import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1a2e25] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border bg-white px-4 py-3 text-sm font-light
            text-[#1a2e25] placeholder:text-[#9CA3AF]
            focus:outline-none focus:ring-2 focus:ring-[#BCB6FF] focus:border-transparent
            transition duration-200
            ${error
              ? "border-red-400 focus:ring-red-200"
              : "border-[#496F5D]/30"
            }
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-xs font-light text-[#9CA3AF]">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
export default Input