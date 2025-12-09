"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Users, Ruler, RotateCcw, Frown, Package, CreditCard } from "lucide-react"

const problems = [
  {
    icon: Users,
    title: "Models don't look like you",
    description: "Fashion models represent less than 2% of body types. You deserve to see how clothes look on your shape.",
    stat: "98%",
    statLabel: "underrepresented",
  },
  {
    icon: Ruler,
    title: "Sizing is chaos",
    description: "A size M at Zara is completely different from H&M. Every brand plays by different rules.",
    stat: "∞",
    statLabel: "size variations",
  },
  {
    icon: RotateCcw,
    title: "Returns destroy margins",
    description: "The return process is exhausting for you and devastating for brands. Everyone loses.",
    stat: "30%",
    statLabel: "return rate",
  },
]

const painPoints = [
  { icon: Frown, text: "Order 3 sizes, return 2" },
  { icon: Package, text: "Wait weeks, disappointed" },
  { icon: CreditCard, text: "Wasted money on bad fits" },
]

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="problem" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm uppercase tracking-widest font-medium">The problem</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
              Online shopping is
              <span className="block text-gradient">broken by design</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Fashion brands optimize for fantasy, not fit. The result? Billions wasted on returns, 
              and millions of frustrated shoppers giving up on online fashion entirely.
            </p>
          </motion.div>

          {/* Problem cards - asymmetric grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {problems.map((problem, index) => {
              const Icon = problem.icon
              return (
                <motion.div
                  key={index}
                  className={`relative group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 ${
                    index === 0 ? "lg:row-span-2" : ""
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Hover gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), oklch(0.72 0.14 45 / 0.06), transparent 40%)",
                    }}
                  />

                  <div className="relative z-10 h-full flex flex-col">
                    {/* Stat badge */}
                    <div className="absolute top-0 right-0 text-right">
                      <div className="text-3xl md:text-4xl font-serif text-gradient font-light">
                        {problem.stat}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">
                        {problem.statLabel}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <h3 className={`font-semibold mb-3 ${index === 0 ? "text-2xl" : "text-xl"}`}>
                      {problem.title}
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed flex-grow ${index === 0 ? "text-base" : "text-sm"}`}>
                      {problem.description}
                    </p>

                    {/* Animated underline on hover */}
                    <motion.div
                      className="mt-6 h-[2px] bg-gradient-to-r from-primary to-primary/30"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredIndex === index ? "100%" : "40px" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Pain points row - fixed hover colors */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {painPoints.map((point, i) => {
              const Icon = point.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3 rounded-full border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary/70" />
                  <span className="text-sm text-muted-foreground">{point.text}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
