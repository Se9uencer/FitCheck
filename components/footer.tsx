"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Twitter, Instagram, Linkedin, Mail, ArrowUpRight } from "lucide-react"

const footerLinks = {
  product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Size Tool", href: "#size-tool" },
    { label: "Pricing", href: "#", coming: true },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#", coming: true },
    { label: "Careers", href: "#", coming: true },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@fitcheck.com", label: "Email" },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#") && href !== "#") {
      const element = document.getElementById(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="relative container mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link 
              href="/" 
              className="text-2xl font-serif font-light text-foreground hover:text-primary transition-colors"
            >
              FitCheck
            </Link>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-sm">
              Revolutionary fit technology that shows you how clothes will look on your unique body before you buy.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("#") && link.href !== "#" ? (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
                    >
                      {link.label}
                      {link.coming && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
                    >
                      {link.label}
                      {link.coming && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
                  >
                    {link.label}
                    {link.coming && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitCheck. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/survey" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Take fit survey
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-sm text-muted-foreground">
              Built with ♡ for better fashion
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
