// Auth layout — used by /login and other unauthenticated routes
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-shell">{children}</div>
}
