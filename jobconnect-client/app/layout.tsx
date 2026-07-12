import type { Metadata } from "next"
import { Bricolage_Grotesque, DM_Sans } from "next/font/google"
import "./globals.css"

// Bold font for headings
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage",
})

// Thin font for body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "JobConnect — Nigeria's Junior Tech Job Board",
  description: "Connecting fresh graduates and junior developers with startups and SMEs across Nigeria.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  )
}