import type React from "react"
import type { Metadata } from "next"
import { Instrument_Sans, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FitCheck - See How Clothes Fit Before You Buy",
  description:
    "Revolutionary fit technology. Upload your measurements once and visualize how any garment will look on your unique body. No more returns, no more guessing.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${cormorantGaramond.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
