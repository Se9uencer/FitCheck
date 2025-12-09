"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Shirt, Eye, Zap, ArrowRight, Check } from "lucide-react"
import { EmailWaitlistModal } from "@/components/email-waitlist-modal"

const benefits = [
  {
    icon: Sparkles,
    title: "Your personal fit profile",
    description: "One-time measurement setup creates your unique body profile that works across all brands.",
  },
  {
    icon: Shirt,
    title: "See before you buy",
    description: "Visualize how clothes will fit your specific proportions before clicking purchase.",
  },
  {
    icon: Eye,
    title: "Accurate size recommendations",
    description: "Get the exact size at each brand based on real garment measurements, not guesswork.",
  },
  {
    icon: Zap,
    title: "End the return cycle",
    description: "Stop ordering multiple sizes. Buy with confidence the first time, every time.",
  },
]

const earlyAccessPerks = [
  "Priority access to new features",
  "Direct input on product development",
  "Exclusive early adopter community",
]

export function MannequinPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  return (
    <section id="preview" className="relative py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm uppercase tracking-widest font-medium">What you will get</span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-tight">
              The future of
              <span className="block text-gradient">online shopping</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              We are building the fit technology that fashion has needed for decades. 
              Join early and help shape what comes next.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={i}
                  className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            className="bg-gradient-to-br from-primary/10 via-card to-secondary/20 rounded-3xl border border-primary/20 p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                  <Sparkles className="w-3 h-3" />
                  Early Access
                </div>
                <h3 className="text-2xl md:text-3xl font-serif font-light mb-4">
                  Be first in line
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join our waitlist today and get exclusive benefits when we launch. 
                  Early supporters help us build a product that actually works for real bodies.
                </p>
                <Button 
                  size="lg" 
                  className="rounded-full group"
                  onClick={() => setWaitlistOpen(true)}
                >
                  Join the waitlist 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {earlyAccessPerks.map((perk, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/50"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{perk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <EmailWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </section>
  )
}
