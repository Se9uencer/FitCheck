"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Scan, Box, Eye, Check } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Scan,
    title: "Share your measurements",
    description: "Quick and private. Enter your key measurements or use our guided measurement tool. Takes 2 minutes.",
    visual: "measurements",
  },
  {
    number: "02",
    icon: Box,
    title: "We build your avatar",
    description: "Our AI creates a proportionally accurate mannequin that reflects your unique body shape.",
    visual: "avatar",
  },
  {
    number: "03",
    icon: Eye,
    title: "See clothes on you",
    description: "Watch how fabric drapes, where seams fall, and how different sizes will actually fit your body.",
    visual: "preview",
  },
]

// Animated measurement visualization
function MeasurementVisual({ active }: { active: boolean }) {
  const measurements = [
    { label: "Chest", value: "38\"", y: 20 },
    { label: "Waist", value: "32\"", y: 45 },
    { label: "Hips", value: "40\"", y: 70 },
  ]

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Body silhouette */}
      <motion.div
        className="relative w-32 h-64 rounded-full bg-gradient-to-b from-primary/20 to-primary/5"
        style={{ borderRadius: "50% 50% 45% 45% / 30% 30% 70% 70%" }}
        animate={active ? { scale: [0.95, 1], opacity: [0.5, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Measurement lines */}
        {measurements.map((m, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
            style={{ top: `${m.y}%` }}
            initial={{ opacity: 0, x: -20 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: i * 0.2, duration: 0.4 }}
          >
            <div className="w-20 h-[1px] bg-primary" />
            <div className="whitespace-nowrap text-xs">
              <span className="text-muted-foreground">{m.label}</span>
              <span className="ml-1 text-primary font-medium">{m.value}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// Animated avatar building visualization
function AvatarVisual({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative"
        animate={active ? { rotateY: [0, 10, -10, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* 3D mannequin representation */}
        <motion.div
          className="w-28 h-56 rounded-2xl bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 relative overflow-hidden"
          style={{ borderRadius: "45% 45% 40% 40% / 25% 25% 75% 75%" }}
          animate={active ? { scale: 1 } : { scale: 0.9 }}
        >
          {/* Scanning lines */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={active ? { top: ["0%", "100%", "0%"] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "linear-gradient(0deg, transparent 49%, oklch(0.72 0.14 45 / 0.5) 50%, transparent 51%), linear-gradient(90deg, transparent 49%, oklch(0.72 0.14 45 / 0.5) 50%, transparent 51%)",
            backgroundSize: "20px 20px",
          }} />
        </motion.div>
        
        {/* Processing indicator */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1"
          animate={active ? { opacity: 1 } : { opacity: 0 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={active ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Animated preview visualization
function PreviewVisual({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div className="relative">
        {/* Mannequin with clothes */}
        <motion.div
          className="w-28 h-56 relative"
          animate={active ? { scale: 1 } : { scale: 0.9 }}
        >
          {/* Body */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/10"
            style={{ borderRadius: "45% 45% 40% 40% / 25% 25% 75% 75%" }}
          />
          
          {/* Shirt overlay with drape effect */}
          <motion.div
            className="absolute top-[15%] left-0 right-0 h-[40%] bg-gradient-to-b from-primary/50 to-primary/30 rounded-lg"
            animate={active ? { 
              clipPath: [
                "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)",
                "polygon(5% 0, 95% 0, 100% 100%, 0% 100%)",
                "polygon(10% 0, 90% 0, 100% 100%, 0% 100%)",
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Fit indicators */}
          <motion.div
            className="absolute top-[20%] -right-8 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.5 }}
          >
            <Check className="w-3 h-3 text-green-500" />
            <span className="text-[10px] text-green-500">Perfect fit</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="relative py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm uppercase tracking-widest font-medium">How it works</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
              Three steps to
              <span className="block text-gradient">perfect fit</span>
            </h2>
          </motion.div>

          {/* Steps - horizontal on desktop, vertical on mobile */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Step list */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = activeStep === index

                return (
                  <motion.div
                    key={index}
                    className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? "bg-card border border-primary/30" 
                        : "bg-transparent border border-transparent hover:bg-card/50"
                    }`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setActiveStep(index)}
                  >
                    <div className="flex gap-5">
                      {/* Step number */}
                      <div className={`text-5xl font-serif font-light transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground/30"
                      }`}>
                        {step.number}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isActive ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <Icon className={`w-5 h-5 transition-colors ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Active indicator line */}
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-primary rounded-full"
                      initial={{ height: 0 }}
                      animate={{ height: isActive ? "60%" : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                )
              })}
            </div>

            {/* Right: Visualization */}
            <motion.div
              className="relative h-[400px] lg:h-[500px] rounded-2xl bg-gradient-to-br from-card to-secondary/20 border border-border/50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 grid-background opacity-30" />
              
              {/* Step visualizations */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {activeStep === 0 && <MeasurementVisual active={true} />}
                {activeStep === 1 && <AvatarVisual active={true} />}
                {activeStep === 2 && <PreviewVisual active={true} />}
              </div>

              {/* Step indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeStep === i ? "w-8 bg-primary" : "bg-muted-foreground/30"
                    }`}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
