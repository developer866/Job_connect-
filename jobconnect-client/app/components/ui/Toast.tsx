"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, X, AlertCircle } from "lucide-react"

interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) {

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: "bg-[#496F5D] text-[#F1FEC6]",
    error: "bg-red-500 text-white",
    info: "bg-[#BCB6FF] text-[#2d2a6e]",
  }

  const icons = {
    success: <CheckCircle className="h-5 w-5 shrink-0" />,
    error: <XCircle className="h-5 w-5 shrink-0" />,
    info: <AlertCircle className="h-5 w-5 shrink-0" />,
  }

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 flex items-center gap-3
      rounded-xl px-5 py-3 shadow-lg font-body text-sm font-light
      transition-all duration-300
      ${styles[type]}
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
    `}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Hook to use toast easily
import { useCallback } from "react"
import { createRoot } from "react-dom/client"

export const useToast = () => {
  const showToast = useCallback((
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const handleClose = () => {
      root.unmount()
      document.body.removeChild(container)
    }

    root.render(
      <Toast message={message} type={type} onClose={handleClose} />
    )
  }, [])

  return { showToast }
}