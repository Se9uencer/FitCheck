"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Check, Sparkles } from "lucide-react"

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

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStatus("idle")
      setEmail("")
    }
  }, [open])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

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

  if (!mounted) return null

  const modal = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          
          {/* Modal */}
          <motion.div
            className="relative z-[101] w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-8">
              {status !== "success" ? (
                <>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>

                  {/* Heading */}
                  <h3 className="text-2xl font-serif font-light mb-2">
                    Get early access
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Be among the first to experience fit technology that actually works. 
                    We&apos;ll notify you as soon as we launch.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 pl-4 pr-4 rounded-xl bg-secondary border-border focus:border-primary"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={status === "loading"}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                      {status === "loading" ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        "Join waitlist"
                      )}
                    </Button>
                  </form>

                  {status === "error" && (
                    <motion.p
                      className="text-sm text-destructive mt-4 text-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Something went wrong. Please try again.
                    </motion.p>
                  )}

                  {/* Trust elements */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Free for all users
                      </span>
                      <span>•</span>
                      <span>No spam, ever</span>
                    </div>
                  </div>
                </>
              ) : (
                <motion.div
                  className="text-center py-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Success icon */}
                  <motion.div
                    className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                  >
                    <Check className="w-8 h-8 text-green-500" />
                  </motion.div>

                  <h3 className="text-2xl font-serif font-light mb-2">
                    You&apos;re on the list!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;ll email you as soon as early access opens. 
                    Get ready to never guess your size again.
                  </p>
                  
                  <Button 
                    onClick={() => onOpenChange(false)}
                    className="rounded-xl"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
