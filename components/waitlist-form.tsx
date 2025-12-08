"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Insert Supabase logic here later
    console.log("Email submitted:", email)

    // Simulate success
    setStatus("success")
    setEmail("")

    setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <section id="waitlist" className="container px-4 md:px-6 py-16 md:py-24">
      <Card className="max-w-2xl mx-auto border-border/50 shadow-lg">
        <CardContent className="pt-12 pb-12 px-8">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Join waitlist</h2>
              <p className="text-lg text-muted-foreground">Be the first to experience precision in fashion</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 text-base rounded-full"
                />
                <Button type="submit" size="lg" className="rounded-full sm:w-auto">
                  Join waitlist
                </Button>
              </div>

              {status === "success" && (
                <p className="text-sm text-primary font-medium">✓ Thank you! We'll be in touch soon.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive font-medium">This email has already joined the waitlist.</p>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
