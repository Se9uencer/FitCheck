import { Card, CardContent } from "@/components/ui/card"
import { Users, Ruler, RotateCcw } from "lucide-react"

const problems = [
  {
    icon: Users,
    title: "Models never match your body",
    description: "Buying based on model photos usually leads to disappointment.",
  },
  {
    icon: Ruler,
    title: "Fit varies brand to brand",
    description: "Shirt size M fits totally different at every store.",
  },
  {
    icon: RotateCcw,
    title: "Returns waste time and money",
    description: "If clothes don't feel right, shoppers give up or never try new brands again.",
  },
]

export function ProblemSection() {
  return (
    <section className="container px-4 md:px-6 py-16 md:py-24">
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {problems.map((problem, index) => {
          const Icon = problem.icon
          return (
            <Card key={index} className="border-border/50 shadow-sm">
              <CardContent className="pt-8 pb-8 px-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-balance">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
