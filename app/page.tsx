import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorks } from "@/components/how-it-works"
import { SizeComparison } from "@/components/size-comparison"
import { FeaturesGrid } from "@/components/features-grid"
import { MannequinPreview } from "@/components/mannequin-preview"
import { Testimonials } from "@/components/testimonials"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <SizeComparison />
      <FeaturesGrid />
      <MannequinPreview />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  )
}
