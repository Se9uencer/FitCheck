"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { EmailWaitlistModal } from "@/components/email-waitlist-modal"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.14 45), transparent 70%)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.12 200), transparent 70%)" }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Launching Q2 2025</span>
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light leading-tight mb-6">
            Never guess your size
            <span className="block text-gradient">again</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands who are tired of the return cycle. 
            Be first to experience fit technology that actually works.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group h-14 px-8 text-base font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setWaitlistOpen(true)}
            >
              Join the waitlist
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-base font-medium rounded-full border-border hover:bg-secondary" 
              asChild
            >
              <Link href="/survey">
                Take fit survey first
              </Link>
            </Button>
          </div>

          {/* Trust elements */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Free for all users
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Cancel anytime
            </div>
          </motion.div>
        </motion.div>
      </div>

      <EmailWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </section>
  )
}

