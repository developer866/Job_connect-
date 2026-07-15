"use client"

import type { Metadata } from "next"
import { Bricolage_Grotesque, DM_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/app/components/layout/Navbar"
import Footer from "@/app/components/layout/Footer"
import { usePathname } from "next/navigation"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
})

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide navbar and footer on dashboard pages
  const isDashboard =
    pathname.startsWith("/jobseeker") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/admin")

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={isDashboard ? "" : "min-h-screen"}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${dmSans.variable}`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  )
}