"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductImporter } from "@/components/product-importer"
import { Sparkles, ShoppingBag, Ruler, Box } from "lucide-react"

const features = [
  {
    icon: ShoppingBag,
    title: "Amazon Import",
    description: "Paste any Amazon clothing link to extract size and fit data",
  },
  {
    icon: Ruler,
    title: "Size Analysis",
    description: "Get detailed measurements and size charts automatically",
  },
  {
    icon: Box,
    title: "3D Preview",
    description: "Coming soon - visualize clothes on your personalized model",
  },
]

export default function TryOnPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Beta Feature</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
              Virtual
              <span className="block text-gradient">Try-On</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Import clothing from Amazon and see how it fits before you buy. 
              Get detailed size information and measurements instantly.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card border border-border/50 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Product Importer Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <ProductImporter />
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 md:py-16 border-t border-border/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-serif font-light mb-4">
              3D Model Coming Soon
            </h2>
            <p className="text-muted-foreground">
              We're building an advanced 3D fitting system that will let you visualize 
              exactly how clothes will look and fit on your unique body shape. 
              Enter your measurements and see any garment on your personalized avatar.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

