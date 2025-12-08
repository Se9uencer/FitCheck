import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Eye, Target, Scale } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI body shape classification",
  },
  {
    icon: Eye,
    title: "3D mannequin preview (coming soon)",
  },
  {
    icon: Target,
    title: "Fit recommendations by category",
  },
  {
    icon: Scale,
    title: "Multi-brand size consistency data",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="container px-4 md:px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need for the perfect fit</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border/50 shadow-sm">
                <CardContent className="pt-8 pb-8 px-6 space-y-4 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-balance leading-snug">{feature.title}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
