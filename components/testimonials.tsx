"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    quote: "I've returned 3 out of every 5 online orders for the past decade. The sizing inconsistency across brands is maddening. This is exactly what I've been waiting for.",
    name: "Sarah K.",
    role: "Fashion enthusiast",
    rating: 5,
    avatar: "SK",
  },
  {
    quote: "As someone with an athletic build, I've never found clothes that fit right off the rack. Being able to preview fit before buying would be game-changing.",
    name: "Marcus T.",
    role: "Fitness instructor",
    rating: 5,
    avatar: "MT",
  },
  {
    quote: "I work in fashion retail and see the return problem daily. Brands need this technology. Customers need this technology. It's inevitable.",
    name: "Priya R.",
    role: "Retail manager",
    rating: 5,
    avatar: "PR",
  },
  {
    quote: "Online shopping anxiety is real. The stress of not knowing if something will fit has kept me from trying new brands. This could change everything.",
    name: "Jennifer L.",
    role: "Working professional",
    rating: 5,
    avatar: "JL",
  },
]

const stats = [
  { value: "2,400+", label: "Waitlist signups" },
  { value: "89%", label: "Say fit is #1 concern" },
  { value: "4.9", label: "Average interest rating" },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)

  const navigate = (direction: number) => {
    setActiveIndex((prev) => {
      const newIndex = prev + direction
      if (newIndex < 0) return testimonials.length - 1
      if (newIndex >= testimonials.length) return 0
      return newIndex
    })
  }

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      
      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm uppercase tracking-widest font-medium">Early Interest</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
              The frustration is
              <span className="block text-gradient">universal</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Thousands have shared their fit struggles. Here&apos;s why they&apos;re excited about what we&apos;re building.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-serif text-gradient font-light">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Testimonial carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main testimonial */}
            <div className="relative bg-card rounded-3xl border border-border/50 p-8 md:p-12 max-w-3xl mx-auto">
              {/* Quote icon */}
              <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="pt-4">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-serif font-light leading-relaxed mb-8">
                  &ldquo;{testimonials[activeIndex].quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[activeIndex].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute bottom-8 right-8 flex gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full border border-border hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="w-10 h-10 rounded-full border border-border hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeIndex === i ? "w-6 bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Background testimonial cards (decorative) */}
            <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 w-64 h-48 rounded-2xl bg-card/50 border border-border/30 -rotate-6 -z-10" />
            <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-64 h-48 rounded-2xl bg-card/50 border border-border/30 rotate-6 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

