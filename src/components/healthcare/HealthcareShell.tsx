import type { ReactNode } from 'react'
import Header from '@/components/healthcare/Header'
import Footer from '@/components/healthcare/Footer'

type HealthcareShellProps = {
  children: ReactNode
}

export default function HealthcareShell({ children }: HealthcareShellProps) {
  return (
    <div className="healthcare min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
