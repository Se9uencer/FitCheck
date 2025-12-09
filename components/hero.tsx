"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { EmailWaitlistModal } from "@/components/email-waitlist-modal"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Scan, ChevronDown } from "lucide-react"

const stats = [
  { value: "40%", label: "of online purchases returned" },
  { value: "$38B", label: "lost to returns yearly" },
  { value: "70%", label: "cite poor fit as reason" },
]

const floatingShapes = [
  { size: 300, x: "10%", y: "20%", delay: 0 },
  { size: 200, x: "80%", y: "30%", delay: 1 },
  { size: 150, x: "70%", y: "70%", delay: 2 },
  { size: 180, x: "20%", y: "80%", delay: 1.5 },
]

export function Hero() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const words = ["you", "your body", "your shape"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToNext = () => {
    document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 grid-background opacity-50" />
      
      {/* Floating gradient orbs */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: `radial-gradient(circle, oklch(0.72 0.14 45 / 0.4), transparent 70%)`,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary">
              <Sparkles className="w-4 h-4" />
              <span>Revolutionary fit technology</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            See how clothes fit
            <br />
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWord}
                  className="text-gradient inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {words[currentWord]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Upload your measurements once. We&apos;ll generate a mannequin that matches your exact proportions. 
            See realistic fabric drape before you buy — no more guessing, no more returns.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="group h-14 px-8 text-base font-medium rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setWaitlistOpen(true)}
            >
              Get early access
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-base font-medium rounded-full border-border hover:bg-secondary" 
              asChild
            >
              <Link href="/survey" className="flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Take fit survey
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center space-y-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-serif font-light text-gradient">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs uppercase tracking-widest">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <EmailWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </section>
  )
}
