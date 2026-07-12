// Auth pages don't need the Navbar
// This layout overrides the root layout for auth pages

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}