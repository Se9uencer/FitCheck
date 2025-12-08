"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { EmailWaitlistModal } from "@/components/email-waitlist-modal"

export function Hero() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  return (
    <section className="container px-4 md:px-6 py-16 md:py-24 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            See how clothes look on <span className="text-primary">you</span> before you buy.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            Upload your measurements once. Get a realistic mannequin designed to match your shape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="rounded-full text-base"
              onClick={() => setWaitlistOpen(true)}
            >
              Join waitlist
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base bg-transparent" asChild>
              <Link href="/survey">Take a 30 second fit survey</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/60 shadow-lg">
          <img src="/abstract-flowing-fabric-soft-beige-cream-aesthetic.jpg" alt="Abstract flowing fabric" className="w-full h-full object-cover" />
        </div>
      </div>
      <EmailWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </section>
  )
}
