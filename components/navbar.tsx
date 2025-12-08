"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { EmailWaitlistModal } from "@/components/email-waitlist-modal"

export function Navbar() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-semibold text-foreground">
          FitCheck
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("demo")}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Demo
          </button>
          <Link
            href="/survey"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Survey
          </Link>
          <Button onClick={() => setWaitlistOpen(true)} className="rounded-full">
            Join waitlist
          </Button>
        </div>
      </div>
      <EmailWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </nav>
  )
}
