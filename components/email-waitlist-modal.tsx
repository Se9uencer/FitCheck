"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type EmailWaitlistModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailWaitlistModal({ open, onOpenChange }: EmailWaitlistModalProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    const { error } = await supabase.from("waitlist").insert({ email })
    if (error) {
      setStatus("error")
      return
    }
    setStatus("success")
    setEmail("")
  }

  if (!open || !mounted) return null

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <Card className="relative z-[101] w-[92%] max-w-md border-border/50 shadow-xl">
        <CardContent className="p-6 space-y-5">
          {status !== "success" ? (
            <>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-semibold">Join waitlist</h3>
                <p className="text-sm text-muted-foreground">
                  Get early access to try-ons tailored to your body. Be the first to test new drops.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Joining..." : "Join"}
                </Button>
              </form>
              {status === "error" && (
                <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
              )}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-3 py-4">
              <h3 className="text-xl font-semibold">Thanks for joining!</h3>
              <p className="text-sm text-muted-foreground">We’ll email you as soon as we have early access.</p>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return createPortal(modal, document.body)
}


