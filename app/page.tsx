import { submitWaitlist } from "@/actions/submitWaitlist"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturesGrid } from "@/components/features-grid"
import { DemoPlaceholder } from "@/components/demo-placeholder"
import { Footer } from "@/components/footer"

export default function Home() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    await submitWaitlist(email);
  }

  return (
    <main className="min-h-screen">
      <div className="p-8">
        <form action={handleSubmit} className="flex gap-2 max-w-sm">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="border p-2 flex-1 rounded"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Join waitlist
          </button>
        </form>
      </div>
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <DemoPlaceholder />
      <Footer />
    </main>
  )
}
