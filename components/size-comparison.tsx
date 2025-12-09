"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { AlertTriangle } from "lucide-react"

// Brand sizing data visualization
const brandSizes = [
  { brand: "Zara", chest: 38, label: "Slim", color: "oklch(0.65 0.15 25)" },
  { brand: "H&M", chest: 40, label: "Regular", color: "oklch(0.7 0.12 200)" },
  { brand: "Uniqlo", chest: 39, label: "Relaxed", color: "oklch(0.65 0.15 350)" },
  { brand: "Gap", chest: 41, label: "Classic", color: "oklch(0.7 0.1 100)" },
]

export function SizeComparison() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="size-tool" className="relative py-20 md:py-28 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary text-sm uppercase tracking-widest font-medium">The sizing chaos</span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-serif font-light leading-tight">
              &quot;Size M&quot; means
              <span className="block text-gradient">nothing</span>
            </h2>
          </motion.div>

          {/* Visual comparison - simplified bar chart */}
          <motion.div
            className="bg-card rounded-2xl border border-border/50 p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                Chest measurement for &quot;Size Medium&quot; across popular brands
              </p>
            </div>

            {/* Brand bars */}
            <div className="space-y-4">
              {brandSizes.map((item, i) => {
                // Calculate bar width relative to max (41") with a base of 36"
                const minSize = 36
                const maxSize = 42
                const percentage = ((item.chest - minSize) / (maxSize - minSize)) * 100
                
                return (
                  <motion.div
                    key={item.brand}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <div className="w-20 text-sm font-medium text-right">
                      {item.brand}
                    </div>
                    <div className="flex-1 h-10 bg-secondary/30 rounded-lg overflow-hidden relative">
                      <motion.div
                        className="h-full rounded-lg flex items-center justify-end pr-3"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                      >
                        <span className="text-sm font-bold text-white drop-shadow-sm">
                          {item.chest}&quot;
                        </span>
                      </motion.div>
                    </div>
                    <div className="w-16 text-xs text-muted-foreground">
                      {item.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Scale indicator */}
            <div className="mt-6 flex justify-between text-xs text-muted-foreground px-24">
              <span>36&quot;</span>
              <span>38&quot;</span>
              <span>40&quot;</span>
              <span>42&quot;</span>
            </div>

            {/* Warning callout */}
            <motion.div
              className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Up to 3&quot; difference in the same &quot;size&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  That&apos;s why you order multiple sizes and return most of them. 
                  FitCheck will know exactly which size fits you at each brand.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
