"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { EmailWaitlistModal } from "@/components/email-waitlist-modal"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Benefits", href: "#preview" },
  { label: "Survey", href: "/survey" },
]

export function Navbar() {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false)
    if (href.startsWith("#")) {
      const element = document.getElementById(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-xl md:text-2xl font-serif font-light text-foreground hover:text-primary transition-colors"
            >
              FitCheck
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.href.startsWith("#") ? (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setWaitlistOpen(true)} 
                className="hidden sm:flex h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                Get early access
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-secondary transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu content */}
            <motion.div
              className="absolute top-20 left-0 right-0 p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    {link.href.startsWith("#") ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="w-full text-left px-4 py-4 text-2xl font-serif font-light text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-4 text-2xl font-serif font-light text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setWaitlistOpen(true)
                  }} 
                  className="w-full h-14 rounded-full text-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  Get early access
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EmailWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </>
  )
}
