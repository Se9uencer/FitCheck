"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { 
  Sparkles, 
  Eye, 
  Target, 
  Scale, 
  Ruler, 
  Layers,
  ArrowRight,
  Zap 
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI Body Classification",
    description: "Our algorithm analyzes your proportions to determine your unique body shape profile. Not just height and weight — actual proportions.",
    highlight: "98% accuracy",
    color: "oklch(0.72 0.14 45)",
  },
  {
    icon: Eye,
    title: "Realistic Fabric Simulation",
    description: "Watch how cotton drapes differently than silk. See stretch, gather, and flow on your exact body shape.",
    highlight: "Coming soon",
    color: "oklch(0.65 0.12 200)",
  },
  {
    icon: Target,
    title: "Personalized Recommendations",
    description: "Get size suggestions based on how you actually like clothes to fit — slim, relaxed, or oversized.",
    highlight: "Your preferences",
    color: "oklch(0.7 0.15 150)",
  },
  {
    icon: Scale,
    title: "Multi-Brand Size Data",
    description: "We've measured thousands of garments. Know exactly how Zara M compares to H&M M.",
    highlight: "500+ brands",
    color: "oklch(0.65 0.13 300)",
  },
  {
    icon: Ruler,
    title: "Smart Measurement Guide",
    description: "Our guided tool helps you take accurate measurements at home. No measuring tape? We've got alternatives.",
    highlight: "2 min setup",
    color: "oklch(0.6 0.1 80)",
  },
  {
    icon: Layers,
    title: "Virtual Wardrobe",
    description: "Save items you love. Build outfits. See how new pieces work with what you already own.",
    highlight: "Mix & match",
    color: "oklch(0.68 0.14 340)",
  },
]

export function FeaturesGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-2xl">
              <span className="text-primary text-sm uppercase tracking-widest font-medium">Features</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
                Technology that
                <span className="block text-gradient">understands fit</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-md">
              We&apos;re building the most comprehensive fit prediction platform. 
              Here&apos;s what makes us different.
            </p>
          </motion.div>

          {/* Features grid - bento-style layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isHovered = hoveredIndex === index
              const isLarge = index === 0 || index === 3

              return (
                <motion.div
                  key={index}
                  className={`group relative p-6 md:p-8 rounded-2xl bg-card border border-border/50 overflow-hidden ${
                    isLarge ? "lg:col-span-2 lg:row-span-1" : ""
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ y: -4 }}
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 100%, ${feature.color.replace(")", " / 0.1)")}, transparent 70%)`,
                    }}
                  />

                  {/* Content */}
                  <div className={`relative z-10 ${isLarge ? "flex flex-col md:flex-row md:items-start gap-6" : ""}`}>
                    {/* Icon */}
                    <motion.div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-0 flex-shrink-0 transition-colors duration-300"
                      style={{ 
                        backgroundColor: isHovered 
                          ? feature.color.replace(")", " / 0.2)") 
                          : "oklch(0.2 0.01 250)"
                      }}
                    >
                      <Icon 
                        className="w-7 h-7 transition-colors duration-300"
                        style={{ color: isHovered ? feature.color : "oklch(0.6 0.01 250)" }}
                      />
                    </motion.div>

                    <div className="flex-1">
                      {/* Highlight badge */}
                      <div className="mt-3 mb-3">
                        <span 
                          className="inline-flex items-center gap-2 px-2.75 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${feature.color.replace(")", " / 0.15)")}`,
                            color: feature.color
                          }}
                        >
                          <Zap className="w-3 h-3" />
                          {feature.highlight}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`font-semibold mb-2 ${isLarge ? "text-2xl" : "text-xl"}`}>
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Learn more link */}
                      <motion.div
                        className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: feature.color }}
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${feature.color.replace(")", " / 0.1)")}, transparent 70%)`,
                    }}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-muted-foreground mb-4">
              And we&apos;re just getting started. More features launching soon.
            </p>
            <a href="/survey" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
              Help shape what we build next
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
